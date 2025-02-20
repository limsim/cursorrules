# Jira Integration Guide

This document describes how to set up and use the Jira integration functionality in this repository.

## Directory Structure

```
src/
├── jira/
│   ├── api/
│   │   ├── create-ticket-api.js  # Ticket creation
│   │   ├── get-tickets-api.js    # Ticket retrieval
│   │   └── move-ticket-api.js    # Ticket status updates
│   └── scripts/
│       ├── create-story.js       # Story creation script
│       ├── get-tickets.js        # Ticket listing script
│       └── move-to-done.js       # Status update script
```

## Setup

### Prerequisites
- Node.js installed
- Jira account with API token access
- Access to your Jira instance
- Slack workspace (for notifications)

### Environment Configuration

1. Create a `.env` file in the root directory with your Jira configuration:
```env
JIRA_HOST=your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=YOUR_PROJECT
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Creating Stories

You can create stories in two ways:

1. Using Node directly:
```bash
node src/jira/scripts/create-story.js "Story Summary" "Story Description"
```

2. Using npm script:
```bash
npm run create:story "Story Summary" "Story Description"
```

### Getting Assigned Tickets

To view tickets assigned to you that are in progress:
```bash
npm run get:tickets
```

### Moving Tickets to Done

You can move tickets to Done status in two ways:

1. Using Node directly:
```bash
node src/jira/scripts/move-to-done.js "TICKET-ID"
```

2. Using npm script:
```bash
npm run move:done "TICKET-ID"
```

The moveTicketToDone functionality:
1. Moves the ticket to Done status
2. Automatically unassigns the ticket
3. Notifies the team via Slack

Example response:
```javascript
{
    status: 'Done',
    assignee: null,
    assigneeUpdateTime: '2024-01-20T10:00:00Z',
    notificationSent: true
}
```

## Code Structure

The Jira integration consists of three main API files:

### 1. create-ticket-api.js
Core ticket creation functionality:
- Creates new Jira tickets
- Handles authentication
- Manages error handling

### 2. get-tickets-api.js
Ticket retrieval functionality:
- Gets tickets assigned to current user
- Filters by "In Progress" status
- Returns formatted ticket list

### 3. move-ticket-api.js
Ticket status management:
- Moves tickets to Done status
- Unassigns tickets
- Sends Slack notifications
- Handles notification failures gracefully

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Configure your `.env` file with Jira credentials
4. Create your first story:
```bash
npm run create:story "My First Story" "This is a test story"
```

## Security Notes

1. Never commit your `.env` file
2. Keep your API token secure
3. Use environment variables for sensitive data
4. Regularly rotate your API tokens
5. Ensure Slack webhook URLs are secured 