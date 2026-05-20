
# ISC Testing Tools

This document outlines the testing tools selected for the **International Student Compass (ISC)** project, ensuring the platform remains reliable, secure, maintainable, and performant for students worldwide.

---

# Testing Tools Overview

| Area | Tool(s) Used | Why We Chose It |
|---|---|---|
| Frontend | Jest + Vue Test Utils | Fast, isolated component testing that ensures our Vue 3 components render and behave correctly. |
| Backend | Jest | Provides a consistent test runner across the 3-tier architecture for verifying backend business logic. |
| Functional (BDD) | Cucumber (Gherkin) | Uses human-readable `.feature` files to directly connect code behavior to SRS requirements. |
| API Testing | Bruno | A local-first, open-source, Git-friendly alternative to Postman for testing REST endpoints. |
| Static Analysis | SonarCloud | Monitors code smells, security vulnerabilities, duplication, and Cyclomatic Complexity (`CC`). |
| Workflow & Version Control | Git | Serves as the version control backbone for CI/CD workflows and automated quality gates. |

---

# Why These Tools?


## 1. Frontend & Backend Testing – Jest

### Consistency
Using the same testing framework for both the Vue.js frontend and Node.js backend simplifies the developer workflow and reduces tooling complexity.

### Speed
Jest executes tests in parallel, supporting rapid iteration and faster feedback during development.

### Mocking Capabilities
Jest provides strong mocking utilities, allowing API calls and external dependencies to be isolated during unit testing.

### Use Cases
- Verifying search and filtering logic
- Testing Vue component rendering
- Validating state management behavior
- Ensuring backend services process data correctly

---

# 2. Functional Testing – Cucumber & Feature Files

### Readability
Cucumber uses Gherkin syntax (`Given / When / Then`), making test scenarios understandable for both technical and non-technical stakeholders.

### Traceability
Feature files directly map user stories and SRS requirements to executable tests.

### Use Cases
- Student searches for a university
- User creates an account
- Scholarship filtering scenarios
- Authentication and login flows

### Example

```gherkin
Feature: University Search

Scenario: Student searches for a university
  Given the student is on the university page
  When they search for "Germany"
  Then a list of universities should appear
````

---

# 3. API Testing – Bruno

### Git Integration

Unlike Postman, Bruno stores collections locally as files, allowing API tests to be version-controlled directly with Git.

### Privacy & Local-First Workflow

Because Bruno is local-first, sensitive API data and requests remain within the development environment.

### Use Cases

* Testing REST endpoints
* Verifying HTTP status codes
* Validating JSON responses
* Ensuring secure HTTPS communication

### Example Endpoints Tested

* `GET /universities`
* `GET /scholarships`
* `POST /login`
* `POST /community/posts`

---

# 4. Static Analysis – SonarCloud

### Maintainability

SonarCloud continuously scans the codebase for:

* Code smells
* Bugs
* Security vulnerabilities
* Technical debt

### Architecture Metrics

The platform tracks software quality metrics such as:

* Cyclomatic Complexity (`CC`)
* Code Duplication
* Maintainability Ratings

### Use Cases

* Pre-merge quality checks
* Monitoring architectural health
* Preventing insecure code from reaching production
* Supporting long-term scalability

---

# Testing Pyramid in ISC

The ISC project follows a **Full Testing Pyramid** approach:

```text
                Behavioral Tests
             (Cucumber Feature Files)

                Contract/API Tests
                      (Bruno)

                 Unit & Logic Tests
                        (Jest)
```

---

# Quality Workflow

The testing workflow integrates directly into the development lifecycle:

```text
Developer Code
       ↓
Git Version Control
       ↓
Automated Tests (Jest & Bruno)
       ↓
Behavioral Validation (Cucumber)
       ↓
Static Analysis (SonarCloud)
       ↓
Merge to Main Branch
```

---

# Benefits of the Selected Testing Stack

## Reliability

Automated testing ensures that new features do not break existing functionality.

## Maintainability

Static analysis tools help keep the codebase clean and scalable as the platform grows.

## Traceability

Feature files provide clear links between requirements and implementation.

## Collaboration

Human-readable tests improve communication between developers, testers, and stakeholders.

## Scalability

The testing setup supports the planned 2026 post-launch expansion of the ISC platform.

---

# Summary

By integrating these testing tools, the International Student Compass project ensures both technical quality and strong user experience.

The testing stack includes:

* **Unit & Logic Tests** → Jest
* **Contract/API Tests** → Bruno
* **Behavioral Tests** → Cucumber
* **Static Quality Gates** → SonarCloud
* **Workflow Management** → Git

This setup guarantees that ISC is not only functional and secure, but also maintainable, scalable, and ready for future development.
