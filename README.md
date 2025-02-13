# Project Documentation

This repository contains various tools and utilities for development workflow automation.

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

### JIRA Integration Rules
- Standardizes JIRA ticket creation through command line interface
- Uses format: `node create-story.js <summary> <description>`
- Automatically assigns appropriate labels and project keys

## JIRA Integration

This project includes built-in JIRA integration capabilities for streamlined ticket management and workflow automation. For detailed setup instructions and usage guidelines, please refer to our [JIRA Integration Guide](docs/JIRA.md).

Key features include:
- Automated story creation
- Environment-based configuration
- Project key management
- Label automation