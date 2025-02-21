const { getAssignedTickets } = require('../../../../src/jira/api/get-tickets-api');

// Mock the API module
jest.mock('../../../../src/jira/api/get-tickets-api');

describe('Get Tickets Script', () => {
    let mockConsoleLog;
    let mockConsoleError;
    let mockExit;

    beforeEach(() => {
        // Mock console methods
        mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
        mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

        // Reset API mock
        getAssignedTickets.mockReset();
    });

    afterEach(() => {
        // Restore mocks
        mockConsoleLog.mockRestore();
        mockConsoleError.mockRestore();
        mockExit.mockRestore();
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify successful ticket retrieval and display
     * @expected Should display formatted list of tickets
     */
    test('should display assigned tickets successfully', async () => {
        // Mock successful API response
        const mockTickets = [
            'SCRUM-123 - First ticket',
            'SCRUM-124 - Second ticket'
        ];
        getAssignedTickets.mockResolvedValueOnce(mockTickets);

        // Import and execute script
        require('../../../../src/jira/scripts/get-tickets');

        // Wait for async operations
        await new Promise(process.nextTick);

        // Verify output
        expect(mockConsoleLog).toHaveBeenCalledWith('\nAssigned Tickets:\n');
        mockTickets.forEach(ticket => {
            expect(mockConsoleLog).toHaveBeenCalledWith(ticket);
        });
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify error handling
     * @expected Should log error and exit with code 1
     */
    test('should handle API errors', async () => {
        // Mock API error
        const error = new Error('API Error');
        getAssignedTickets.mockRejectedValueOnce(error);

        // Import and execute script
        require('../../../../src/jira/scripts/get-tickets');

        // Wait for async operations
        await new Promise(process.nextTick);

        // Verify error handling
        expect(mockConsoleError).toHaveBeenCalledWith('Failed to fetch tickets:', error);
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify empty results handling
     * @expected Should display empty list message
     */
    test('should handle empty results', async () => {
        // Mock empty response
        getAssignedTickets.mockResolvedValueOnce([]);

        // Import and execute script
        require('../../../../src/jira/scripts/get-tickets');

        // Wait for async operations
        await new Promise(process.nextTick);

        // Verify output
        expect(mockConsoleLog).toHaveBeenCalledWith('\nAssigned Tickets:\n');
    });
}); 