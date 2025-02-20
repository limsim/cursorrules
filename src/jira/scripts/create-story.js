require('dotenv').config();
const { createJiraTicket } = require('../api/create-ticket-api');

async function createStory(summary, description) {
    if (!summary || !description) {
        console.error('Usage: node src/jira/scripts/create-story.js "Story Summary" "Story Description"');
        process.exit(1);
    }

    try {
        const ticket = await createJiraTicket({
            summary,
            description,
            issueType: 'Story',
            labels: ['test']
        });
        console.log('Created story:', ticket);
    } catch (error) {
        console.error('Failed to create story:', error);
    }
}

// Get command line arguments (skip first two args which are node and script name)
const [summary, description] = process.argv.slice(2);
createStory(summary, description); 