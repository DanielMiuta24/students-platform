# International Student Compass - Master Test Plan

## Table of Contents
1. [Introduction](#1-introduction)
   - [1.1 Purpose](#11-purpose)
   - [1.2 Scope](#12-scope)
   - [1.3 Terminology and Acronyms](#13-terminology-and-acronyms)
2. [Evaluation Mission and Test Motivation](#2-evaluation-mission-and-test-motivation)
   - [2.1 Evaluation Mission](#21-evaluation-mission)
   - [2.2 Test Motivators](#22-test-motivators)
3. [Target Test Items](#3-target-test-items)
4. [Outline of Planned Tests](#4-outline-of-planned-tests)
   - [4.1 Outline of Test Inclusions](#41-outline-of-test-inclusions)
5. [Test Approach](#5-test-approach)
   - [5.1 Testing Techniques and Types](#51-testing-techniques-and-types)
   - [5.2 Feature Files and Test Results](#52-feature-files-and-test-results)
   - [5.3 API Integration Testing](#53-api-integration-testing)
   - [5.4 Unit Testing Results](#54-unit-testing-results)
6. [Entry and Exit Criteria](#6-entry-and-exit-criteria)
   - [6.1 Entry Criteria](#61-entry-criteria)
   - [6.2 Exit Criteria](#62-exit-criteria)
7. [Responsibilities and Staffing](#7-responsibilities-and-staffing)
8. [Risks, Dependencies, Assumptions, and Constraints](#8-risks-dependencies-assumptions-and-constraints)
9. [Appendix A: Code Quality Metrics](#9-appendix-a-code-quality-metrics)
   - [9.1 Metric 1: Cognitive Complexity](#91-metric-1-cognitive-complexity)
   - [9.2 Metric 2: Code Duplication](#92-metric-2-code-duplication)
   - [9.3 Additional Observation: Coupling (Madge)](#93-additional-observation-coupling-madge)

---

## 1. Introduction

### 1.1 Purpose
The purpose of this test plan is to define the verification and quality assurance strategy for the **International Student Compass (ISC)** web application. This document outlines the test objectives, execution metrics, and continuous integration validation gates required to ensure students receive reliable university/scholarship search tracking and secure real-time community engagement capabilities.

### 1.2 Scope
* **Frontend:** Validation of Vue.js components, Pinia reactive state stores, multi-criteria filtering engines, and layout performance optimizations for legacy hardware.
* **Backend:** Comprehensive coverage of Node.js and Express route controllers, custom security middleware, JWT session authentication hooks, and decoupled database transactional operations.
* **API Layer:** Verification of JSON structural data transformations and payload limits for external data endpoints.
* **End-to-End (E2E):** Verification of integrated user journeys, specifically tracking the sequential operations of registration, real-time message routing, and bookmarking institutional resources.

### 1.3 Terminology and Acronyms
| Abbreviation | Meaning |
| :--- | :--- |
| **ISC** | International Student Compass |
| **FP** | Function Points |
| **ILF** | Internal Logical File (MongoDB Collections) |
| **EIF** | External Interface File (External Academic Reference APIs) |
| **BDD** | Behavior-Driven Development |
| **CC** | Cyclomatic Complexity / Cognitive Complexity |

---

## 2. Evaluation Mission and Test Motivation

### 2.1 Evaluation Mission
* Verify the consistency of university and scholarship records parsed across systemic JSON payloads.
* Enforce model schema constraints across persistent MongoDB user and discussion collections to check for data corruption vulnerabilities.
* Confirm thin-client execution efficiency to guarantee page functionality on legacy hardware and low-bandwidth connections down to 1 Mbps.

### 2.2 Test Motivators
* **Data Reliability:** Prospective international students depend on strict timeline deadlines; data processing bugs risk user deployment failures.
* **Security & Privacy Isolation:** Verification of route restrictions and validation logic to block unauthorized data boundary access.

---

## 3. Target Test Items
* **Frontend Architecture UI Modules:** Multi-input search elements, inline forum managers, and real-time Socket.IO direct messaging layout components.
* **Backend Service Pipeline:** Route initialization handlers, token parsing modules, and database CRUD abstraction wrappers.
* **Persistence Layer Models:** Configuration verification for Mongoose schemas (`UserSchema`, `UniversitySchema`, `ThreadSchema`).

---

## 4. Outline of Planned Tests

### 4.1 Outline of Test Inclusions
* **Unit Testing:** Local execution testing utilizing Jest to isolate route and schema processing controllers.
* **API Verification Testing:** Integration assertion execution via automated validation tooling to verify request codes, headers, and parameter mapping constraints.
* **End-to-End System Integration Testing:** Human-readable Gherkin-syntax automated scripts mapping behavior-driven user workflows.

---

## 5. Test Approach

### 5.1 Testing Techniques and Types
* **Isolated Logic Verification:** Rigorous component mock architectures to evaluate parsing algorithms independently of database connectivity availability.
* **Behavior-Driven Specification Verification:** Explicit mapping of software behaviors using readable Given-When-Then criteria steps to track validation metrics transparently.
* **Fault-Tolerance Network Audits:** Injection testing to assess backend container handling parameters during rate-limiting constraints or external service dropouts.

### 5.2 Feature Files and Test Results
The behavior-driven test scenarios for the International Student Compass (ISC) are defined using Gherkin-based feature files, which describe key user interactions. To validate the implementation, test results from unit, API, and end-to-end testing are documented through generated reports and execution outputs.

* **Repository Reference:** [View Complete Project Feature Files on GitHub](https://github.com/DanielMiuta24/students-platform/tree/main/students-platform/backend/features)

  #### 5.2.1 Example Feature File: University Search

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
