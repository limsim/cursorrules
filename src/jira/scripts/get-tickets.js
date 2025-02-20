require('dotenv').config();
const { getAssignedTickets } = require('../api/get-tickets-api');

/**
 * Display all tickets assigned to the current user
 */
async function displayAssignedTickets() {
    try {
        const tickets = await getAssignedTickets();
        console.log('\nAssigned Tickets:\n');
        tickets.forEach(ticket => console.log(ticket));
    } catch (error) {
        console.error('Failed to fetch tickets:', error);
        process.exit(1);
    }
}

// Run the script
displayAssignedTickets(); 