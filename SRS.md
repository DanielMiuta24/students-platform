# International Student Compass - Software Requirements Specification 

## Table of Contents
- [Introduction](#1-introduction)
  - [Purpose](#11-purpose)
  - [Scope](#12-scope)
  - [Definitions, Acronyms and Abbreviations](#13-definitions-acronyms-and-abbreviations)
  - [References](#14-references)
  - [Overview](#15-overview)
- [Overall Description](#2-overall-description)
  - [Vision](#21-vision)
  - [Use case diagrams](#22-na)
  - [Technology Stack](#23-technology-stack)
  - [Actors](#24-actors)
- [Specific Requirements](#3-specific-requirements)
  - [Functionality](#31-functionality)
  - [Usability](#32-usability)
  - [Reliability](#33-reliability)
  - [Performance](#34-performance)
  - [Supportability](#35-supportability)
  - [Design Constraints](#36-design-constraints)
  - [Online User Documentation and Help System Requirements](#37-on-line-user-documentation-and-help-system-requirements)
  - [Purchased Components](#38-purchased-components)
  - [Interfaces](#39-interfaces)
  - [Licensing Requirements](#310-licensing-requirements)
  - [Legal, Copyright And Other Notices](#311-legal-copyright-and-other-notices)
  - [Applicable Standards](#312-applicable-standards)
- [Supporting Information](#4-supporting-information)


## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) describes all specifications for the application "International student compass". It includes an overview about this project and its vision, detailed information about the planned features and boundary conditions of the development process.


### 1.2 Scope
The project is going to be realized as a web app.  
  

  
Planned Subsystems are: 
* University & Scholarship Discovery: The core search engine for finding universities and filtered scholarships.
* Account & Profile System: Allows students to create accounts and build personal profiles.
* Community Enrichment: Enables students to post their cvs and make community posts.
* Peer-to-Peer Chat: A direct messaging system for students to connect and communicate.
* Online Course Curation: A section for discovering recommended online courses from other platforms.
* Data Storage: The underlying cloud-based database that manages all platform data.

### 1.3 Definitions, Acronyms and Abbreviations
| Abbrevation | Explanation                            |
| ----------- | -------------------------------------- |
| SRS         | Software Requirements Specification    |
| UC          | Use Case                               |
| n/a         | not applicable                         |
| tbd         | to be determined                       |
| UCD         | overall Use Case Diagram               |
| FAQ         | Frequently asked Questions             |

### 1.4 References

| Title                                                              | Date       | Publishing organization   |
| -------------------------------------------------------------------|:----------:| ------------------------- |
| [Common Playground Blog](https://education4849.wordpress.com/)    | 25.09.2025 | International Student Compass    |
| [GitHub](https://github.com/bennixm/students-platform)            | 25.09.2025 | International Student Compass    |


### 1.5 Overview
The following chapter provides an overview of this project with vision and Overall Use Case Diagram. The third chapter (Requirements Specification) delivers more details about the specific requirements in terms of functionality, usability and design parameters. Finally there is a chapter with supporting information. 
    
## 2. Overall Description

### 2.1 Vision
To create the one app every student needs to make their dream of studying abroad a reality,making the entire process simple, exciting, and less lonely.

The Problem We’re Fixing
Right now, figuring out how to study in another country is a mess. Students have to search dozens of confusing websites, forums, and social media groups. They don’t know who to trust, the information is scattered everywhere, and it feels like you’re doing it all by yourself. It’s stressful and makes people give up.

What We’re Building
We are building one simple place for everything you need:

A Student Community: A friendly place to connect with students from all over the world. You can ask for real, honest advice from people who have already done it, and make friends before you even arrive in your new country.
Easy Search Tools: Find the perfect university and scholarships without the headache. No more opening 50 browser tabs. We’ll put everything you need to know in one clean, easy-to-search list.
Real Tips & Help: A library full of helpful short videos, guides, and advice from current international students. Learn everything from “how to pack” to “how to open a bank account.”

Timezone Resilience: The system shall display all community post timestamps in the user's local timezone.

Bandwidth Optimization: The system shall implement lazy-loading for all university images to ensure page functionality on connections as slow as 1Mbps (reflecting legacy hardware/low-bandwidth constraints).

### 2.2 Use Cases and Diagrams
This diagram shows all the major actions (use cases) that each type of user (actor) can perform, giving a complete "bird's-eye view" of the system's capabilities.

![Overall Use Case Diagram](./Visualizations/class_diagram.png)

2.2.2 Activity Diagrams (Use Case Realizations)
These diagrams show the step-by-step flow for a specific use case. They help explain the detailed logic from start to finish.
They are found under use_cases section.




### 2.3 Technology Stack
Technologies we plan to use
Frontend

Vue Js
Tailwind CSS (styling)
Axios/Fetch for API calls
Backend

Server: Node.js + Express  / FastAPI
Auth: JWT and OAuth2
Realtime: Socket.IO (chat, forums)
Database & Search

Primary DB: MongoDB(structured data: users, universities, scholarships)
Search: Elasticsearch (for fast filtering of scholarships/universities)

Hosting:

Frontend: dedicated vps
Backend: dedicated vps
DB: mongo db


Collaboration:
GitHub (branches: frontend, backend, db)
Figma (Petra + Benni for UI flow)
youtrack (Petra for tasks)

Other Tools

Version Control: GitHub / GitLab
Design: Figma (UI/UX)
Communication: Slack / Discord
Project Management : youtrack

## 2.4 Actors

Actors represent the roles that interact with the system. For the International Student Compass, we have identified three primary human actors and one system actor.

# 1. Guest

A Guest is any individual who visits the web application without an account or without being logged in. Their interaction is limited to discovery and browsing.

Primary Goals:

To explore the platform's offerings without commitment.

To find basic information about universities.

Key Capabilities:

Search for universities by name or country.

View public university profile pages.

Read community discussions in a read-only mode.

# 2. Student (Authenticated User)

The Student is the primary actor of the platform. This is a user who has successfully registered an account and is logged in. They have full access to all community and personalization features.

Primary Goals:

To connect with other students and seek advice.

To personalize their search and save information for future reference.

To contribute to the community's knowledge base.

Key Capabilities:

All capabilities of a Guest.

Create and manage their personal profile.

Post new threads and replies in university discussions.

Initiate one-on-one chats with other students.

Save or bookmark universities, scholarships, and courses.

Submit reviews, ratings, and photos for university profiles.

# 3. Administrator

An Administrator is a privileged user with the responsibility of managing the platform, ensuring content quality, and enforcing community guidelines.

Primary Goals:

To maintain a safe and constructive community environment.

To manage the platform's user base and content.

Key Capabilities:

All capabilities of a Student.

Access a dedicated administrative dashboard.

Moderate user-generated content (delete posts, reviews, photos).

Manage user accounts (suspend or ban users).

Review content flagged by the community through the reporting system.



## 3. Specific Requirements

### 3.1 Functionality
| ID | Feature Name | Status | Detailed Specification |
| :--- | :--- | :--- | :--- |
| UC-01 | Create Account | Finished | [Create Account](use_cases/Create_Account.md) |
| UC-02 | Search University | Finished | [Search University](use_cases/Search_University.md) |
| UC-03 | Send Message | In Progress | [Send Message](use_cases/Send_Message.md) |
| UC-04 | Manage Post | In Progress | [Manage Post](use_cases/UCManagePost.md) |
| UC-05 | Manage Comment | In Progress | [Manage Comment](use_cases/UCManageComment.md) |
| UC-06 | Like Post | In Progress | [Like Post](use_cases/UCLikePost.md) |
| UC-07 | Delete Account | In Progress | [Like Post](use_cases/delete_account.md) |
| UC-08 | Search Scholarship | In Progress | [Like Post](use_cases/search_scholarships.md) |

#### 3.1.1 Creating an Account:
 Users can sign up with an email and password to create a personal profile.
 The sign-up form will require the user's Full Name, Email Address, and a Password.
 Password creation will enforce a minimum length of 8 characters.
Upon successful registration, the user will be automatically logged in and prompted to complete their profile. An email verification link will be sent to their registered email address.

#### 3.1.2 Logging In & Out:
 Registered users can log in to access all features and log out for privacy.
 A "Forgot Password" feature will allow users to initiate a password reset process via email.

#### 3.1.3 Searching for Universities: 
Users can search for universities by name or country and view a list of results showing the university's name and official website.Clicking a result will navigate the user to that university's dedicated profile page. A message will indicate when a search yields no results.

#### 3.1.4 Viewing Discussions & Profiles:
 Users can browse community discussion spaces for specific universities and view the profiles of other students.
 Users can view the public profiles of other students, which will display their full name, profile picture, university, and field of study.

#### 3.1.5 Posting in Discussions:
 Logged-in users can post questions and replies within the university community discussion spaces.

#### 3.1.6 Communicating via Chat:
 Users can initiate a one-on-one chat with another student to ask for advice and send real-time text messages.

Until Summer 2026 (Post-Launch Expansion)
#### 3.1.7 Finding Scholarships:
 A powerful search engine allowing users to find scholarships with detailed filters (e.g., Country, Nationality, Field of Study).

#### 3.1.8 Enriching University Profiles:
 Users can add value to the platform by posting reviews, star ratings, and photos on the university profile pages.

#### 3.1.9 Discovering Online Courses:
 A curated section to help students find relevant online courses for language skills, test prep, and academic writing.
  Each course listing will show its title, provider (e.g., Coursera), a description, and a link to the external course page.

#### 3.1.10 Managing Your Profile & Saved Items:
 Users will be able to save favorite universities, scholarships, and courses to their personal profile for later reference.
 A dedicated dashboard within the user's profile will allow them to easily access and manage their saved items.
  Users can edit their profile information, including their name, picture, and academic details.

#### 3.1.11 Admin Content Moderation:
Admins will have tools to manage the community by removing inappropriate content and banning users who violate guidelines.
Admins can view, edit, or delete any user-generated content (posts, reviews, photos).
Admins can suspend or permanently ban users who violate community guidelines.

#### 3.1.12 Managing Posts:
Logged-in users can create, view, edit, and delete their own blog posts. When creating a post, users provide a title and content. Posts can be saved as drafts for later editing or published immediately to make them publicly visible. Users can view a list of all their posts, including both published posts and drafts, with a distinct visual indicator showing their draft status. The edit functionality allows users to modify the title and content of existing posts. To prevent accidental deletions, a confirmation modal is displayed before permanently removing a post. For more details, refer to the [Manage Post Use Case](use_cases/UCManagePost.md).

#### 3.1.13 Managing Comments:
Logged-in users can create, view, edit, and delete comments on posts. When viewing a post, users can add comments to participate in discussions. Comments can be edited to update their content, and users can delete their own comments. To prevent accidental deletions, a confirmation modal is displayed before permanently removing a comment. Users can view all posts where they have written comments through their profile, allowing them to keep track of their discussions. For more details, refer to the [Manage Comment Use Case](use_cases/UCManageComment.md).

#### 3.1.14 Liking Posts:
Logged-in users can like or unlike posts to show their appreciation for content. The like functionality is a toggle - clicking the "Like" button on a post adds a like, and clicking it again removes the like. The like count is updated in real-time, providing instant feedback to users. The system records each user's like status for posts, ensuring that users can see which posts they have previously liked. For more details, refer to the [Like Post Use Case](use_cases/UCLikePost.md).


### 3.2 Usability
We plan on designing the user interface as intuitive and self-explanatory as possible to make the user feel as comfortable as possible using the webapp. Though an FAQ document will be available, it should not be necessary to use it.

#### 3.2.1 No training time needed
Our goal is that opens the app and is able to use all features without any explanation or help.

#### 3.2.2 Familiar Feeling
Our design philosophy is simple: Don't reinvent the wheel. The app should look and feel like the apps our users already use every day. This will make it feel intuitive from the moment they open it.

### 3.3 Reliability
This section defines the system's ability to maintain its level of performance under stated conditions for a stated period.

#### 3.3.1 Availability
The application shall have a minimum uptime of 99.5%, measured on a monthly basis. This corresponds to a maximum of 3.65 hours of unplanned downtime per month. Scheduled maintenance windows will be planned during periods of lowest user activity (e.g., 02:00-04:00 CET) and will be announced to users at least 48 hours in advance.

#### Data Integrity and Recovery

The system must ensure zero data loss of critical user-generated content (e.g., profiles, community posts, chat messages) in the event of a non-catastrophic system failure.

Backups: Automated daily backups of the primary database are required.

Recovery Point Objective (RPO): The maximum acceptable data loss in a disaster scenario is 24 hours.

Recovery Time Objective (RTO): In the event of a system failure, critical services must be restored within 4 hours.

### 3.4 Performance
This section specifies the performance characteristics of the software under various workloads.

#### 3.4.1 Response Time
API Performance: Core API endpoints (e.g., user authentication, fetching university data, posting a message) must have a 95th percentile (p95) server-side response time of less than 500ms.

Page Load: Key user-facing pages (Home Dashboard, Search Results Page) must achieve a Largest Contentful Paint (LCP) of under 2.5 seconds on a standard broadband connection.

#### 3.4.2 Concurrency
The system must be able to support 500 concurrent users performing standard read-and-write operations (e.g., searching, posting, and chatting) without degradation of the response times specified above.

#### 3.4.3 Scalability
The system's architecture must be designed to scale horizontally to accommodate user growth. It should be capable of handling a 50% increase in the user base over a three-month period without requiring significant architectural changes.

### 3.5 Supportability

#### 3.5.1 Coding Standards
We are going to write the code by using all of the most common clean code standards. For example we will name our variables and methods by their functionalities. This will keep the code easy to read by everyone and make further 
developement much easier.


#### 3.5.2 Testing Strategy
Our quality assurance strategy for the International Student Compass (ISC) is built on a multi-layered verification approach to ensure the system remains stable, secure, and performant on legacy hardware. This strategy bridges the gap between high-level requirements and low-level code through the following pillars:

### 🧪 Our Integrated Testing FrameworkBehavior-Driven Development (BDD) with Feature Files:
[View Feature Files (Cucumber/Gherkin)](https://github.com/DanielMiuta24/students-platform/tree/main/students-platform/backend/features)
We have implemented .feature files using the Gherkin syntax (Given/When/Then) to ensure our functional requirements are directly testable. These files act as a "living document," allowing us to verify that user actions—such as university searches or account creation—behave exactly as specified in the SRS.

### Logic Verification through Unit Tests:
To maintain the integrity of our core business logic, we utilize a comprehensive suite of Unit Tests. These tests are critical for verifying the individual components of our 3-tier architecture, ensuring that refactored methods (like our extracted search patterns) produce consistent results without side effects.

### Continuous Quality with SonarCloud:
We leverage SonarCloud for automated static analysis and code quality monitoring. Every time we push code, SonarCloud scans for "code smells," security vulnerabilities, and technical debt. This provides us with measurable metrics—such as Cyclomatic Complexity ($CC$) and code duplication—ensuring our "Clean Code" standards are met before any feature is considered finished.

### Git-Flow and CI/CD Integration:
Our Git workflow serves as the backbone of our deployment pipeline. By integrating our testing suite and SonarCloud gates directly into our Git branches, we ensure a "test-first" culture. No code is merged into the main branch unless it passes all automated functional and unit tests, guaranteeing that the platform remains reliable for students worldwide.

### 3.6 Design Constraints
This section describes the hardware and  architectural  decisions and constraints that guide the development of the application.

### Hardware Accessibility
The system must be built as a Web-based application to ensure accessibility for international students who may not own a smartphone. The architecture must prioritize performance on shared desktop hardware (e.g., library or school computers) and low-bandwidth connections.
We are building the application using a decoupled, three-tier architecture consisting of a frontend client, a backend application server, and a database. This approach provides a clear separation of concerns and enhances scalability.

Frontend Architecture
We have chosen Vue.js as a design constraint for our frontend development. Its component-based structure is ideal for building a maintainable UI. To achieve strong Search Engine Optimization (SEO)—critical for a platform focused on discovery—we will use the Nuxt.js framework for its Server-Side Rendering (SSR) capabilities.

Backend Architecture
A custom backend using Node.js and Express.js is a core architectural constraint. This decision was made to ensure maximum flexibility, control over our business logic, and the ability to optimize performance specifically for our application's needs. Communication between the frontend and backend will be handled via a RESTful API that we will design and build. This approach allows for long-term scalability and avoids vendor lock-in associated with Backend-as-a-Service (BaaS) platforms.

Supported Platforms
The application is a web app and must be fully functional on the latest stable versions of modern web browsers:

Google Chrome

Mozilla Firefox

Apple Safari

Microsoft Edge

### 3.7 On-line User Documentation and Help System Requirements
The usage of the app should be as intuitive as possible so it won't need any further documentation. If the user needs some help we will implement a "Help"-Button on the web which includes a FAQ and a formular to contact the developement team.

### 3.8 Purchased Components
We don't have any purchased components yet. If there will be purchased components in the future we will list them here.

### 3.9 Interfaces

#### 3.9.1 User Interfaces

The User Interface is a Responsive Web Application. It must be platform-agnostic, supporting standard input methods (keyboard/mouse) and varying screen resolutions to accommodate legacy desktop hardware.
The User Interfaces that will be implemented are:

Home Dashboard - Acts as a personalized starting point, showing recommended scholarships, trending discussions, and relevant online courses.

University Search Page - Allows users to search for universities by country or name and displays the results in a clear list.

University Profile Page - Shows detailed, community-enriched information about a specific university, including student reviews, photos, and a link to its dedicated discussion space.

Scholarship Search Page - A powerful search tool with detailed filters to help students find relevant funding opportunities.

Online Courses Page - A curated discovery page for finding relevant online courses, with filters for price and skill level.

Chat & Conversation Pages - Includes the main chat inbox listing all conversations, and the individual chat screen for sending and receiving messages.

User Profile Page - Displays a user's public information (e.g., their university, field of study) and their contributions to the community, like their reviews.

Login & Register Pages - Provides the standard forms for user authentication (Sign Up, Log In, Password Reset).

Settings Page - Allows users to manage their account details, notification preferences, and privacy settings.

#### 3.9.2 Hardware Interfaces
(n/a)

#### 3.9.3 Software Interfaces
The User Interface is a Responsive Web Application. It must be platform-agnostic, supporting standard input methods (keyboard/mouse) and varying screen resolutions to accommodate legacy desktop hardware.

The system shall interface with the University Search API via RESTful endpoints to retrieve scholarship and institutional data. All data exchange between the application and external services will be handled via JSON over HTTPS.

The application is a web app and does not require a specific operating system. The primary software interface for the end-user is a modern web browser. The platform will officially support the latest versions of:

Google Chrome

Mozilla Firefox

Apple Safari

Microsoft Edge

### 3.9.4 Communication Interfaces
The server and hardware will communicate using the http protocol. 

### 3.10 Licensing Requirements

### 3.11 Legal, Copyright, and Other Notices
The logo is licensed to the International student  Team and is only allowed to use for the application. We do not take responsibilty for any incorrect data or errors in the application.

### 3.12 Applicable Standards
The development will follow the common clean code standards and naming conventions. Also we will create a definition of d which will be added here as soon as its complete.




## 5. Supporting Information
For any further information you can contact the International student Team or check our blog (https://wordpress.com/home/education4849.wordpress.com). 
The Team Members are:
- Namuyiga Petra
- Miuta Beniamin
- Miuta Daniel 

