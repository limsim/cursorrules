# Features Documentation

## Jira Integration Features

### 1. Create Story
- Creates new Jira tickets with specified summary and description
- Automatically assigns appropriate labels
- Supports custom issue types
- Command: `npm run create:story "Summary" "Description"`

### 2. Get In-Progress Tickets
- Retrieves all tickets assigned to the current user
- Filters for "In Progress" status
- Returns formatted list: "<issueId> - <Summary>"
- Command: `npm run get:tickets`

### 3. Move Ticket to Done
- Moves specified ticket to Done status
- Automatically unassigns the ticket
- Notifies team via Slack
- Handles notification failures gracefully

#### Usage
```javascript
const { moveTicketToDone } = require('./src/jira/api/move-ticket-api');

const result = await moveTicketToDone('SCRUM-123', slackNotifier);
```

#### Response Format
```javascript
{
    status: 'Done',
    assignee: null,
    assigneeUpdateTime: '2024-01-20T10:00:00Z',
    notificationSent: true
}
```

#### Error Handling
- Invalid ticket IDs throw appropriate errors
- Slack notification failures are handled gracefully
- Full error context is provided in response

## Testing

All features include comprehensive test coverage:

### Unit Tests
- Input validation
- Success scenarios
- Error handling
- Edge cases

### Test Documentation
Each test includes:
```javascript
/**
 * @ticket SCRUM-XXXX
 * @intent Description of what this test is verifying
 * @expected Expected outcome of the test
 */
```

## Future Enhancements
1. Support for additional ticket statuses
2. Bulk ticket operations
3. Additional notification channels
4. Custom field support 