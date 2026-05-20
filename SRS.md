# International Student Compass - Software Requirements Specification 

## Table of Contents
- [1. Introduction](#1-introduction)
  - [1.1 Purpose](#11-purpose)
  - [1.2 Scope](#12-scope)
  - [1.3 Definitions, Acronyms and Abbreviations](#13-definitions-acronyms-and-abbreviations)
  - [1.4 References](#14-references)
  - [1.5 Overview](#15-overview)
- [2. Overall Description](#2-overall-description)
  - [2.1 Vision](#21-vision)
  - [2.2 Use Cases and Diagrams](#22-use-cases-and-diagrams)
  - [2.3 Actors](#23-actors)
- [3. Specific Requirements](#3-specific-requirements)
  - [3.1 Functionality](#31-functionality)
  - [3.2 Usability](#32-usability)
  - [3.3 Reliability](#33-reliability)
  - [3.4 Performance](#34-performance)
  - [3.5 Supportability](#35-supportability)
  - [3.6 Design Constraints](#36-design-constraints)
  - [3.7 Online User Documentation and Help System Requirements](#37-online-user-documentation-and-help-system-requirements)
  - [3.8 Purchased Components](#38-purchased-components)
  - [3.9 Interfaces](#39-interfaces)
  - [3.10 Licensing Requirements](#310-licensing-requirements)
  - [3.11 Legal, Copyright and Other Notices](#311-legal-copyright-and-other-notices)
  - [3.12 Applicable Standards](#312-applicable-standards)
- [4. Supporting Information](#4-supporting-information)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) details all functional and non-functional requirements for the "International Student Compass" application. It serves as a formal contract outlining project scope, targeted capabilities, and core system constraints.

### 1.2 Scope
The project is realized as an inclusive, performance-focused web application. The platform is broken down into the following distinct functional subsystems:
* **University & Scholarship Discovery:** Core localized filtering system for matching institutional opportunities.
* **Account & Profile System:** Manages secure student registrations and identity records.
* **Community Enrichment:** Enables collaborative user interactions and resource-sharing posts.
* **Peer-to-Peer Chat:** Asynchronous and synchronous messaging pipeline for direct connections.
* **Online Course Curation:** External course metadata discovery engine.
* **Data Storage:** Underlying persistent schema engine validating systemic records.

### 1.3 Definitions, Acronyms and Abbreviations
| Abbreviation | Explanation |
| :--- | :--- |
| **SRS** | Software Requirements Specification |
| **SAD** | Software Architecture Document |
| **UC** | Use Case |
| **UCD** | Overall Use Case Diagram |
| **FAQ** | Frequently Asked Questions |
| **LCP** | Largest Contentful Paint (Performance metric) |
| **n/a** | Not applicable |
| **tbd** | To be determined |

### 1.4 References
| Title | Date | Publishing Organization |
| :--- | :---: | :--- |
| [Common Playground Blog](https://education4849.wordpress.com/) | 25.09.2025 | International Student Compass |
| [GitHub Repository](https://github.com/DanielMiuta24/students-platform) | 25.09.2025 | International Student Compass |
| [Software Architecture Document (SAD)](https://github.com/DanielMiuta24/students-platform/blob/main/SAD.md) | 20.05.2026 | International Student Compass |

### 1.5 Overview
The subsequent sections detail the architectural boundaries of the application. Section 2 outlines the strategic vision and actor definitions. Section 3 covers exact specific capabilities, including usability constraints, testing workflows, and user interface characteristics. Section 4 houses our active support records.

---

## 2. Overall Description

### 2.1 Vision
To create the one ecosystem every international student needs to turn their study abroad goals into reality—making the transition straightforward, clear, and collaborative.

* **The Problem:** Navigating international admissions is currently highly fragmented. Students must comb through unverified websites and disconnected forums, dealing with scattered parameters and high friction without a central point of trust.
* **The Solution:** A unified system that delivers structured community spaces, explicit filtering mechanisms, and validated lifestyle resource tracks.
* **Timezone Resilience:** The system **shall** automatically adjust and render all community activity timestamps using the client device's localized timezone mapping.
* **Bandwidth Optimization:** The system **shall** enforce automated asset lazy-loading for cross-origin assets, guaranteeing system operations on restricted connections as slow as 1 Mbps.

### 2.2 Use Cases and Diagrams
The Overall Use Case Diagram (UCD) serves as the behavioral blueprint of system limits.

![Overall Use Case Diagram](./Visualizations/class_diagram.png)

#### 2.2.1 Diagram Legend
* **Yellow Ovals:** Complete Core Baseline System Configurations (`UC-01`, `UC-02`).
* **White Ovals:** Planned Infrastructure Extensions (Scholarships, Curations).
* **System Boundary:** Explicit scope box for the core platform.

> **Note:** Process workflows and structural Activity Diagrams have been explicitly factored out of the main SRS and reside directly within the standalone **Use Case Specification Documents**.

### 2.3 Actors
* **Guest:** Unauthenticated user accessing the platform. Restricted to read-only browsing of profiles, open discussions, and institutional directory sets.
* **Student (Authenticated):** Fully registered user. Authorized to modify profiles, broadcast community threads, engage in peer chat sessions, and bookmark curation arrays.
* **Administrator:** Privileged supervisor interface. Controls moderation tooling, acts on content abuse flags, and handles account revocations.

---

## 3. Specific Requirements

### 3.1 Functionality
| ID | Feature Name | Status | Detailed Specification Link |
| :--- | :--- | :--- | :--- |
| **UC-01** | Create Account | Finished | [Create Account Specification](use_cases/Create_Account.md) |
| **UC-02** | Search University | Finished | [Search University Specification](use_cases/Search_University.md) |
| **UC-03** | Send Message | In Progress | [Send Message Specification](use_cases/Send_Message.md) |
| **UC-04** | Manage Post | In Progress | [Manage Post Specification](use_cases/UCManagePost.md) |
| **UC-05** | Manage Comment | In Progress | [Manage Comment Specification](use_cases/UCManageComment.md) |
| **UC-06** | Like Post | In Progress | [Like Post Specification](use_cases/UCLikePost.md) |
| **UC-07** | Delete Account | In Progress | [Delete Account Specification](use_cases/delete_account.md) |
| **UC-08** | Search Scholarship | In Progress | [Search Scholarship Specification](use_cases/search_scholarships.md) |

#### 3.1.1 Creating an Account
The system **shall** present a validated profile registration layout collecting Full Name, verified Email Address, and an alpha-numeric Password structure enforced at a minimum length constraint of 8 characters. Upon processing, an automated asynchronous registration confirmation loop is triggered.

#### 3.1.2 Logging In & Out
The system **shall** authenticate registered credentials, establish secure sessions, and offer explicit teardown paths for user identity blocks. A secure out-of-band token request mechanism is integrated to support password resets.

#### 3.1.3 Searching for Universities
The system **shall** parse user inquiries across indexing tables matching institutional names or geographic parameters, serving instant responses containing primary target URLs. If queries resolve to empty lists, the interface **shall** return a zero-results fallback warning.

#### 3.1.4 Viewing Discussions & Profiles
The system **shall** safely render user-generated directory records, structural forum threads, and authenticated student profiles detailing localized public metadata blocks.

#### 3.1.5 Posting in Discussions
The system **shall** enable authenticated accounts to format, broadcast, and append response elements to persistent university board arrays.

#### 3.1.6 Communicating via Chat
The system **shall** map instant data streams between active authenticated actors, supporting messaging state sync flags across real-time connection contexts.

#### 3.1.7 Finding Scholarships (Post-Launch Expansion)
The system **shall** expose complex criteria matching routines allowing users to refine target funding pools based on nationality constraints and academic areas of focus.

#### 3.1.8 Enriching University Profiles
The system **shall** accept structured student evaluation metrics, numerical rating scales, and uploaded media attachments for verified profile rendering.

#### 3.1.9 Discovering Online Courses
The system **shall** index and map external educational course metadata, outputting provider descriptions alongside explicit cross-origin reference paths.

#### 3.1.10 Managing Your Profile & Saved Items
The system **shall** give users a personalized interface configuration to track bookmarked metadata nodes and adjust core account parameters safely.

#### 3.1.11 Admin Content Moderation
The system **shall** supply privileged security tools allowing administrators to flag, edit, purge, or suspend components violating operational community rules.

#### 3.1.12 Managing Posts
The system **shall** track creation states for custom posts. Draft entries must remain hidden from non-author queries until explicit publish indicators are validated. Deletion paths **shall** be governed by safety confirmation controls.

#### 3.1.13 Managing Comments
The system **shall** anchor sub-level discussion elements onto target parent posts, processing inline modifications and user deletions through secure execution hooks.

#### 3.1.14 Liking Posts
The system **shall** process real-time interaction toggles, scaling visual engagement indexes upward or downward instantly upon user validation.

### 3.2 Usability
The system interface **shall** follow conventions that maintain zero user operational friction.

#### 3.2.1 Operational Intuitiveness
The interface layouts are structured to achieve immediate onboarding, enabling core search actions to succeed without relying on system instruction files.

#### 3.2.2 Design Consistency
Interface layouts **shall** adhere to predictable patterns matching modern digital workspaces to reduce learning fatigue for users.

### 3.3 Reliability

#### 3.3.1 Availability
The platform **shall** guarantee a monthly systemic operational availability factor of $\ge 99.5\%$, restricting unplanned infrastructure disruptions to $< 3.65$ hours monthly. Routine server optimization windows must be isolated to low-traffic bounds (02:00-04:00 CET) with notice distributed 48 hours beforehand.

#### 3.3.2 Data Integrity and Recovery
* **Backups:** Persistent datasets **shall** be captured daily via automated scheduled snapshots.
* **Recovery Point Objective (RPO):** Maximum acceptable structural information loss window is constrained to 24 hours.
* **Recovery Time Objective (RTO):** Systemic service restorations following critical failures must resolve within 4 hours.

### 3.4 Performance

#### 3.4.1 Response Time
* **API Inquiries:** Core endpoint server actions **shall** maintain a 95th percentile ($p95$) latency cap under 500ms.
* **Client Layout Rendering:** Primary application dashboards **shall** reach a Largest Contentful Paint (LCP) performance limit within 2.5 seconds on baseline network standards.

#### 3.4.2 Concurrency
The system configuration **shall** process 500 concurrent operational actors executing standard interactions simultaneously without experiencing target service metric degradation.

#### 3.4.3 Scalability
The underlying container structure **shall** scale dynamically to support a 50% increase in baseline system transaction load over a 90-day tracking window.

### 3.5 Supportability

#### 3.5.1 Coding Standards
The code base utilizes distinct semantic variable declarations and module parameters that mirror uniform programming style guides, keeping code readable for long-term enhancements.

#### 3.5.2 Testing & Quality Assurance
Our quality verification workflow is built around an integrated validation strategy designed to prevent configuration breaks across target environments:
* **Behavior-Driven Development (BDD):** Functional definitions are tracked through Gherkin-syntax `.feature` test definitions located within the structural project [Features Directory](https://github.com/DanielMiuta24/students-platform/tree/main/students-platform/backend/features). These map real-world operations directly to systemic validation test hooks.
* **Unit Testing Array:** Independent structural controllers are audited using isolated test cases, confirming that refactored business components preserve original data outputs without regression side effects.
* **Automated Static Scanning:** System pipelines route every code change directly into **SonarCloud** engines, monitoring technical debt metrics and evaluating Cyclomatic Complexity ($CC$) indexes before pull requests are approved.
* **CI/CD Pipeline Validation:** Automated check scripts prevent untested modifications from merging into the primary branch, ensuring stability for our target audience.

### 3.6 Design Constraints

#### 3.6.1 Hardware Accessibility
The application **shall** be accessible via modern web standards, prioritizing low resource footprints to support running smoothly on legacy hardware found in shared public environments like libraries and school computer labs. 

#### 3.6.2 Supported Platforms
The system **shall** behave uniformly across the current stable release builds of major web environments:
* Google Chrome
* Mozilla Firefox
* Apple Safari
* Microsoft Edge

### 3.7 Online User Documentation and Help System Requirements
The interface **shall** provide a persistent help link giving users access to clear FAQ tables and direct support request channels.

### 3.8 Purchased Components
n/a (The application relies strictly on open-source, non-proprietary dependencies).

### 3.9 Interfaces

#### 3.9.1 User Interfaces
The system interface is engineered as a cross-platform Responsive Web Application. It **shall** support standard input actions (keyboard/mouse layouts) and adapt seamlessly across standard resolution screens to handle legacy computer lab hardware.

#### 3.9.2 Hardware Interfaces
n/a

#### 3.9.3 Software Interfaces
The application **shall** integrate with verified external educational provider data arrays using RESTful endpoints. All cross-system transactional communications **shall** be formatted as JSON objects routed exclusively over secure HTTPS channels.

#### 3.9.4 Communication Interfaces
All remote system-to-client operations **shall** run over secure **HTTPS (TLS 1.3)** and **WSS (WebSockets Secure)** connections to ensure complete safety for user credential transactions.

### 3.10 Licensing Requirements
n/a

### 3.11 Legal, Copyright, and Other Notices
All structural brand identity marks are the property of the International Student Compass project group. The system provides zero-liability guarantees regarding real-time external data accuracies or temporary third-party link inconsistencies.

### 3.12 Applicable Standards
Code construction runs under unified architectural formatting practices. System acceptance criteria definitions are documented within our team's active Definition of Done (DoD) tracking schemas.

---

## 4. Supporting Information
Project updates and development logs are documented on the [Official ISC Project Blog](https://education4849.wordpress.com/). 

**Project Engineering Team:**
* Namuyiga Petra
* Miuta Beniamin
* Miuta Daniel
