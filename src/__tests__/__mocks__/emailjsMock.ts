/**
 * EmailJS Mock for Testing
 */

// Types for EmailJS data
interface EmailParams {
  serviceId: string;
  templateId: string;
  templateParams: Record<string, unknown>;
  userId?: string;
  accessToken?: string;
}

interface EmailResponse {
  status: number;
  text: string;
}

// Track sent emails for verification
let sentEmails: EmailParams[] = [];
let configuredUserId: string | null = null;

// Create the mock
const emailjsMock = {
  // Initialize EmailJS
  init: jest.fn().mockImplementation((userId: string) => {
    configuredUserId = userId;
    return Promise.resolve();
  }),

  // Legacy method
  sendForm: jest.fn().mockImplementation(
    (serviceId: string, templateId: string, templateParams: Record<string, unknown>, userId?: string) => {
      const email: EmailParams = {
        serviceId,
        templateId,
        templateParams,
        userId: userId || configuredUserId || undefined
      };
      
      sentEmails.push(email);
      
      return Promise.resolve({
        status: 200,
        text: 'OK'
      } as EmailResponse);
    }
  ),

  // Current method
  send: jest.fn().mockImplementation(
    (serviceId: string, templateId: string, templateParams: Record<string, unknown>, accessToken?: string) => {
      const email: EmailParams = {
        serviceId,
        templateId,
        templateParams,
        accessToken
      };
      
      sentEmails.push(email);
      
      return Promise.resolve({
        status: 200,
        text: 'OK'
      } as EmailResponse);
    }
  ),

  // Test helpers
  __getSentEmails: () => {
    return [...sentEmails];
  },

  __getLastEmail: () => {
    return sentEmails.length > 0 ? sentEmails[sentEmails.length - 1] : null;
  },

  __clearEmails: () => {
    sentEmails = [];
    configuredUserId = null;
  },

  __setNextSendToFail: (errorMessage = 'Failed to send email') => {
    emailjsMock.send.mockImplementationOnce(
      () => Promise.reject(new Error(errorMessage))
    );
  },

  __getConfiguredUserId: () => configuredUserId
};

export default emailjsMock;

// Usage example:
/*
// In your test file:
import emailjsMock from '../__mocks__/emailjsMock';

// Mock the emailjs module
jest.mock('@emailjs/browser', () => emailjsMock);

describe('Email Functionality Tests', () => {
  beforeEach(() => {
    // Clear email history before each test
    emailjsMock.__clearEmails();
  });

  it('should send an email with correct parameters', async () => {
    // Your component/function that sends an email
    await yourEmailFunction({
      name: 'Test User',
      message: 'Hello world!'
    });
    
    // Check if email was sent correctly
    const lastEmail = emailjsMock.__getLastEmail();
    expect(lastEmail).toBeTruthy();
    expect(lastEmail.templateParams.name).toBe('Test User');
    expect(lastEmail.templateParams.message).toBe('Hello world!');
  });

  it('should handle email sending errors', async () => {
    // Set the next send call to fail
    emailjsMock.__setNextSendToFail('Network error');
    
    // Expect your function to handle the error
    await expect(yourEmailFunction({})).rejects.toThrow('Network error');
  });
});
*/ 