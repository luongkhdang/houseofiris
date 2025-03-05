# Comprehensive Documentation for House of Iris and Tommy

## Introduction
The House of Iris and Tommy project is a personal memory storage application using modern web technologies. This document serves as a comprehensive guide for developers and contributors, outlining the purpose, structure, and best practices for the project.

## Project Structure

1. **Directory Layout**
   - **`/components`**: Contains reusable React components used throughout the application. Each component is designed to be modular and can be easily integrated into different parts of the application.
   - **`/pages`**: Houses the Next.js pages, each corresponding to a route in the application. This structure allows for easy navigation and routing.
   - **`/styles`**: Includes global and component-specific styles, utilizing Tailwind CSS.
   - **`/utils`**: Utility functions and helpers that are used across different parts of the application.
   - **`/public`**: Static assets like images and fonts that are directly served by the server.
   - **`/api`**: API routes for server-side logic, leveraging Next.js API routes.
   - **`/lib`**: Contains libraries and configurations, such as the query client for React Query.
   - **`/hooks`**: Custom React hooks for managing state and side effects.
   - **`/types`**: TypeScript type definitions used throughout the application.

2. **Key Components and Their Roles**
   - **Memory Storage Component**: Manages the storage and retrieval of personal memories.
   - **User Authentication Component**: Handles user login, registration, and authentication processes.
   - **Media Upload Component**: Facilitates the uploading of photos and videos to Cloudinary.
   - **Email Notification Component**: Uses EmailJS to send notifications and updates to users.
   - **Gallery Component**: Displays photos in a gallery format, allowing users to swipe through images.
   - **Feedback Component**: Collects user feedback and displays it in a structured format.

3. **Configuration Files and Their Purposes**
   - **`next.config.js`**: Configuration file for customizing Next.js settings.
   - **`.env`**: Environment variables for sensitive information like API keys and database URLs.
   - **`tailwind.config.js`**: Configuration for customizing Tailwind CSS settings.
   - **`tsconfig.json`**: TypeScript configuration file for setting compiler options.
   - **`package.json`**: Contains metadata about the project and its dependencies.
   - **`README.md`**: Provides an overview of the project, installation instructions, and usage guidelines.

## Project Structure Diagram

Here is a visual representation of the project structure:

```
house-of-iris-and-tommy/
├── components/
│   ├── ClientLayout.tsx
│   │   ├── constants.ts
│   │   ├── index.tsx
│   │   ├── Photo.tsx
│   │   ├── PhotoDetails.tsx
│   │   ├── ProgressIndicator.tsx
│   │   ├── services/
│   │   │   └── photoService.ts
│   │   └── types.ts
│   ├── HomePage.tsx
│   ├── JailPage.tsx
│   ├── SecondPage/
│   │   ├── constant.ts
│   │   ├── index.tsx
│   │   ├── services/
│   │   │   ├── emailService.ts
│   │   │   └── scheduleService.ts
│   │   ├── types.ts
│   │   └── views/
│   │       ├── FeedbackView.tsx
│   │       ├── PicturesView.tsx
│   │       ├── ScheduleView.tsx
│   │       └── StickerView.tsx
│   └── ...
├── pages/
│   ├── api/
│   │   ├── feedbacks/
│   │   │   └── route.ts
│   │   ├── photos/
│   │   │   └── route.ts
│   │   ├── schedules/
│   │   │   └── route.ts
│   │   └── sticker-list/
│   │       └── route.ts
│   └── ...
├── styles/
│   └── globals.css
├── utils/
│   └── ...
├── public/
│   ├── stickers/
│   └── ...
├── lib/
│   └── queryClient.ts
├── hooks/
│   └── useSessionReset.ts
├── types/
│   └── ...
├── .env
├── next.config.js
├── package.json
├── README.md
└── ...
```



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
   - Ensure that the variable names match those used in the codebase for proper functionality.

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
1. **Comprehensive Memory Management**
   - Users can upload, organize, and manage their personal memories, including photos, videos, and documents. For example, a user can create an album titled "Vacation 2023" and add all related memories to it.

2. **Interactive and Collaborative Features**
   - Users can share memories with friends and family, allowing for collaborative albums and interactive comments.

3. **Automated and Customizable Notifications**
   - Sends automated email notifications for important events, such as new memory uploads or shared albums.

4. **Responsive and Accessible Design**
   - The application is designed to be fully responsive, providing a seamless experience across devices.

5. **Advanced Search and Filtering**
   - Users can search and filter memories based on tags, dates, and other metadata.

## API Documentation
1. **Cloudinary API**
   - **Purpose**: Used for storing and managing media files (photos and videos).
   - **Example Request**:
     ```http
     GET /api/photos
     ```
   - **Example Response**:
     ```json
     [
       {
         "url": "https://example.com/photo.jpg",
         "public_id": "photo_id",
         ...
       }
     ]
     ```

2. **EmailJS API**
   - **Purpose**: Used for sending automated email notifications to users.

3. **Redis API**
   - **Purpose**: Used for caching and managing session data.

4. **Next.js API Routes**
   - **Purpose**: Used for server-side logic, such as handling form submissions and processing data.

## File Descriptions

### API Routes

1. **`src/app/api/feedbacks/route.ts`**
   - **Purpose**: This file defines the API routes for handling user feedback.
   - **Functionality**: It includes GET and POST methods to retrieve and save feedback data to Redis.
   - **Important**: Ensure that the Redis server is running and accessible via the specified URL in the environment variables.

2. **`src/app/api/photos/route.ts`**
   - **Purpose**: This file defines the API route for fetching photos from Cloudinary.
   - **Functionality**: It retrieves images and their metadata, sorting them by date if available.
   - **Important**: Ensure that the Cloudinary configuration is set up correctly in the environment variables.

### Components

3. **`src/app/components/ClientLayout.tsx`**
   - **Purpose**: This component serves as a layout wrapper for client-side pages.
   - **Functionality**: It provides context for React Query and includes session reset functionality.
   - **Important**: Ensure that the query client is properly configured in the lib directory.

4. **`src/app/components/GalleryPage/constants.ts`**
   - **Purpose**: This file contains constant values used in the GalleryPage component.
   - **Functionality**: It includes placeholder photo data for initial rendering before fetching from the API.

5. **`src/app/components/GalleryPage/index.tsx`**
   - **Purpose**: This component renders the main gallery page, displaying photos and allowing user interactions.
   - **Functionality**: It handles fetching photos and managing the current photo index for display.

6. **`src/app/components/GalleryPage/Photo.tsx`**
   - **Purpose**: This component represents a single photo in the gallery.
   - **Functionality**: It handles zoom functionality and animations for photo transitions.

7. **`src/app/components/GalleryPage/PhotoDetails.tsx`**
   - **Purpose**: This component displays details about the currently selected photo, including title, date, and location.

8. **`src/app/components/GalleryPage/ProgressIndicator.tsx`**
   - **Purpose**: This component provides a visual progress indicator for navigating through the gallery photos.
   - **Functionality**: It allows users to jump to specific photos using a slider.

9. **`src/app/components/GalleryPage/services/photoService.ts`**
   - **Purpose**: This file contains functions for fetching photos from the API.
   - **Functionality**: It handles API requests and error management for photo retrieval.

10. **`src/app/components/GalleryPage/types.ts`**
    - **Purpose**: This file defines TypeScript types used throughout the GalleryPage components.
    - **Functionality**: It ensures type safety for photo data structures.

11. **`src/app/components/GalleryPage/utils/getOptimizedUrl.ts`**
    - **Purpose**: This utility function generates optimized URLs for images based on specified parameters.
    - **Functionality**: It returns both main and secondary URLs for different use cases.

12. **`src/app/components/HomePage.tsx`**
    - **Purpose**: This component renders the home page of the application.
    - **Functionality**: It includes interactive elements for user engagement and navigation to other pages.

13. **`src/app/components/JailPage.tsx`**
    - **Purpose**: This component represents the "Jail" page, which is displayed after certain user interactions.
    - **Functionality**: It includes a sad cat image and a button for user interaction.

14. **`src/app/components/SecondPage/constant.ts`**
    - **Purpose**: This file contains constants used in the SecondPage component, including placeholder photo data.

15. **`src/app/components/SecondPage/index.tsx`**
    - **Purpose**: This component serves as the main entry point for the SecondPage.
    - **Functionality**: It manages the view selection and renders the appropriate view container.

16. **`src/app/components/SecondPage/services/emailService.ts`**
    - **Purpose**: This file contains functions for sending feedback emails using EmailJS.
    - **Functionality**: It handles email configuration and sending logic.

17. **`src/app/components/SecondPage/services/scheduleService.ts`**
    - **Purpose**: This file contains functions for managing schedules, including fetching, saving, and deleting schedules.
    - **Functionality**: It interacts with the API for schedule-related operations.

18. **`src/app/components/SecondPage/types.ts`**
    - **Purpose**: This file defines TypeScript types used in the SecondPage components.
    - **Functionality**: It ensures type safety for schedule data structures.

19. **`src/app/components/SecondPage/ViewContainer.tsx`**
    - **Purpose**: This component renders the appropriate view based on the selected view type in the SecondPage.
    - **Functionality**: It manages the display of different content views.

20. **`src/app/components/SecondPage/views/FeedbackView.tsx`**
    - **Purpose**: This component handles user feedback submission and displays submitted feedback.
    - **Functionality**: It includes a form for entering feedback and a list of previous submissions.

21. **`src/app/components/SecondPage/views/PicturesView.tsx`**
    - **Purpose**: This component displays a view for showing pictures and includes a button to navigate to the next step.

22. **`src/app/components/SecondPage/views/ScheduleView.tsx`**
    - **Purpose**: This component allows users to select dates and manage their schedules.
    - **Functionality**: It includes a calendar and a form for adding notes to scheduled dates.

23. **`src/app/components/SecondPage/views/StickerView.tsx`**
    - **Purpose**: This component manages the sticker collection feature, allowing users to collect and drag stickers.
    - **Functionality**: It includes animations for opening sticker packs and displaying collected stickers.

## User Guide
1. **Getting Started**
   - **Accessing the Application**: 
     - Open your web browser and navigate to `http://localhost:3000` (or the deployed URL).
     - You will be greeted with the home page of the House of Iris and Tommy application.

2. **Uploading Memories**
   - **Step 1**: Click on the "Upload" button located on the main dashboard.
   - **Step 2**: Select the type of memory you want to upload (photo, video, or document).
   - **Step 3**: Choose the file from your device and add any relevant tags or descriptions.
   - **Step 4**: Click "Submit" to upload the memory. You will see a confirmation message once the upload is successful.

3. **Organizing Memories**
   - **Creating Albums**:
     - Navigate to the "Albums" section.
     - Click on "Create New Album" and enter a name for your album.
     - Add memories to the album by selecting them from your uploaded memories.
   - **Tagging Memories**:
     - While uploading, you can add tags to your memories for easier searching later.

4. **Sharing Memories**
   - **Step 1**: Go to the album or memory you wish to share.
   - **Step 2**: Click on the "Share" button.
   - **Step 3**: Enter the email addresses of the people you want to share with and customize the message if desired.
   - **Step 4**: Click "Send" to share the album or memory.

5. **Receiving Notifications**
   - Users will receive email notifications for important events, such as when someone shares a memory with them or when new memories are added to shared albums.

6. **Searching and Filtering Memories**
   - Use the search bar at the top of the page to find specific memories by entering tags or keywords.
   - You can also filter memories by date or category using the filter options available.

7. **Accessing Help and Support**
   - If you encounter any issues or have questions, please refer to the FAQ section on the website or contact support via the provided email address.

## Developer Guide
1. **Getting Started**
   - **Cloning the Repository**: 
     - Use the following command to clone the repository:
       ```bash
       git clone https://github.com/luongkhdang/houseofiris.git
       ```
   - **Installing Dependencies**: 
     - Navigate to the project directory and run:
       ```bash
       npm install
       ```

2. **Development Environment Setup**
   - Ensure you have the following installed:
     - Node.js (version 14.x or later)
     - npm (version 6.x or later)
     - Git for version control
   - Create a `.env` file in the root directory and add the necessary environment variables.

3. **Coding Standards**
   - **Code Formatting**: Use Prettier for consistent code formatting.
   - **Linting**: Use ESLint to identify and fix problems in your JavaScript code.
   - **Naming Conventions**: 
     - Use camelCase for variables and functions.
     - Use PascalCase for React components.
     - Use UPPER_SNAKE_CASE for constants.

4. **Branching Strategy**
   - Use the `main` branch for production-ready code.
   - Create feature branches for new features or bug fixes:
     ```bash
     git checkout -b feature/your-feature-name
     ```

5. **Submitting Changes**
   - After making changes, commit your code with a clear message:
     ```bash
     git commit -m "Add feature: your feature description"
     ```
   - Push your changes to the remote repository:
     ```bash
     git push origin feature/your-feature-name
     ```
   - Create a pull request (PR) to merge your changes into the `main` branch.

6. **Testing Your Code**
   - Run tests locally before submitting a PR:
     ```bash
     npm test
     ```
   - Ensure that all tests pass and that you have at least 80% code coverage.

7. **Code Review Process**
   - All PRs must be reviewed by at least one other team member before merging.
   - Address any feedback or requested changes from reviewers.

8. **Documentation**
   - Update the documentation as needed to reflect any changes made to the codebase.
   - Ensure that all new features are documented in the appropriate sections of `DOCUMENTATION.md`.

## Testing Strategy

The testing strategy for the House of Iris and Tommy project aims to ensure the quality, functionality, and security of the application. This section outlines the types of tests to be implemented, the areas to be tested, and the overall approach to testing.

### 1. Unit Tests
Unit tests are designed to verify the functionality of individual components and utility functions in isolation. The following areas will be covered:

- **Components**
  - **Memory Storage Component**: Test functions for adding, retrieving, and deleting memories.
  - **User Authentication Component**: Test login, registration, and logout functionalities.
  - **Media Upload Component**: Test file upload handling and error management.
  - **Gallery Component**: Test rendering of images and handling of user interactions (e.g., swiping).
  - **Feedback Component**: Test feedback submission and display of feedback data.

- **Utilities**
  - **Photo Service**: Test API calls for fetching and managing photos.
  - **Email Service**: Test email sending functionality and error handling.
  - **Schedule Service**: Test schedule management functions (fetching, saving, deleting).
  - **Optimized URL Generator**: Test URL generation logic for different image sizes.

- **Hooks**
  - **useSessionReset**: Test session reset functionality and state management.

### 2. Integration Tests
Integration tests verify that different components and services work together as expected. The following interactions will be tested:

- **Component Interactions**
  - **Memory Storage and Gallery Components**: Test the interaction between memory storage and gallery display.
  - **User Authentication and Feedback Component**: Test the flow of user authentication and subsequent feedback submission.
  - **Media Upload and Gallery Components**: Test the integration of media uploads and their display in the gallery.

- **API Integration**
  - **Feedback API**: Test the integration of the feedback component with the API for submitting and retrieving feedback.
  - **Photo API**: Test the integration of the gallery component with the photo API for fetching images.

### 3. End-to-End Tests
End-to-end tests simulate real user scenarios to ensure the application behaves as expected. The following user flows will be tested:

- **User Flows**
  - **User Registration and Login**: Test the complete flow of user registration, login, and logout.
  - **Memory Upload Process**: Test the entire process of uploading a memory, including file selection, tagging, and confirmation.
  - **Album Creation and Sharing**: Test the flow of creating an album, adding memories, and sharing it with other users.
  - **Feedback Submission**: Test the process of submitting feedback and viewing submitted feedback.

- **Responsive Design**
  - Test the application on different devices and screen sizes to ensure a responsive layout and functionality.

### 4. Performance Tests
Performance tests assess the application's responsiveness and stability under load. The following areas will be evaluated:

- **Load Testing**
  - Test the application under heavy load to ensure it can handle multiple users uploading memories and interacting with the gallery simultaneously.

- **API Response Times**
  - Measure the response times of API calls to ensure they meet performance benchmarks.

### 5. Security Tests
Security tests identify vulnerabilities in the application. The following areas will be examined:

- **Authentication and Authorization**
  - Test for vulnerabilities in the user authentication process, including SQL injection and cross-site scripting (XSS).
  - Ensure that users cannot access unauthorized routes or data.

### 6. Accessibility Tests
Accessibility tests ensure that the application is usable by people with disabilities. The following areas will be assessed:

- **Screen Reader Compatibility**
  - Test the application with screen readers to ensure that all components are accessible.
  
- **Keyboard Navigation**
  - Ensure that all interactive elements can be navigated using a keyboard.

### 7. Code Coverage
All tests should aim for at least 80% code coverage, focusing on critical functionalities and components. Code coverage helps identify untested parts of the codebase and ensures that critical functionality is adequately tested.

### Conclusion
By implementing a comprehensive testing strategy that includes unit tests, integration tests, end-to-end tests, performance tests, security tests, accessibility tests, and code coverage, the House of Iris and Tommy project can maintain high quality, ensure functionality, and provide a seamless user experience.

## Deployment
1. **Prerequisites**
   - Ensure that you have access to a Vercel account. If you don't have one, sign up at [Vercel](https://vercel.com/signup).
   - Make sure that your environment variables are set up correctly in Vercel.

2. **Building the Application**
   - Before deploying, build the application for production:
     ```bash
     npm run build
     ```
   - This command generates an optimized build in the `.next` directory.

3. **Deploying to Vercel**
   - **Step 1**: Install the Vercel CLI globally if you haven't already:
     ```bash
     npm install -g vercel
     ```
   - **Step 2**: In your terminal, navigate to the project directory:
     ```bash
     cd path/to/your/houseofiris
     ```
   - **Step 3**: Run the following command to deploy:
     ```bash
     vercel
     ```
   - **Step 4**: Follow the prompts to configure your deployment settings. When prompted for the project name, you can use `houseofiris` or any name you prefer.
   - **Step 5**: Vercel will automatically detect your Next.js application and set it up accordingly. It will also link your deployment to your GitHub repository at `https://github.com/luongkhdang/houseofiris`.

4. **Post-Deployment**
   - After deployment, verify that the application is running correctly by visiting the provided Vercel URL.
   - Check for any errors in the console or logs and address them as necessary.

5. **Continuous Deployment**
   - Once your project is linked to your GitHub repository, any push to the `main` branch will automatically trigger a new deployment on Vercel.
   - Ensure that your environment variables are set in the Vercel dashboard under the "Settings" tab for your project.

## Maintenance and Updates
1. **Regular Dependency Updates**
   - Regularly check for updates to dependencies using the following command:
     ```bash
     npm outdated
     ```
   - Update dependencies to their latest versions:
     ```bash
     npm update
     ```
   - After updating, run tests to ensure that everything works as expected.

2. **Security Audits**
   - Run security audits to identify vulnerabilities in your dependencies:
     ```bash
     npm audit
     ```
   - Address any vulnerabilities by following the recommendations provided by the audit.

3. **Code Reviews**
   - Conduct regular code reviews to ensure code quality and adherence to coding standards.
   - Encourage team members to review each other's code and provide constructive feedback.

4. **Documentation Updates**
   - Keep the documentation up to date with any changes made to the codebase or features.
   - Ensure that all new features are documented in the appropriate sections of `DOCUMENTATION.md`.

5. **Backup Procedures**
   - Implement regular backups of the database and any user-uploaded content.
   - Use automated backup solutions or scripts to ensure that backups are performed consistently.

6. **Monitoring and Logging**
   - Set up monitoring tools to track application performance and uptime.
   - Implement logging to capture errors and important events, which can help in troubleshooting issues.

7. **User Feedback**
   - Encourage users to provide feedback on the application.
   - Use feedback to identify areas for improvement and prioritize feature requests.

8. **Versioning**
   - Follow semantic versioning for releases (e.g., MAJOR.MINOR.PATCH).
   - Update the version number in `package.json` before each release.

9. **Scheduled Maintenance**
   - Plan and schedule regular maintenance windows to perform updates, backups, and other necessary tasks without disrupting users.
   - Communicate scheduled maintenance to users in advance to minimize inconvenience.

10. **Incident Response**
    - Establish a protocol for responding to incidents, such as application downtime or security breaches.
    - Document the steps to take in case of an incident and assign responsibilities to team members.

11. **Performance Optimization**
    - Regularly review application performance and identify areas for optimization.
    - Implement performance improvements as needed to ensure a smooth user experience.

12. **Deprecation Policy**
    - Define a policy for deprecating features or dependencies that are no longer supported or needed.
    - Communicate deprecation plans to users and provide alternatives when possible.

## Version Information

This section provides the current version numbers for the key technologies and libraries used in the House of Iris and Tommy project. Keeping this information up to date is essential for maintaining compatibility and ensuring that contributors are aware of the versions in use.

1. **Node.js**
   - Current Version: `14.x` or later

2. **npm**
   - Current Version: `6.x` or later

3. **Next.js**
   - Current Version: `12.x` (or specify the exact version being used)

4. **React**
   - Current Version: `17.x` (or specify the exact version being used)

5. **TypeScript**
   - Current Version: `4.x` (or specify the exact version being used)

6. **Tailwind CSS**
   - Current Version: `2.x` (or specify the exact version being used)

7. **Chakra UI**
   - Current Version: `1.x` (or specify the exact version being used)

8. **Framer Motion**
   - Current Version: `4.x` (or specify the exact version being used)

9. **Redis**
   - Current Version: `6.x` (or specify the exact version being used)

10. **Cloudinary**
    - Current Version: (Specify the version of the SDK being used)

11. **EmailJS**
    - Current Version: (Specify the version of the SDK being used)

12. **Axios**
    - Current Version: `0.21.x` (or specify the exact version being used)

13. **React Query**
    - Current Version: `3.x` (or specify the exact version being used)

### Updating Version Information
- Regularly check for updates to these libraries and frameworks.
- Update this section whenever a new version is adopted in the project.
- Use the following command to check the installed versions of dependencies:
  ```bash
  npm list --depth=0
  ```
