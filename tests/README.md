# Test Directory Structure

This directory contains all test files organized by test type. Each subdirectory follows specific testing guidelines as defined in the cursor rules.

## Directory Structure

```
tests/
├── unit/           # Unit tests
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

## Running Tests

Tests can be run:
- Individually
- By feature group
- Complete test suite

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