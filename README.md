# Project Documentation

This repository contains various tools and utilities for development workflow automation.

## Project Structure

### Source Code
The source code is organized in the `src/` directory:
```
src/
├── jira/              # Jira integration
│   ├── api/          # Core API functionality
│   │   ├── create-ticket-api.js  # Ticket creation
│   │   ├── get-tickets-api.js    # Ticket retrieval
│   │   └── move-ticket-api.js    # Ticket status updates
│   └── scripts/      # CLI scripts
│       └── create-story.js
```

### Tests
Tests are organized by type in the `tests/` directory:
```
tests/
├── unit/           # Unit tests
│   └── jira/       # Jira-related tests
├── integration/    # Integration tests
├── ui/            # UI/End-to-End tests
└── performance/   # Performance tests
```
For detailed test guidelines and structure, see [Test Documentation](tests/README.md)

### Documentation
```
docs/
├── JIRA.md        # Jira integration documentation
└── FEATURES.md    # Feature documentation
```

### Configuration
- `.cursorrules` - Global cursor rules
- `.cursor/rules/` - Test-specific cursor rules
- `.env` - Environment configuration
- `package.json` - Project dependencies and scripts

## Features

### Jira Integration
This project includes built-in JIRA integration capabilities for streamlined ticket management and workflow automation. For detailed setup instructions and usage guidelines, please refer to our [JIRA Integration Guide](docs/JIRA.md).

Key features include:
- Automated story creation
- Ticket status management
- In-progress ticket retrieval
- Move tickets to Done with team notification
- Environment-based configuration
- Project key management
- Label automation

## Cursor Rules

The project includes several cursor rules that help maintain consistent code quality and development practices:

### Testing Guidelines
- Enforces usage of latest testing frameworks, libraries, and tools
- Requires comprehensive test documentation including:
  - JIRA ticket reference (SCRUM-XXXX format)
  - Test intent description
  - Expected outcome specification

### Cursorrules structure
- The global Cursor rules are defined in `.cursorrules` in the root of this project.
- Testing specific rules are located in `.cursor/rules`.

### Test Directory Structure
Tests are organized by type in the `tests/` directory:
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── ui/            # UI/End-to-End tests
└── performance/   # Performance tests
```
For detailed test guidelines and structure, see [Test Documentation](tests/README.md)

### JIRA Integration Rules
- Standardizes JIRA ticket creation through command line interface
- Uses format: `node create-story.js <summary> <description>`
- Automatically assigns appropriate labels and project keys