const { createJiraTicket } = require('../../../../src/jira/api/create-ticket-api');

// Mock the API module
jest.mock('../../../../src/jira/api/create-ticket-api');

describe('Create Story Script', () => {
    let originalArgv;
    let mockExit;
    let mockConsoleError;
    let mockConsoleLog;

    beforeEach(() => {
        // Save original process.argv
        originalArgv = process.argv;
        
        // Mock process.exit
        mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
        
        // Mock console methods
        mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
        
        // Reset API mock
        createJiraTicket.mockReset();
    });

    afterEach(() => {
        // Restore original process.argv
        process.argv = originalArgv;
        
        // Restore mocks
        mockExit.mockRestore();
        mockConsoleError.mockRestore();
        mockConsoleLog.mockRestore();
    });

    /**
     * @ticket SCRUM-1
     * @intent Verify script handles missing arguments
     * @expected Should show usage message and exit with code 1
     */
    test('should handle missing arguments', async () => {
        // Set empty arguments
        process.argv = ['node', 'create-story.js'];
        
        // Import script (this will execute it)
        require('../../../../src/jira/scripts/create-story');
        
        expect(mockConsoleError).toHaveBeenCalledWith(
            'Usage: node src/jira/scripts/create-story.js "Story Summary" "Story Description"'
        );
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    /**
     * @ticket SCRUM-1
     * @intent Verify successful ticket creation
     * @expected Should create ticket and log success message
     */
    test('should create ticket successfully', async () => {
        // Mock successful ticket creation
        const mockTicket = {
            key: 'SCRUM-123',
            status: 'To Do',
            assignee: 'test@example.com'
        };
        createJiraTicket.mockResolvedValueOnce(mockTicket);

        // Set arguments
        process.argv = ['node', 'create-story.js', 'Test Summary', 'Test Description'];
        
        // Import script
        require('../../../../src/jira/scripts/create-story');
        
        // Verify API call
        expect(createJiraTicket).toHaveBeenCalledWith({
            summary: 'Test Summary',
            description: 'Test Description',
            issueType: 'Story',
            labels: ['test']
        });

        // Wait for async operations
        await new Promise(process.nextTick);
        
        // Verify output
        expect(mockConsoleLog).toHaveBeenCalledWith('Created story:', mockTicket);
    });

    /**
     * @ticket SCRUM-1
     * @intent Verify error handling
     * @expected Should log error message
     */
    test('should handle API errors', async () => {
        // Mock API error
        const error = new Error('API Error');
        createJiraTicket.mockRejectedValueOnce(error);

        // Set arguments
        process.argv = ['node', 'create-story.js', 'Test Summary', 'Test Description'];
        
        // Import script
        require('../../../../src/jira/scripts/create-story');
        
        // Wait for async operations
        await new Promise(process.nextTick);
        
        // Verify error handling
        expect(mockConsoleError).toHaveBeenCalledWith('Failed to create story:', error);
    });
}); 