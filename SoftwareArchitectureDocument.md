# Software Architecture Document (SAD)

## Table of Contents
1. [Introduction](#1-introduction)
    * [1.1 Purpose](#11-purpose)
    * [1.2 Scope](#12-scope)
    * [1.3 Definitions, Acronyms and Abbreviations](#13-definitions-acronyms-and-abbreviations)
    * [1.4 References](#14-references)
    * [1.5 Overview](#15-overview)
2. [Architectural Representation](#2-architectural-representation)
3. [Architectural Goals and Constraints](#3-architectural-goals-and-constraints)
4. [Use-Case View](#4-use-case-view)
5. [Logical View](#5-logical-view)
    * [5.1 Overview](#51-overview)
    * [5.2 Architecturally Significant Design Packages](#52-architecturally-significant-design-packages)
6. [Process View](#6-process-view)
7. [Deployment View](#7-deployment-view)
8. [Implementation View](#8-implementation-view)
9. [Data View](#9-data-view)
10. [Size and Performance](#10-size-and-performance)
11. [Quality](#11-quality)

---

# Software Architecture Document (SAD)
*(Based on RUP Template)*

## 1. Introduction
### 1.1 Purpose
This document provides a comprehensive architectural overview of the "International Student Compass" system. [cite_start]It captures the significant design decisions made to ensure the system is scalable, maintainable, and decoupled[cite: 3].

### 1.2 Scope
This architecture covers the Vue.js frontend, the Node.js/Express API, and the MongoDB data tier. 

### Section 1.3
| Abbrevation | Explanation                            |
| ----------- | -------------------------------------- |
| SAD        | Software Architecture Document          |
| UC          | Use Case                               |
| API         | Application Programming Interface                       |
| tbd         | to be determined                       |
| UCD         | overall Use Case Diagram               |
| FAQ         | Frequently asked Questions             |

## 2. Architectural Representation
The system follows a **3-Tier Layered Architecture**. 

* **Presentation Tier:** Responsible for the User Interface and client-side logic using Vue.js.
* **Application Tier:** The "brain" of the system, handling business logic and API routing via Node.js and Express.
* **Data Tier:** Manages persistent storage using MongoDB and Mongoose schemas.

---

## 3. Architectural Goals and Constraints
* **Decoupled Design:** The frontend and backend communicate strictly via a RESTful API.
* **Hardware Inclusivity:** Architecture is optimized for "Web-First" access on legacy desktop hardware, ensuring students without high-end smartphones can access all features.
* **Real-time Capabilities:** Use of WebSockets (Socket.IO) for community chat.

---

## 4. Use-Case View
This view represents the functional requirements that shape the architecture.

![Overall Use Case Diagram](./Visualizations/use_case_diagram.png)

[cite_start]**Diagram Legend:** [cite: 6]
* **Yellow Ovals:** Completed Core Features (e.g., UC-01, UC-02).
* **White Ovals:** Planned Features (e.g., Scholarships, Course Curation).
* **Boundary:** The system scope for the International Student Compass.

> [cite_start]**Note:** Detailed behavioral logic and Activity Diagrams are excluded from the SAD and are located in the **Use Case Specification** documents[cite: 6].

---

## 5. Logical View
### 5.1 Class Mapping (The "Architectural Blueprint")
[cite_start]To address the missing mapping feedback, the following table organizes our system's code into the 3-Tier structure[cite: 6].

| Architectural Tier | Package/Folder | Significant Classes/Files |
| :--- | :--- | :--- |
| **Presentation** | `src/views`, `src/components` | `HomeView.vue`, `SearchView.vue`, `ChatComponent.vue` |
| **Application** | `server/controllers`, `server/routes` | `AuthController.js`, `SearchController.js`, `ChatHandler.js` |
| **Data** | `server/models` | `UserSchema.js`, `UniversitySchema.js`, `ThreadSchema.js` |

### 5.2 Class Diagrams
This diagram shows the relationships between the Controllers in the Application Tier and the Schemas in the Data Tier.

![Tool generated Diagram](./Visualizations/tool-generated-class-diagram.png)
![Manualy drawn Diagram](./Visualizations/conceptual-class-diagram.png)

Socket.IO: Critical for the "Real-time" goal of peer-to-peer chat.

Mongoose: Essential for enforcing data schemas in a NoSQL environment.

Axios: The primary bridge for our decoupled REST communication.
---

## 6. Process View
This view illustrates the dynamic request flow. When a user searches for a university, the data flows as follows:
1.  **View:** User enters a query in `SearchView.vue`.
2.  **Controller:** The `SearchController.js` receives the HTTPS request via a REST endpoint.
3.  **Model:** The controller queries the `UniversitySchema` in MongoDB.
4.  **Response:** Data is sent back as JSON and rendered in the View.

---

## 7. Deployment View
The system uses a physical **Client-Server Architecture**.

* **Client Node:** User web browser (Chrome, Firefox, Safari, Edge).
* **Server Node (VPS):** A Linux-based Virtual Private Server hosting the Node.js environment and Express server.
* **Database Node:** A dedicated MongoDB instance (cloud or local to VPS).


![UML deployment diagram](./Visualizations/deployment-diagram.png)

---

## 8. Implementation View
The system is implemented using a Monorepo structure to simplify Docker orchestration.

root/: Contains the docker-compose.yml and environment configurations.

/frontend: Vue.js application using Vite for optimized builds.

/backend: Node.js/Express server.

/docs: Contains the SAD, SRS, and API contracts (Swagger/Bruno).
![Overall Use Case Diagram](./Visualizations/package.png)
---

## 9. Quality
The architecture is designed to support a 99.5% uptime and sub-500ms API response times through efficient indexing in the Data Tier.
Load Capacity: Support for 500 concurrent users without degradation.

Scalability: Horizontal scaling capabilities via VPS clustering.

### 10. Size and Performance

Efficiency: The frontend utilizes lazy-loading for routes (SearchView.vue, ChatComponent.vue) to keep the initial DOM content load under 1.5 seconds.

Memory Constraint: The Node.js API is configured to run within a 512MB RAM container, ensuring it remains performant on low-cost VPS instances.

Database Indexing: MongoDB indexes are applied to UniversityName and Location to ensure query results are returned in <200ms for datasets up to 10,000 entries.

---
### 11. Architecture MetricsEfferent Coupling ($Ce$): 
Target < 10 for all core logic packages to ensure high maintainability.Component Dependency: Monitored via Madge to prevent circular dependencies between the API and Database models.
