const { createJiraTicket } = require('../../../src/jira/api/create-ticket-api');
const fetch = require('node-fetch');

// Mock node-fetch
jest.mock('node-fetch');

describe('Create Jira Ticket', () => {
    let mockTicketData;
    let mockVerifyData;

    beforeEach(() => {
        // Reset mocks
        fetch.mockReset();

        // Mock data for successful ticket creation
        mockTicketData = {
            id: '10000',
            key: 'SCRUM-123',
            self: 'https://your-domain.atlassian.net/rest/api/3/issue/10000'
        };

        // Mock data for verification response
        mockVerifyData = {
            fields: {
                status: { name: 'To Do' },
                assignee: { emailAddress: 'test@example.com' }
            }
        };

        // Configure environment variables
        process.env.JIRA_HOST = 'test.atlassian.net';
        process.env.JIRA_EMAIL = 'test@example.com';
        process.env.JIRA_API_TOKEN = 'test-token';
        process.env.JIRA_PROJECT_KEY = 'SCRUM';
    });

    /**
     * @ticket SCRUM-1
     * @intent Verify successful ticket creation with all required fields
     * @expected Ticket should be created with correct summary, description, and default values
     */
    test('should create a ticket with all required fields', async () => {
        // Mock successful responses
        fetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockTicketData)
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockVerifyData)
            });

        const result = await createJiraTicket({
            summary: 'Test Ticket',
            description: 'Test Description'
        });

        // Verify the create request
        expect(fetch).toHaveBeenCalledTimes(2);
        const createCall = fetch.mock.calls[0];
        const requestBody = JSON.parse(createCall[1].body);

        // Verify required fields
        expect(requestBody.fields.summary).toBe('Test Ticket');
        expect(requestBody.fields.description.content[0].content[0].text).toBe('Test Description');
        expect(requestBody.fields.issuetype.name).toBe('Story');
        expect(requestBody.fields.project.key).toBe('SCRUM');

        // Verify response
        expect(result).toEqual({
            ...mockTicketData,
            status: 'To Do',
            assignee: 'test@example.com'
        });
    });

    /**
     * @ticket SCRUM-1
     * @intent Verify ticket is assigned to current user and set to "To Do" status
     * @expected Ticket should have correct assignee and status
     */
    test('should assign ticket to current user and set To Do status', async () => {
        fetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockTicketData)
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockVerifyData)
            });

        await createJiraTicket({
            summary: 'Test Ticket',
            description: 'Test Description'
        });

        // Verify the create request
        const createCall = fetch.mock.calls[0];
        const requestBody = JSON.parse(createCall[1].body);

        // Verify assignee and status
        expect(requestBody.fields.assignee.accountId).toBe('currentUser()');
        expect(requestBody.fields.status.name).toBe('To Do');
        expect(requestBody.transition.id).toBe('11');
    });

    /**
     * @ticket SCRUM-1
     * @intent Verify error handling for failed ticket creation
     * @expected Should throw error with appropriate message
     */
    test('should handle ticket creation failure', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 400
        });

        await expect(createJiraTicket({
            summary: 'Test Ticket',
            description: 'Test Description'
        })).rejects.toThrow('HTTP error! status: 400');
    });

    /**
     * @ticket SCRUM-1
     * @intent Verify error handling for failed verification
     * @expected Should throw error if verification fails
     */
    test('should handle verification failure', async () => {
        fetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockTicketData)
            })
            .mockResolvedValueOnce({
                ok: false,
                status: 404
            });

        await expect(createJiraTicket({
            summary: 'Test Ticket',
            description: 'Test Description'
        })).rejects.toThrow('Failed to verify ticket status: 404');
    });

    /**
     * @ticket SCRUM-1
     * @intent Verify custom issue type and labels are handled correctly
     * @expected Ticket should be created with specified issue type and labels
     */
    test('should handle custom issue type and labels', async () => {
        fetch
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockTicketData)
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockVerifyData)
            });

        await createJiraTicket({
            summary: 'Test Ticket',
            description: 'Test Description',
            issueType: 'Bug',
            labels: ['critical', 'frontend']
        });

        const createCall = fetch.mock.calls[0];
        const requestBody = JSON.parse(createCall[1].body);

        expect(requestBody.fields.issuetype.name).toBe('Bug');
        expect(requestBody.fields.labels).toEqual(['critical', 'frontend']);
    });
}); 