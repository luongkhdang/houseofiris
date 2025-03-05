# Comprehensive Documentation for House of Iris and Tommy

## Introduction
The **House of Iris and Tommy** project is a personal memory storage application built using modern web technologies. This document serves as a comprehensive guide for developers and contributors, outlining the project's purpose, structure, and best practices.

## Project Structure

1. **Directory Layout**
   - **`/components`**: Reusable React components.
   - **`/pages`**: Next.js pages corresponding to application routes.
   - **`/styles`**: Global and component-specific styles using Tailwind CSS.
   - **`/utils`**: Utility functions and helpers.
   - **`/public`**: Static assets like images and fonts.
   - **`/api`**: API routes for server-side logic.
   - **`/lib`**: Libraries and configurations, including React Query.
   - **`/hooks`**: Custom React hooks.
   - **`/types`**: TypeScript type definitions.

2. **Key Components**
   - **Memory Storage**: Manages personal memories.
   - **User Authentication**: Handles login and registration.
   - **Media Upload**: Uploads photos and videos to Cloudinary.
   - **Email Notification**: Sends notifications using EmailJS.
   - **Gallery**: Displays photos in a gallery format.
   - **Feedback**: Collects and displays user feedback.

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
   - Node.js (14.x or later) and npm (6.x or later).
   - Git for version control.

2. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/house-of-iris-and-tommy.git
   cd house-of-iris-and-tommy
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Environment Configuration**
   - Create a `.env` file and add:
     ```plaintext
     NEXT_PUBLIC_CLOUDINARY_URL=your_cloudinary_url
     EMAILJS_USER_ID=your_emailjs_user_id
     REDIS_URL=your_redis_url
     ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   - Access the application at `http://localhost:3000`.

6. **Build for Production**
   ```bash
   npm run build
   ```

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

The House of Iris and Tommy project employs a robust testing strategy to ensure the quality, functionality, and security of the application. This section outlines the testing framework used, how to run tests, the structure of the tests, and additional recommendations.

### Testing Frameworks
- **Jest**: A JavaScript testing framework used for unit and integration testing.
- **React Testing Library**: A library for testing React components, focusing on user interactions.
- **Cypress**: A framework for end-to-end testing, simulating real user scenarios.
- **Lighthouse**: A tool for performance testing.
- **OWASP ZAP**: A tool for security testing.

### Running Tests
To run the tests, use the following command:

```bash
npm test
```

### Test Structure
- **API Tests**: Located in `src/__tests__/api/`
- **Component Tests**: Located in `src/__tests__/components/`

### Code Coverage
To monitor how much of your code is covered by tests, Jest's built-in coverage reporting can be used. Update your `package.json` test script to include coverage:

```json
"scripts": {
  "test": "jest --coverage"
}
```

### Continuous Integration (CI)
A CI pipeline can be set up using GitHub Actions to automate testing on every push or pull request.

### Performance and Security Testing
Integrate performance testing tools like Lighthouse and security testing tools like OWASP ZAP into your CI pipeline to ensure the application meets performance benchmarks and is secure.

### User Acceptance Testing (UAT)
Engage users to test the application and provide feedback. This can help identify usability issues and areas for improvement.

### Regular Documentation Updates
Keep the documentation up to date with any changes in the codebase, features, or testing strategies. This is crucial for onboarding new developers and maintaining project clarity.

### Conclusion
By implementing a comprehensive testing strategy that includes unit tests, integration tests, end-to-end tests, performance tests, and security tests, the House of Iris and Tommy project can maintain high quality, ensure functionality, and provide a seamless user experience.

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

## Testing

The House of Iris and Tommy project uses Jest and React Testing Library for testing components and API routes. 

### Running Tests
To run the tests, use the following command:

```bash
npm test
```

### Test Structure
- **API Tests**: Located in `src/__tests__/api/`
- **Component Tests**: Located in `src/__tests__/components/`

### Adding New Tests
When adding new features or components, ensure to create corresponding tests to maintain code quality and functionality.

