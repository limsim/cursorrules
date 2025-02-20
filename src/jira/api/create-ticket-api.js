const fetch = require('node-fetch');

// Jira API configuration
const config = {
    host: process.env.JIRA_HOST, // e.g., 'your-domain.atlassian.net'
    email: process.env.JIRA_EMAIL,
    apiToken: process.env.JIRA_API_TOKEN,
    projectKey: process.env.JIRA_PROJECT_KEY || 'SCRUM'
};

// Create Jira ticket function
async function createJiraTicket({ summary, description, issueType = 'Story', labels = [] }) {
    const url = `https://${config.host}/rest/api/3/issue`;
    const auth = Buffer.from(`${config.email}:${config.apiToken}`).toString('base64');

    const body = {
        fields: {
            project: {
                key: config.projectKey
            },
            summary: summary,
            description: {
                type: 'doc',
                version: 1,
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: description
                            }
                        ]
                    }
                ]
            },
            issuetype: {
                name: issueType
            },
            labels: labels
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Ticket created successfully:', data.key);
        return data;
    } catch (error) {
        console.error('Error creating Jira ticket:', error);
        throw error;
    }
}

// Example usage
async function createTestingRulesTicket() {
    try {
        const ticket = await createJiraTicket({
            summary: 'Implement Cursor Rules for Unit Testing',
            description: `Create and implement cursor rules for maintaining consistent unit testing practices.

Key Requirements:
1. Latest testing framework version
2. Latest testing library version
3. Latest testing tools
4. Test documentation requirements:
   - JIRA ticket reference
   - Test intent
   - Expected outcomes`,
            labels: ['cursor-rules', 'testing', 'unit-tests']
        });
        console.log('Testing rules ticket created:', ticket);
    } catch (error) {
        console.error('Failed to create testing rules ticket:', error);
    }
}

// Export functions for use in other files
module.exports = {
    createJiraTicket,
    createTestingRulesTicket
};


// TODO: Create API to create JIRA ticket