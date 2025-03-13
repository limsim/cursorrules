# Features Documentation

## Jira Integration Features

### 1. Create Story
- Creates new Jira tickets with specified summary and description
- Automatically assigns appropriate labels
- Supports custom issue types
- Command: `npm run create:story "Summary" "Description"`

#### Core Functionality
- Automatic assignment to current user
- Initial status set to "To Do"
- Verification of ticket creation and status
- Support for custom issue types and labels

#### Usage Example
```javascript
const { createJiraTicket } = require('./src/jira/api/create-ticket-api');

// Basic ticket creation
const ticket = await createJiraTicket({
    summary: 'New Feature',
    description: 'Implement new functionality'
});

// Advanced usage with custom type and labels
const bugTicket = await createJiraTicket({
    summary: 'Critical Bug',
    description: 'Fix urgent issue',
    issueType: 'Bug',
    labels: ['critical', 'frontend']
});
```

#### Response Format
```javascript
{
    id: '10000',
    key: 'SCRUM-123',
    self: 'https://your-domain.atlassian.net/rest/api/3/issue/10000',
    status: 'To Do',
    assignee: 'user@example.com'
}
```

#### Test Coverage
Our test suite (`tests/unit/jira/createTicket.test.js`) provides comprehensive coverage:

1. **Basic Functionality**
   - ✓ Creation with required fields (summary, description)
   - ✓ Default values (Story type, empty labels)
   - ✓ Response format validation

2. **Automatic Assignment**
   - ✓ Ticket assigned to current user
   - ✓ Initial status set to "To Do"
   - ✓ Status transition verification

3. **Custom Fields**
   - ✓ Custom issue types (e.g., Bug)
   - ✓ Custom labels
   - ✓ Project key configuration

4. **Error Handling**
   - ✓ Invalid ticket creation
   - ✓ Failed status verification
   - ✓ API response errors

5. **Environment Configuration**
   - ✓ Host configuration
   - ✓ Authentication
   - ✓ Project settings

#### Error Handling
The API handles various error scenarios:
```javascript
try {
    const ticket = await createJiraTicket({
        summary: 'Test Ticket',
        description: 'Test Description'
    });
} catch (error) {
    // Handles:
    // - Network errors
    // - Authentication failures
    // - Invalid input
    // - Status verification failures
}
```

### 2. Get In-Progress Tickets
- Retrieves all tickets assigned to the current user
- Filters for "In Progress" status
- Returns formatted list of tickets
- Command: `npm run get:tickets`

#### Core Functionality
- Automatic filtering by current user
- Status-based filtering ("In Progress")
- Formatted ticket output
- Sorting by creation date
- Error handling with meaningful messages

#### Usage Example
```javascript
const { getAssignedTickets } = require('./src/jira/api/get-tickets-api');

// Basic usage - get all in-progress tickets
const tickets = await getAssignedTickets();
console.log('Assigned Tickets:');
tickets.forEach(ticket => console.log(ticket));

// Example output:
// SCRUM-123 - Implement new feature
// SCRUM-124 - Fix critical bug
```

#### Response Format
```javascript
// Returns array of formatted strings
[
    'SCRUM-123 - Implement new feature',
    'SCRUM-124 - Fix critical bug'
]

// Raw API response format (before formatting)
{
    issues: [
        {
            key: 'SCRUM-123',
            fields: {
                summary: 'Implement new feature',
                status: { name: 'In Progress' }
            }
        },
        // ... more tickets
    ]
}
```

#### Test Coverage
Our test suite (`tests/unit/jira/getTickets.test.js`) provides comprehensive coverage:

1. **Basic Functionality**
   - ✓ Retrieval of in-progress tickets for current user
   - ✓ Correct formatting of ticket strings
   - ✓ Empty results handling
   - ✓ Long summary handling

2. **Request Validation**
   - ✓ JQL query construction
   - ✓ Authentication headers
   - ✓ Status filter verification
   - ✓ User assignment filter

3. **Response Formatting**
   - ✓ "issueId - Summary" format
   - ✓ Special characters in summaries
   - ✓ Multiple tickets handling
   - ✓ Empty response handling

4. **Error Handling**
   - ✓ API failures (401, 403, etc.)
   - ✓ Malformed API responses
   - ✓ Network errors
   - ✓ Invalid response format

5. **Environment Configuration**
   - ✓ Host configuration
   - ✓ Authentication setup
   - ✓ Project key validation
   - ✓ API endpoint verification

#### Error Handling
The API handles various error scenarios:
```javascript
try {
    const tickets = await getAssignedTickets();
} catch (error) {
    // Handles:
    // - Network connectivity issues
    // - Authentication failures
    // - Invalid API responses
    // - JQL query errors
    // - Rate limiting
    console.error('Failed to fetch tickets:', error.message);
}
```

#### Command Line Usage
```bash
# Get all in-progress tickets
npm run get:tickets

# Example output:
# Assigned Tickets:
# SCRUM-123 - Implement new feature
# SCRUM-124 - Fix critical bug
```

#### JQL Query Details
The API uses the following JQL query structure:
```sql
assignee = currentUser() 
AND status = "In Progress" 
ORDER BY created DESC
```

### 3. Move Ticket to Done
- Moves specified ticket to Done status
- Automatically unassigns the ticket
- Notifies team via Slack
- Command: `npm run move:done "TICKET-ID"`

#### Core Functionality
- Automatic status transition to Done
- Automatic ticket unassignment
- Slack team notifications
- Verification of status change
- Graceful notification failure handling

#### Usage Example
```javascript
const { moveTicketToDone } = require('./src/jira/api/move-ticket-api');

// Basic usage
const result = await moveTicketToDone('SCRUM-123');

// With Slack notifications
const slackNotifier = {
    notifyTeam: async (message) => {
        // Custom notification logic
        console.log('Team notified:', message);
    }
};
const resultWithNotification = await moveTicketToDone('SCRUM-123', slackNotifier);
```

#### Response Format
```javascript
{
    status: 'Done',
    assignee: null,
    assigneeUpdateTime: '2024-01-20T10:00:00Z',
    notificationSent: true,
    // If notification fails:
    notificationError?: 'Error message'
}
```

#### Test Coverage
Our test suite (`tests/unit/jira/moveToDone.test.js`) provides comprehensive coverage:

1. **Basic Functionality**
   - ✓ Moving ticket to Done status
   - ✓ Unassigning the ticket
   - ✓ Response format validation
   - ✓ Status transition verification

2. **Slack Notifications**
   - ✓ Successful team notification
   - ✓ Notification content verification
   - ✓ Graceful handling of notification failures
   - ✓ Optional notifier parameter

3. **Status Management**
   - ✓ Proper status transition
   - ✓ Assignee removal
   - ✓ Timestamp verification
   - ✓ State verification after move

4. **Error Handling**
   - ✓ Invalid ticket IDs
   - ✓ Network failures
   - ✓ Authentication errors
   - ✓ Status transition failures

5. **Environment Configuration**
   - ✓ API endpoint configuration
   - ✓ Authentication setup
   - ✓ Slack integration settings

#### Error Handling
The API handles various error scenarios:
```javascript
try {
    const result = await moveTicketToDone('SCRUM-123', slackNotifier);
} catch (error) {
    // Handles:
    // - Invalid ticket IDs
    // - Network errors
    // - Authentication failures
    // - Status transition failures
    // - Notification system errors
    console.error('Failed to move ticket:', error.message);
}
```

#### Command Line Usage
```bash
# Move a ticket to Done
npm run move:done "SCRUM-123"

# Response example:
# Ticket SCRUM-123 moved to Done:
# {
#   "status": "Done",
#   "assignee": null,
#   "assigneeUpdateTime": "2024-01-20T10:00:00Z",
#   "notificationSent": true
# }
```

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

asdfasd