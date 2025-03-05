# House of Iris and Tommy: Test Improvement Plan

## Current Status
As of our latest test run, we have:
- 13 test suites with 37 tests
- Overall code coverage: 33.75% 
- 4 test failures fixed:
  - Fixed feedbacks.test.ts with order-independent assertions
  - Fixed schedules.test.ts by using future dates and mocking Date
  - Fixed GalleryPage.test.tsx by improving error handling test
  - Fixed comprehensive.test.tsx by updating fetch mock and EmailJS mock

## Progress Update
We've made significant progress implementing the Phase 1 "Quick Wins" from our plan:

### Completed Tasks:
1. Created standardized mocks:
   - ✅ Created unified Redis mock in `src/__tests__/__mocks__/redisMock.ts`
   - ✅ Created unified Cloudinary mock in `src/__tests__/__mocks__/cloudinaryMock.ts`
   - ✅ Created unified EmailJS mock in `src/__tests__/__mocks__/emailjsMock.ts`

2. Created test utilities:
   - ✅ Created common test utilities in `src/__tests__/helpers/testUtils.ts`
   - ✅ Implemented custom render with providers
   - ✅ Added test data generation
   - ✅ Added API endpoint mocks

3. Added tests for high-priority components:
   - ✅ Created test for ClientLayout.tsx (was at 0% coverage)
   - ✅ Created test for Timer.tsx (was at 0% coverage)

4. Created test documentation:
   - ✅ Created test standards document in `test-standards.md`

### Next Steps (In Progress):
1. Add tests for remaining high-priority components:
   - Timers.tsx
   - SecondPage/views/StickerView.tsx

2. Add tests for API routes:
   - app/api/redis/route.ts
   - app/api/photos/route.ts

3. Add tests for utility functions:
   - utils/redis.ts
   - app/hooks/useSessionReset.ts
   - app/hooks/usePage.ts

## Areas for Improvement

### 1. Increase Code Coverage
The current coverage of ~33% is below industry standards of 70-80%. Priority areas for improvement:

#### High-Priority Components (0-20% Coverage):
- ~~`app/components/ClientLayout.tsx`: 0%~~ ✅ Now tested
- ~~`app/components/Timer.tsx`: 0%~~ ✅ Now tested
- `app/components/Timers.tsx`: 0%
- `app/components/SecondPage/views/StickerView.tsx`: 11.76%
- `app/components/GalleryPage/services/photoService.ts`: 20%
- `app/components/SecondPage/services/scheduleService.ts`: 16.66%

#### High-Priority API Routes:
- `app/api/redis/route.ts`: 0%
- `app/api/photos/route.ts`: 53.33%

#### Utility Functions:
- `utils/redis.ts`: 0%
- `app/hooks/useSessionReset.ts`: 0% 
- `app/hooks/usePage.ts`: 0%

### 2. Improve Test Quality

#### Mock Implementation
- ✅ Create standard mocks for external dependencies:
  - ✅ Create a unified mock for Redis in `__mocks__/redisMock.ts`
  - ✅ Create a unified mock for Cloudinary in `__mocks__/cloudinaryMock.ts`
  - ✅ Create a unified mock for EmailJS in `__mocks__/emailjsMock.ts`

#### Test Helpers
- ✅ Create test utility functions to:
  - ✅ Set up test environment
  - ✅ Generate test data
  - ✅ Provide common assertions

#### Consistent Test Structure
- ✅ Standardize test file organization:
  - ✅ Setup section with mock configuration
  - ✅ Test suites grouped by functionality
  - ✅ Cleanup section for restoring mocks

### 3. Add New Test Types

#### Unit Tests
- Create unit tests for uncovered utility functions
- Add tests for edge cases in existing components

#### Integration Tests
- Test interactions between components
- Test API route integrations with front-end components

#### End-to-End Tests
- Create Cypress tests for critical user flows:
  - Photo gallery navigation
  - Feedback submission
  - Schedule management
  - Sticker collection

### 4. Address Test Issues

#### Fix Test Warnings
- Resolve punycode module deprecation warnings
- Fix console errors in photo API tests

#### Improve Test Performance
- Optimize test execution to reduce time
- Group related tests to minimize setup/teardown overhead

### 5. Test Documentation
- ✅ Created test standards document in `test-standards.md`
- ⚙️ Regular test coverage reports (In Progress)

## Implementation Timeline

### Phase 1: Quick Wins (1-2 Weeks) - IN PROGRESS
- ✅ Create standard mocks for external dependencies
- ✅ Create test documentation
- ⚙️ Add unit tests for utility functions (In Progress)
- ⚙️ Fix remaining test warnings (In Progress)

### Phase 2: Coverage Expansion (2-4 Weeks)
- Add tests for components with lowest coverage
- Implement test helpers and utilities
- Create documentation for testing standards

### Phase 3: Advanced Testing (4-6 Weeks)
- Add integration tests for component interactions
- Develop end-to-end tests for critical flows
- Implement automated coverage reporting

## Success Metrics
- Increase overall code coverage to at least 70%
- Ensure all API routes have at least 80% coverage
- All critical component interactions covered by integration tests
- Key user flows covered by end-to-end tests
- Zero test warnings or errors
- Consistent test execution times

## Regular Maintenance
- Review test coverage weekly
- Update tests for new features
- Refactor tests as code evolves
- Document testing patterns for reuse 