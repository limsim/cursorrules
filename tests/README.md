# Test Directory Structure

This directory contains all test files organized by test type. Each subdirectory follows specific testing guidelines as defined in the cursor rules.

## Directory Structure

```
tests/
├── unit/           # Unit tests
│   └── jira/       # Jira-related tests
│       └── createTicket.test.js  # Ticket creation tests
├── integration/    # Integration tests
├── ui/            # UI/End-to-End tests
└── performance/   # Performance tests
```

## Test Guidelines

All tests must follow these guidelines as per `.cursorrules`:

1. Use latest versions of:
   - Testing framework
   - Testing library
   - Testing tools

2. Test Documentation Requirements:
   Each test must include a comment header with:
   ```javascript
   /**
    * @ticket SCRUM-1234
    * @intent Description of what this test is verifying
    * @expected Expected outcome of the test
    */
   ```

## Example: Jira Ticket Creation Tests

The `createTicket.test.js` file demonstrates our testing best practices:

### 1. Test Setup
```javascript
beforeEach(() => {
    // Reset mocks between tests
    fetch.mockReset();
    
    // Prepare test data
    mockTicketData = {...};
    
    // Configure environment
    process.env.JIRA_HOST = 'test.atlassian.net';
});
```

### 2. Test Organization
- Grouped by functionality
- Clear test descriptions
- Comprehensive coverage
- Isolated test cases

### 3. Mocking External Dependencies
```javascript
jest.mock('node-fetch');
// Mock API responses for predictable testing
fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(mockData)
});
```

### 4. Assertions
```javascript
// Verify API calls
expect(fetch).toHaveBeenCalledTimes(2);

// Verify request data
expect(requestBody.fields.summary).toBe('Test Ticket');

// Verify response handling
expect(result).toEqual({
    status: 'To Do',
    assignee: 'test@example.com'
});
```

## Running Tests

Tests can be run:
- Individually: `npm test tests/unit/jira/createTicket.test.js`
- By feature group: `npm test tests/unit/jira/*`
- Complete test suite: `npm test`

## Test Types

### Unit Tests
- Focus on single unit of functionality
- Keep mocks and stubs minimal
- Avoid shared state

### Integration Tests
- Test component interactions
- Use realistic test data
- Clean up after each test

### UI Tests
- One UI interaction per test
- Use semantic selectors
- Include accessibility testing

### Performance Tests
- Define clear benchmarks
- Document environment requirements
- Include cleanup procedures 