const { moveTicketToDone } = require('../../../src/jira/api/move-ticket-api');

/**
 * @ticket SCRUM-5
 * @intent Validate that a ticket can be moved to Done status
 * @expected The ticket should be moved to Done and unassigned
 */
describe('Move Ticket to Done', () => {
    let mockTicketId;
    let mockSlackNotifier;

    beforeEach(() => {
        mockTicketId = 'SCRUM-123';
        mockSlackNotifier = {
            notifyTeam: jest.fn().mockResolvedValue(true)
        };
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify successful ticket transition to Done
     * @expected Ticket should be moved to Done status successfully
     */
    test('should successfully move ticket to Done status', async () => {
        const result = await moveTicketToDone(mockTicketId);
        
        expect(result.status).toBe('Done');
        expect(result.assignee).toBeNull();
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify ticket is unassigned when moved to Done
     * @expected Ticket should have no assignee after being moved to Done
     */
    test('should unassign the ticket when moved to Done', async () => {
        const result = await moveTicketToDone(mockTicketId);
        
        expect(result.assignee).toBeNull();
        expect(result.assigneeUpdateTime).toBeDefined();
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify Slack notification is sent when ticket is moved to Done
     * @expected Slack notification should be sent successfully
     */
    test('should notify team on Slack when ticket is moved to Done', async () => {
        const result = await moveTicketToDone(mockTicketId, mockSlackNotifier);
        
        expect(mockSlackNotifier.notifyTeam).toHaveBeenCalledWith({
            ticketId: mockTicketId,
            status: 'Done',
            action: 'moved to Done'
        });
        expect(result.notificationSent).toBe(true);
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify error handling when ticket ID is invalid
     * @expected Should throw an error with appropriate message
     */
    test('should throw error when ticket ID is invalid', async () => {
        const invalidTicketId = 'INVALID-123';
        
        await expect(moveTicketToDone(invalidTicketId))
            .rejects
            .toThrow('Invalid ticket ID or ticket not found');
    });

    /**
     * @ticket SCRUM-5
     * @intent Verify error handling when Slack notification fails
     * @expected Should complete ticket move but indicate notification failure
     */
    test('should handle Slack notification failure gracefully', async () => {
        mockSlackNotifier.notifyTeam.mockRejectedValueOnce(new Error('Slack notification failed'));
        
        const result = await moveTicketToDone(mockTicketId, mockSlackNotifier);
        
        expect(result.status).toBe('Done');
        expect(result.assignee).toBeNull();
        expect(result.notificationSent).toBe(false);
        expect(result.notificationError).toBeDefined();
    });
}); 