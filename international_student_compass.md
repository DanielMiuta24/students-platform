# International Student Compass - Software Requirements Specification 

## Table of contents
- [Table of contents](#table-of-contents)
- [Introduction](#1-introduction)
    - [Purpose](#11-purpose)
    - [Scope](#12-scope)
    - [Definitions, Acronyms and Abbreviations](#13-definitions-acronyms-and-abbreviations)
    - [References](#14-references)
    - [Overview](#15-overview)
- [Overall Description](#2-overall-description)
    - [Vision](#21-vision)
    - [Use Case Diagram](#22-use-case-diagram)
	- [Technology Stack](#23-technology-stack)
- [Specific Requirements](#3-specific-requirements)
    - [Functionality](#31-functionality)
    - [Usability](#32-usability)
    - [Reliability](#33-reliability)
    - [Performance](#34-performance)
    - [Supportability](#35-supportability)
    - [Design Constraints](#36-design-constraints)
    - [Online User Documentation and Help System Requirements](#37-on-line-user-documentation-and-help-system-requirements)
    - [Purchased Components](#purchased-components)
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

### 2.2 Use Case Diagram

![OUCD](./Use-caseDiagram.png)

- yellow: Planned till end of november
- red: Planned till end of may

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
Notion (Petra for tasks)

Other Tools

Version Control: GitHub / GitLab
Design: Figma (UI/UX)
Communication: Slack / Discord
Project Management : Jira

## 3. Specific Requirements

### 3.1 Functionality
Until December 2025 (Core MVP Launch)

#### 3.1.1 Creating an Account:
 Users can sign up with an email and password to create a personal profile.

#### 3.1.2 Logging In & Out:
 Registered users can log in to access all features and log out for privacy.

#### 3.1.3 Searching for Universities: 
Users can search for universities by name or country and view a list of results showing the university's name and official website.

#### 3.1.4 Viewing Discussions & Profiles:
 Users can browse community discussion spaces for specific universities and view the profiles of other students.

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

#### 3.1.10 Managing Your Profile & Saved Items:
 Users will be able to save favorite universities, scholarships, and courses to their personal profile for later reference.

#### 3.1.11 Admin Content Moderation: 
Admins will have tools to manage the community by removing inappropriate content and banning users who violate guidelines.


### 3.2 Usability
We plan on designing the user interface as intuitive and self-explanatory as possible to make the user feel as comfortable as possible using the webapp. Though an FAQ document will be available, it should not be necessary to use it.

#### 3.2.1 No training time needed
Our goal is that opens the app and is able to use all features without any explanation or help.

#### 3.2.2 Familiar Feeling
Our design philosophy is simple: Don't reinvent the wheel. The app should look and feel like the apps our users already use every day. This will make it feel intuitive from the moment they open it.

### 3.3 Reliability

#### 3.3.1 Availability
The server shall be available 95% of the time. This also means we have to figure out the "rush hours" of our app because the downtime of the server is only tolerable when as few as possible players want to use the app.

#### 3.3.2 Defect Rate
Our goal is that we have no loss of any data. This is important so that the game sessions can carry on, even after a downtime of the server.

### 3.4 Perfomance

#### 3.4.1 Capacity
The system should be able to manage thousands of requests. Also it should be possible to register as many users as necessary.

#### 3.4.2 Storage 
We are aiming to keep the needed storage as small as possible.

#### 3.4.3 App perfomance / Response time
To provide the best  perfomance we aim to keep the response time as low as possible. This will make the user experience much better.

### 3.5 Supportability

#### 3.5.1 Coding Standards
We are going to write the code by using all of the most common clean code standards. For example we will name our variables and methods by their functionalities. This will keep the code easy to read by everyone and make further developement much easier.

#### 3.5.2 Testing Strategy
The application will have a high test coverage and all important functionalities and edge cases should be tested. Further mistakes in the implementation will be discovered instantly and it will be easy to locate the error. 

### 3.6 Design Constraints
We are trying to provide a modern and easy-to-handle design for the UI as well as for the architecture of our application. To achieve that, the functionalities will be kept as modular as possible through a component-based approach.

Because we are building a Web App, we chose JavaScript/TypeScript and the React (using the Next.js framework) library for our frontend. We are using a modern decoupled architecture where the frontend client is fully separated from the backend services.

For our backend, we are using Firebase as a Backend-a-a-Service (BaaS). Communication between our application and the database is handled efficiently through the Firebase SDK, rather than a traditional RESTful API.

The supported platforms will be the latest versions of modern web browsers:

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
The application is a web app and does not require a specific operating system. The primary software interface for the end-user is a modern web browser. The platform will officially support the latest versions of:

Google Chrome

Mozilla Firefox

Apple Safari

Microsoft Edge

#### 3.9.4 Communication Interfaces
The server and hardware will communicate using the http protocol. 

### 3.10 Licensing Requirements

### 3.11 Legal, Copyright, and Other Notices
The logo is licensed to the International student  Team and is only allowed to use for the application. We do not take responsibilty for any incorrect data or errors in the application.

### 3.12 Applicable Standards
The development will follow the common clean code standards and naming conventions. Also we will create a definition of d which will be added here as soon as its complete.

## 4. Supporting Information
For any further information you can contact the International student Team or check our blog (https://wordpress.com/home/education4849.wordpress.com). 
The Team Members are:
- Namuyiga Petra
- Muita Beniamin
- Muita Daniel 


<!-- Picture-Link definitions: -->
[OUCD]: https://app.diagrams.net/#G1nYTXZIDtImDJHHqgKFYHTD9SM83eBnz6#%7B%22pageId%22%3A%22OUCD1%22%7D "Overall Use Case Diagram"