# Comprehensive Documentation for House of Iris and Tommy

## LLM Prompt Header

Before any AI agent begins processing requests, ensure the following context is provided:

- **Project Name**: House of Iris and Tommy
- **Objective**: To store and cherish personal memories, including photos, videos, and love letters, using modern web technologies.
- **Key Technologies**: Next.js, React, TypeScript, Tailwind CSS, Chakra UI, Framer Motion, Redis, Cloudinary, EmailJS, Axios, React Query
- **Primary Audience**: Users interested in a personal memory storage application.
- **Current Status**: Active development with ongoing feature enhancements.

## Overview

This document serves as a comprehensive guide for documenting the House of Iris and Tommy project. It outlines the purpose, structure, and best practices for creating clear and effective documentation.

### Purpose

The purpose of this document is to provide developers and contributors with a clear understanding of the House of Iris and Tommy project. This includes its importance, applications, and how it fits into the broader context of personal memory storage applications.

## Table of Contents

1. [Introduction](#introduction)
2. [Definition](#definition)
3. [Background](#background)
4. [Use Cases](#use-cases)
5. [Comparison](#comparison)
6. [Project Structure](#project-structure)
7. [Styling Guide](#styling-guide)
8. [Tech Stack](#tech-stack)
9. [Considerations](#considerations)
10. [Best Practices](#best-practices)
11. [Testing](#testing)

## Introduction

The House of Iris and Tommy project is a personal memory storage application using modern web technologies. This document serves as a comprehensive guide for developers and contributors, outlining the purpose, structure, and best practices for the project.

## Definition

House of Iris and Tommy is defined as a personal project for storing and cherishing memories, including photos, videos, and love letters, using modern web technologies.

## Background

The idea of House of Iris and Tommy originated from the need to preserve personal memories in a digital format, leveraging the latest web technologies for a seamless user experience.

## Use Cases

1. **Personal Memory Storage for Individuals**
   - **Scenario**: An individual wants to store and organize their personal photos, videos, and letters in a secure digital format.
   - **Example**: A user uploads their travel photos and videos, categorizes them by location and date, and writes a personal note for each memory.
   - **User Story**: "As a user, I want to upload my travel memories to a secure platform so that I can easily access and share them with friends and family."

2. **Family Memory Sharing**
   - **Scenario**: A family wants to create a shared digital album to preserve and share family memories.
   - **Example**: Family members upload photos from family gatherings, tag each other, and add comments to each memory.
   - **User Story**: "As a family member, I want to contribute to a shared family album so that we can all enjoy and reminisce about our family moments together."

3. **Special Occasions and Events**
   - **Scenario**: Users want to create a digital scrapbook for special occasions like weddings, birthdays, or anniversaries.
   - **Example**: A couple creates a digital album for their wedding, including photos, videos, and messages from guests.
   - **User Story**: "As a couple, we want to create a digital scrapbook of our wedding day so that we can relive the memories and share them with our loved ones."

4. **Memory Preservation for Future Generations**
   - **Scenario**: Users want to preserve their memories for future generations to access and cherish.
   - **Example**: A user uploads family history documents and photos, creating a digital archive for their descendants.
   - **User Story**: "As a user, I want to preserve my family's history in a digital format so that future generations can learn about their heritage."

## Comparison

| Option                  | Description                                      | Advantages                              | Disadvantages                          |
|-------------------------|--------------------------------------------------|-----------------------------------------|----------------------------------------|
| Traditional Albums      | Physical storage of memories                     | Tangible, personal                      | Prone to damage, limited sharing       |
| Cloud Storage           | Digital storage of files                         | Accessible, scalable                    | Privacy concerns, requires internet    |
| House of Iris and Tommy | A digital platform for storing and sharing memories | Secure, user-friendly, integrates with modern web technologies | Requires internet, dependent on platform availability |
| Social Media Platforms  | Platforms for sharing photos and videos          | Wide reach, easy sharing                | Privacy concerns, limited control over data |
| External Hard Drives    | Physical devices for storing digital files       | High storage capacity, offline access   | Prone to physical damage, not easily shareable |

## Project Structure

1. **Directory Layout**
   - **`/components`**: Contains reusable React components used throughout the application.
   - **`/pages`**: Houses the Next.js pages, each corresponding to a route in the application.
   - **`/styles`**: Includes global and component-specific styles, utilizing Tailwind CSS.
   - **`/utils`**: Utility functions and helpers that are used across different parts of the application.
   - **`/public`**: Static assets like images and fonts that are directly served by the server.
   - **`/api`**: API routes for server-side logic, leveraging Next.js API routes.

2. **Key Components and Their Roles**
   - **Memory Storage Component**: Manages the storage and retrieval of personal memories.
   - **User Authentication Component**: Handles user login, registration, and authentication processes.
   - **Media Upload Component**: Facilitates the uploading of photos and videos to Cloudinary.
   - **Email Notification Component**: Uses EmailJS to send notifications and updates to users.

3. **Configuration Files and Their Purposes**
   - **`next.config.js`**: Configuration file for customizing Next.js settings.
   - **`.env`**: Environment variables for sensitive information like API keys and database URLs.
   - **`tailwind.config.js`**: Configuration for customizing Tailwind CSS settings.
   - **`tsconfig.json`**: TypeScript configuration file for setting compiler options.

## Installation and Setup

1. **Prerequisites**
   - Ensure you have Node.js (version 14.x or later) and npm (version 6.x or later) installed on your machine.
   - Install Git for version control.

2. **Clone the Repository**
   - Open your terminal and run the following command to clone the repository:
     ```bash
     git clone https://github.com/yourusername/house-of-iris-and-tommy.git
     ```
   - Navigate into the project directory:
     ```bash
     cd house-of-iris-and-tommy
     ```

3. **Install Dependencies**
   - Run the following command to install the necessary dependencies:
     ```bash
     npm install
     ```

4. **Environment Configuration**
   - Create a `.env` file in the root directory of the project.
   - Add the following environment variables, replacing the placeholders with your actual values:
     ```plaintext
     NEXT_PUBLIC_CLOUDINARY_URL=your_cloudinary_url
     EMAILJS_USER_ID=your_emailjs_user_id
     REDIS_URL=your_redis_url
     ```

5. **Run the Development Server**
   - Start the development server by running:
     ```bash
     npm run dev
     ```
   - Open your browser and navigate to `http://localhost:3000` to view the application.

6. **Build for Production**
   - To build the application for production, run:
     ```bash
     npm run build
     ```
   - This will create an optimized build in the `.next` directory.

## Core Features

- {{ Document all main features of the application, including screenshots or examples }}

## API Documentation

- {{ Document any internal APIs and external API integrations (Cloudinary, EmailJS, etc.) }}

## User Guide

- {{ Create step-by-step instructions for end-users, including screenshots and examples }}

## Developer Guide

- {{ Add contribution guidelines for developers and development workflow instructions }}

## Deployment

- {{ Document the deployment process and different environments, including deployment procedures }}

## Maintenance and Updates

- {{ Document ongoing maintenance procedures, update procedures, and versioning guidelines }}

## Testing

This section outlines the testing strategies employed in the project and the requirements for tests to pass.

### Testing Frameworks

- **Jest**: A delightful JavaScript testing framework with a focus on simplicity.
- **React Testing Library**: A library for testing React components in a user-centric way.

### Test Types

- **Unit Tests**: Ensure that individual components and functions work as intended.
- **Integration Tests**: Verify that different parts of the application work together correctly.
- **End-to-End Tests**: Simulate user interactions to test the application as a whole.

### Running Tests

To run the tests, use the following command:

```bash
npm test
```

### Test Pass Requirements

- All unit tests must pass before merging any pull requests.
- Integration tests should cover critical user flows.
- End-to-end tests should be run in the staging environment before deployment.

### Code Coverage

Aim for at least 80% code coverage for all tests. You can check the coverage report by running:

```bash
npm test -- --coverage
```

## LLM Prompt Footer

To effectively document the project, consider dividing it into the following sections:

1. **Introduction and Overview**: Provide a brief introduction to the project and its objectives.
2. **Installation and Setup**: Detail the steps required to install and set up the project.
3. **Core Features**: Describe the main features and functionalities of the project.
4. **Architecture and Design**: Explain the architecture and design patterns used in the project.
5. **API Documentation**: Document any APIs used or provided by the project.
6. **User Guide**: Offer a guide for end-users on how to use the application.
7. **Developer Guide**: Provide guidelines for developers who wish to contribute to the project.
8. **Testing and Quality Assurance**: Outline the testing strategies and tools used, including test types and pass requirements.
9. **Deployment**: Describe the deployment process and environments.
10. **Maintenance and Updates**: Explain how the project is maintained and updated over time.

## @docs Functionality

The `@docs` functionality allows for easy referencing and linking to specific sections of the documentation. Use this feature to enhance navigation and provide quick access to relevant information.

### Usage

- To link to a section, use the format `@docs(section-name)`, where `section-name` corresponds to the heading in the documentation.
- Ensure that the section names are clear and descriptive for better usability.

## Project-Specific Rules

To maintain consistency and clarity in documentation, adhere to the following project-specific rules:

- **Clarity**: Write in clear and concise language.
- **Consistency**: Use consistent terminology and formatting throughout the documentation.
- **Examples**: Provide examples wherever applicable to illustrate complex concepts.
- **Updates**: Regularly review and update documentation to reflect changes in the project.

## Creating a .cursorrules File

To define documentation standards for the project, create a `.cursorrules` file in your project's root directory. This file should outline the rules and guidelines for writing documentation.

### Example .cursorrules File

```plaintext
# Documentation Standards for House of Iris and Tommy

# General Guidelines
- Use Markdown format for all documentation files.
- Follow the established structure outlined in the LLM Prompt Footer.

# Section-Specific Rules
- Introduction: Provide a brief overview of the section's purpose.
- Code Examples: Use syntax highlighting for code snippets.
- Testing: Include clear instructions for running tests and requirements for passing.

# Review Process
- All documentation changes must be reviewed by at least one other team member before merging.
```

## Todo List for House of Iris and Tommy Documentation

1. **Project Structure**
   - Detail the directory layout.
   - Define key components and their roles.
   - Explain the purpose of configuration files.

2. **Use Cases**
   - Expand the section with more detailed use cases.
   - Add specific scenarios and examples.
   - Include user stories or user flows.

3. **Comparison Section**
   - Complete or remove the "(Optional)" note.
   - Add more alternatives and detailed analysis to the comparison table.
   - Include modern digital memory storage solutions for comparison.

4. **Installation and Setup**
   - Add detailed installation steps.
   - Include environment setup instructions.

5. **Core Features**
   - Document all main features of the application.
   - Include screenshots or examples.

6. **API Documentation**
   - Document any internal APIs.
   - Include documentation for external API integrations (Cloudinary, EmailJS, etc.).

7. **User Guide**
   - Create step-by-step instructions for end-users.
   - Include screenshots and examples.

8. **Developer Guide**
   - Add contribution guidelines for developers.
   - Include development workflow instructions.

9. **Deployment**
   - Document the deployment process and different environments.
   - Include deployment procedures.

10. **Maintenance and Updates**
    - Document ongoing maintenance procedures.
    - Include update procedures and versioning guidelines.

11. **Version Information**
    - Verify and update all technology stack version numbers.

12. **.cursorrules Implementation**
    - Create and implement the .cursorrules file with the outlined rules.