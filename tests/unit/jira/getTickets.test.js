const { getAssignedTickets } = require('../../../src/jira/api/get-tickets-api');
const fetch = require('node-fetch');

// Mock node-fetch
jest.mock('node-fetch');

describe('Get Assigned Tickets', () => {
    let mockTicketsData;

    beforeEach(() => {
        // Reset mocks
        fetch.mockReset();

        // Mock data for successful ticket retrieval
        mockTicketsData = {
            issues: [
                {
                    key: 'SCRUM-123',
                    fields: {
                        summary: 'First test ticket',
                        status: { name: 'In Progress' }
                    }
                },
                {
                    key: 'SCRUM-124',
                    fields: {
                        summary: 'Second test ticket',
                        status: { name: 'In Progress' }
                    }
                }
            ]
        };

        // Configure environment variables
        process.env.JIRA_HOST = 'test.atlassian.net';
        process.env.JIRA_EMAIL = 'test@example.com';
        process.env.JIRA_API_TOKEN = 'test-token';
        process.env.JIRA_PROJECT_KEY = 'SCRUM';
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify retrieval of in-progress tickets assigned to current user
     * @expected Should return formatted list of tickets with correct format
     */
    test('should retrieve in-progress tickets for current user', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockTicketsData)
        });

        const tickets = await getAssignedTickets();

        // Verify the request
        expect(fetch).toHaveBeenCalledTimes(1);
        const [url, config] = fetch.mock.calls[0];

        // Verify JQL query includes required filters (URL decoded for readability)
        const decodedUrl = decodeURIComponent(url);
        expect(decodedUrl).toContain('assignee = currentUser()');
        expect(decodedUrl).toContain('status = "In Progress"');

        // Verify authentication
        expect(config.headers.Authorization).toBeDefined();

        // Verify response format
        expect(tickets).toEqual([
            'SCRUM-123 - First test ticket',
            'SCRUM-124 - Second test ticket'
        ]);
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify correct formatting of ticket strings
     * @expected Each ticket should be formatted as "issueId - Summary"
     */
    test('should format tickets correctly', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                issues: [{
                    key: 'SCRUM-123',
                    fields: {
                        summary: 'Test summary with special chars: @#$',
                        status: { name: 'In Progress' }
                    }
                }]
            })
        });

        const tickets = await getAssignedTickets();
        expect(tickets[0]).toBe('SCRUM-123 - Test summary with special chars: @#$');
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify handling of empty results
     * @expected Should return empty array when no tickets are found
     */
    test('should handle empty results', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ issues: [] })
        });

        const tickets = await getAssignedTickets();
        expect(tickets).toEqual([]);
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify error handling for API failures
     * @expected Should throw error with appropriate message
     */
    test('should handle API errors', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 401
        });

        await expect(getAssignedTickets())
            .rejects
            .toThrow('HTTP error! status: 401');
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify handling of malformed API responses
     * @expected Should throw error when response is not in expected format
     */
    test('should handle malformed responses', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ malformed: 'response' })
        });

        await expect(getAssignedTickets())
            .rejects
            .toThrow('Invalid response format');
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify handling of long summaries
     * @expected Should handle long summaries without truncation
     */
    test('should handle long summaries', async () => {
        const longSummary = 'A'.repeat(200);
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                issues: [{
                    key: 'SCRUM-123',
                    fields: {
                        summary: longSummary,
                        status: { name: 'In Progress' }
                    }
                }]
            })
        });

        const tickets = await getAssignedTickets();
        expect(tickets[0]).toBe(`SCRUM-123 - ${longSummary}`);
    });
}); 