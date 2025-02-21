const { moveTicketToDone } = require('../../../../src/jira/api/move-ticket-api');

// Mock the API module
jest.mock('../../../../src/jira/api/move-ticket-api');

describe('Move to Done Script', () => {
    let originalArgv;
    let mockConsoleLog;
    let mockConsoleError;
    let mockExit;

    beforeEach(() => {
        // Save original process.argv
        originalArgv = process.argv;

        // Mock console methods
        mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
        mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

        // Reset API mock
        moveTicketToDone.mockReset();
    });

    afterEach(() => {
        // Restore original process.argv
        process.argv = originalArgv;

        // Restore mocks
        mockConsoleLog.mockRestore();
        mockConsoleError.mockRestore();
        mockExit.mockRestore();
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify script handles missing ticket ID
     * @expected Should show usage message and exit with code 1
     */
    test('should handle missing ticket ID', async () => {
        // Set empty arguments
        process.argv = ['node', 'move-to-done.js'];

        // Import script
        require('../../../../src/jira/scripts/move-to-done');

        expect(mockConsoleError).toHaveBeenCalledWith(
            'Usage: node src/jira/scripts/move-to-done.js "TICKET-ID"'
        );
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify successful ticket move to Done
     * @expected Should move ticket and display success message
     */
    test('should move ticket to Done successfully', async () => {
        // Mock successful API response
        const mockResult = {
            status: 'Done',
            assignee: null,
            assigneeUpdateTime: '2024-01-20T10:00:00Z',
            notificationSent: true
        };
        moveTicketToDone.mockResolvedValueOnce(mockResult);

        // Set arguments
        process.argv = ['node', 'move-to-done.js', 'SCRUM-123'];

        // Import script
        require('../../../../src/jira/scripts/move-to-done');

        // Wait for async operations
        await new Promise(process.nextTick);

        // Verify API call
        expect(moveTicketToDone).toHaveBeenCalledWith(
            'SCRUM-123',
            expect.objectContaining({
                notifyTeam: expect.any(Function)
            })
        );

        // Verify output
        expect(mockConsoleLog).toHaveBeenCalledWith('\nTicket SCRUM-123 moved to Done:');
        expect(mockConsoleLog).toHaveBeenCalledWith(JSON.stringify(mockResult, null, 2));
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify error handling
     * @expected Should log error and exit with code 1
     */
    test('should handle API errors', async () => {
        // Mock API error
        const error = new Error('API Error');
        moveTicketToDone.mockRejectedValueOnce(error);

        // Set arguments
        process.argv = ['node', 'move-to-done.js', 'SCRUM-123'];

        // Import script
        require('../../../../src/jira/scripts/move-to-done');

        // Wait for async operations
        await new Promise(process.nextTick);

        // Verify error handling
        expect(mockConsoleError).toHaveBeenCalledWith('Failed to move ticket:', error.message);
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify Slack notification handling
     * @expected Should send notification when ticket is moved
     */
    test('should handle Slack notifications', async () => {
        // Mock successful API response with notification
        const mockResult = {
            status: 'Done',
            assignee: null,
            assigneeUpdateTime: '2024-01-20T10:00:00Z',
            notificationSent: true
        };
        moveTicketToDone.mockImplementationOnce(async (ticketId, notifier) => {
            await notifier.notifyTeam({
                ticketId,
                status: 'Done',
                action: 'moved to Done'
            });
            return mockResult;
        });

        // Set arguments
        process.argv = ['node', 'move-to-done.js', 'SCRUM-123'];

        // Import script
        require('../../../../src/jira/scripts/move-to-done');

        // Wait for async operations
        await new Promise(process.nextTick);

        // Verify notification was logged
        expect(mockConsoleLog).toHaveBeenCalledWith(
            'Notifying team:',
            expect.objectContaining({
                ticketId: 'SCRUM-123',
                status: 'Done',
                action: 'moved to Done'
            })
        );
    });
}); 