# 📑 ISC Master Test Plan (RUP Template)


---

## Table of Contents
1. [Introduction](#introduction)
   - [Purpose](#purpose)
   - [Scope](#scope)
   - [Terminology and Acronyms](#terminology-and-acronyms)
2. [Evaluation Mission and Test Motivation](#evaluation-mission-and-test-motivation)
   - [Evaluation Mission](#evaluation-mission)
   - [Test Motivators](#test-motivators)
3. [Target Test Items](#target-test-items)
4. [Outline of Planned Tests](#outline-of-planned-tests)
   - [Outline of Test Inclusions](#outline-of-test-inclusions)
5. [Test Approach](#test-approach)
   - [Testing Techniques and Types](#testing-techniques-and-types)
6. [Entry and Exit Criteria](#entry-and-exit-criteria)
   - [Entry Criteria](#entry-criteria)
   - [Exit Criteria](#exit-criteria)
7. [Responsibilities and Staffing](#responsibilities-and-staffing)
8. [Risks, Dependencies, Assumptions, and Constraints](#risks-dependencies-assumptions-and-constraints)
9. [Appendix A: Code Quality Metrics](#appendix-a-code-quality-metrics)
   - [Cyclomatic Complexity (CC)](#cyclomatic-complexity-cc)
   - [Efferent Couplings (Ce)](#efferent-couplings-ce)

---

## Introduction

### Purpose
The purpose of this test plan is to define the strategy for the **International Student Compass (ISC)**—a full-stack application for scholarship searches and community interaction using **Node.js, Express, Vue.js, and MongoDB**. This document outlines the objectives and resources needed to ensure students get accurate scholarship data and a secure community experience.

### Scope
* **Frontend:** Vue.js components, scholarship filter logic, and responsive UI for legacy hardware.  
* **Backend:** Express routes, JWT authentication middleware, and MongoDB controllers.  
* **API:** Validation of the **CareerOneStop API** integration.  
* **End-to-End:** Full user journeys (Register -> Search Scholarship -> Save to Profile).

### Terminology and Acronyms
| Abbr | Meaning |
| :--- | :--- |
| **ISC** | International Student Compass |
| **FP** | Function Points |
| **ILF** | Internal Logical File (MongoDB) |
| **EIF** | External Interface File (CareerOneStop API) |

---

## Evaluation Mission and Test Motivation

### Evaluation Mission
* Validate the accuracy of scholarship data fetched via external API.  
* Ensure **MongoDB** User and Post collections maintain data integrity.  
* Verify that the UI remains functional on older hardware (Legacy Hardware optimization).

### Test Motivators
* **Data Reliability:** Students rely on accurate scholarship deadlines.  
* **Security:** Sensitive user data (passports/visas) must be protected via robust Auth testing.

---

## Target Test Items
* **Frontend (Vue.js):** Search bars, filter toggles, post creation forms.  
* **Backend (Express):** API wrappers, auth middleware.  
* **Database (MongoDB):** Schema validation for "User" and "Post" models.  
* **External API:** CareerOneStop Scholarship Search endpoint.

---

## Outline of Planned Tests

### Outline of Test Inclusions
* **Unit Testing:** Jest (Backend) and Vitest (Frontend).  
* **API Testing:** Supertest to verify CareerOneStop JSON responses.  
* **E2E Testing:** Cucumber + Playwright/Selenium for Gherkin-based "Feature Files."

---

## Test Approach

### Testing Techniques and Types
* **Unit Testing:** Isolated testing of the scholarship filtering algorithm.  
* **Behavior-Driven Development (BDD):** Using Gherkin syntax to define student interactions.  
* **API Integration Testing:** Ensuring the backend properly handles API rate limits or downtime from CareerOneStop and university API.

---
## Feature Files and Test Results

The behavior-driven test scenarios for the International Student Compass (ISC) are defined using Gherkin-based feature files, which describe key user interactions such as registration, scholarship search, and saving results to a profile. An example feature file is included below to illustrate the structure and expected system behavior. To validate the implementation, test results from unit, API, and end-to-end testing are documented through generated reports and execution outputs. A screenshot of successful test execution is provided to demonstrate that critical functionalities, including authentication and scholarship search, are working as expected. Together, these artifacts ensure transparency, traceability, and confidence in the system’s reliability.
You can read all the feature files here:![ Feature files](../backend/features)
## Example Feature File
## Feature File: University Search

## Feature File: University Search

```gherkin
Feature: University Search via API
  As a User
  I want to search for universities
  So that I can find their official websites.

  Scenario: User finds universities successfully (Happy Path)
    Given I am on the university search page
    When I enter "Technical University of Munich" into the search bar and click "Search"
    Then the system should call the external University API
    And I should see a list containing "Technical University of Munich" and its website link.

  Scenario: User searches for a university that does not exist (Unhappy Path)
    Given I am on the university search page
    When I enter "University of Atlantis" into the search bar and click "Search"
    Then the system should call the external University API
    And I should see a "No results found" message.

  Scenario: The external API is down (Unhappy Path)
    Given the external University API is unavailable
    And I am on the university search page
    When I enter "Any University" into the search bar and click "Search"
    Then I should see a "service is unavailable" error message.

```


![ University search Result](./Visualizations/cucumber1.png)

### API Integration Testing
API testing was performed using Bruno to validate the functionality of the university search endpoint. Various test cases were executed, including valid queries, invalid inputs, and edge-case scenarios. The results confirmed that the API correctly processes requests, returns appropriate HTTP status codes, and maintains a consistent response structure. The use of Bruno also enabled reproducible and organized testing, supporting transparency and reliability in the validation process.
![ API testing](./Visualizations/bruno.png)

### Unit Testing Results
Unit testing was performed using Jest to ensure the correctness and reliability of the university search module. The test suite covers three layers: controller (HTTP request/response handling), service (business logic and API integration), and validation (input validation logic). A total of 42 tests were executed across these layers, achieving 100% code coverage for all critical components. The results demonstrate that the module handles various scenarios correctly, including successful searches, error conditions, pagination, and edge cases such as empty inputs and malformed data.

#### University Search Validation Unit Tests
The validation layer tests ensure that all input validation logic works correctly, including parameter checking, page number parsing, and handling of edge cases like empty strings and undefined values.
![ University Search Validation Unit Tests](./screenshots/university_search_validation_unit_tests.png)

#### University Search Service Unit Tests
The service layer tests validate the core business logic, including external API calls, data transformation, pagination logic, and error handling for network failures and malformed responses.
![ University Search Service Unit Tests](./screenshots/university_search_service_unit_test.png)

#### University Search Controller Unit Tests
The controller layer tests verify HTTP request processing, parameter extraction and trimming, response formatting, and proper error code mapping (200, 400, 502).
![ University Search Controller Unit Tests](./screenshots/university_search_controller_unit_test.png)

#### University Search Unit Test Coverage
Comprehensive code coverage analysis shows 100% statement coverage for the service and validation layers, and 100% statement coverage for the controller layer, ensuring all code paths are tested.
![ University Search Unit Test Coverage](./screenshots/university_search_unit_test_coverage.png)

## Entry and Exit Criteria

### Entry Criteria
* Feature code pushed to the `dev` branch.  
* **MongoDB Atlas** instance is reachable.

### Exit Criteria
* 100% of "Critical" test cases (Auth & Search) pass.  
* No "Showstopper" bugs in the Scholarship result rendering.

---

## Responsibilities and Staffing
* **Petra:** Frontend Vitest unit tests and UI responsiveness.  
* **Daniel:** Backend Jest tests and CareerOneStop API validation.

---

## Risks, Dependencies, Assumptions, and Constraints
* **Risk:** CareerOneStop API goes down during testing.  
* **Mitigation:** Use **Mock Service Worker (MSW)** to simulate API responses during local testing.  
* **Constraint:** Testing must prove compatibility with older browsers (Legacy Hardware constraint).

---



## Appendix A: Code Quality Metrics

### Overview

To evaluate and improve the quality of our codebase, we used automated software metrics integrated into our development workflow. These metrics helped identify maintainability issues and guided refactoring efforts.

We used **SonarCloud**, integrated into **GitHub Actions**, to ensure continuous code quality evaluation.

---

## Metric 1: Cognitive Complexity

### Definition

Cognitive Complexity measures how difficult code is to understand. It increases with:

- nested conditions  
- multiple decision branches  
- complex control flow  

Unlike Cyclomatic Complexity, it focuses on **human readability**, making it more suitable for maintainability analysis.

---

### Initial Findings

SonarCloud identified several files with high complexity:

| File | Cognitive Complexity |
|------|----------------------|
| category.controller.ts | 22 |
| post.validation.ts | 21 |
| post.controller.ts | 20 |

These files contained:

- nested `if` and `switch` statements  
- repeated validation logic  
- duplicated error handling  

---

### Refactoring Actions

To reduce complexity, we:

- extracted helper functions  
- centralized error handling  
- separated responsibilities in controllers  
- removed nested branching logic  

---

### Results

| File | Before | After |
|------|--------|-------|
| category.controller.ts | 22 | 8 |
| post.validation.ts | 21 | 15 |
| post.controller.ts | 20 | 13 |

👉 This indicates that complex logic was successfully simplified and modularized.

---

## Metric 2: Code Duplication

### Definition

Code duplication measures repeated code across the system.

High duplication leads to:

- harder maintenance  
- inconsistent updates  
- increased bug risk  

---

### Initial Findings

Initial SonarCloud analysis showed:

| Metric | Value |
|--------|------|
| Code Duplication | 26.8% |

However, this result was misleading because:

- auto-generated **coverage files** were included  
- these files artificially inflated duplication  

---

### Refactoring Actions

We addressed duplication by:

- creating reusable validation helpers  
- centralizing controller error handling  
- reusing pagination and parsing logic  

---

### Results

| Before | After    |
|--------|----------|
| 26.8%  | 4.8% ,3.5| 

👉 This reflects a significant improvement in maintainability.

---

## Additional Observation: Coupling (Madge)

We briefly analyzed module dependencies using **Madge**.

Results showed:

- most files had **0–1 dependencies**  
- the system is already **loosely coupled**  

👉 Therefore, coupling was not a major issue and did not require refactoring.

---

## Conclusion

The use of software metrics allowed us to:

- identify complexity hotspots  
- reduce duplication significantly  
- improve code readability and maintainability  

These improvements were achieved without changing system functionality, demonstrating effective refactoring practices.
