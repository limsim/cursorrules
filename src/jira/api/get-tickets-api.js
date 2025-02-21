require('dotenv').config();
const fetch = require('node-fetch');

// Jira API configuration
const config = {
    host: process.env.JIRA_HOST,
    email: process.env.JIRA_EMAIL,
    apiToken: process.env.JIRA_API_TOKEN,
    projectKey: process.env.JIRA_PROJECT_KEY
};

/**
 * Gets all Jira tickets assigned to the current user that are In Progress
 * @returns {Promise<string[]>} Array of formatted ticket strings
 */
async function getAssignedTickets() {
    // JQL to get tickets that are assigned to current user AND in "In Progress" status
    const jql = encodeURIComponent(`assignee = currentUser() AND status = "In Progress" ORDER BY created DESC`);
    const url = `https://${config.host}/rest/api/3/search?jql=${jql}&fields=summary,status`;
    const auth = Buffer.from(`${config.email}:${config.apiToken}`).toString('base64');

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Validate response format
        if (!data || !Array.isArray(data.issues)) {
            throw new Error('Invalid response format');
        }
        
        // Format tickets as "<issueId> - <Summary>"
        return data.issues.map(issue => `${issue.key} - ${issue.fields.summary}`);
    } catch (error) {
        console.error('Error fetching Jira tickets:', error);
        throw error;
    }
}

module.exports = {
    getAssignedTickets
};
