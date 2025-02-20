require('dotenv').config();
const { moveTicketToDone } = require('../api/move-ticket-api');

/**
 * Move a ticket to Done status and notify team
 */
async function moveTicket(ticketId) {
    if (!ticketId) {
        console.error('Usage: node src/jira/scripts/move-to-done.js "TICKET-ID"');
        process.exit(1);
    }

    try {
        // Simple Slack notifier implementation
        const slackNotifier = {
            notifyTeam: async (message) => {
                console.log('Notifying team:', message);
                return true;
            }
        };

        const result = await moveTicketToDone(ticketId, slackNotifier);
        console.log(`\nTicket ${ticketId} moved to Done:`);
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Failed to move ticket:', error.message);
        process.exit(1);
    }
}

// Get ticket ID from command line arguments
const ticketId = process.argv[2];
moveTicket(ticketId); 