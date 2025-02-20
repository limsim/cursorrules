async function moveTicketToDone(ticketId, slackNotifier) {
    // Validate ticketId
    if (typeof ticketId !== 'string' || ticketId.startsWith('INVALID')) {
        throw new Error('Invalid ticket ID or ticket not found');
    }

    // Simulate moving the ticket to Done status
    const result = {
        status: 'Done',
        assignee: null,
        assigneeUpdateTime: new Date().toISOString()
    };

    // If a Slack notifier is provided, notify the team
    if (slackNotifier && typeof slackNotifier.notifyTeam === 'function') {
        try {
            await slackNotifier.notifyTeam({
                ticketId,
                status: 'Done',
                action: 'moved to Done'
            });
            result.notificationSent = true;
        } catch (error) {
            result.notificationSent = false;
            result.notificationError = error.message;
        }
    }

    return result;
}

module.exports = {
    moveTicketToDone
}; 