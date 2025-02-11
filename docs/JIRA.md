# Jira Integration Guide

This document describes how to set up and use the Jira integration functionality in this repository.

## Directory Structure

```
src/
├── jira/
│   ├── api/
│   │   └── jira-api.js     # Core Jira API integration
│   └── scripts/
│       └── create-story.js  # Story creation script
```

## Setup

### Prerequisites
- Node.js installed
- Jira account with API token access
- Access to your Jira instance

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

## Code Structure

The Jira integration consists of two main files:

### 1. src/jira/api/jira-api.js
Core Jira API integration that:
- Handles authentication
- Makes API requests
- Manages error handling

Example usage:
```javascript
const { createJiraTicket } = require('../api/jira-api');

// Create a story
await createJiraTicket({
    summary: "Your Story Title",
    description: "Your Story Description",
    issueType: "Story",
    labels: ["test"]
});
```

### 2. src/jira/scripts/create-story.js
Story creation script that:
- Provides command-line interface
- Validates inputs
- Creates stories using the Jira API

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