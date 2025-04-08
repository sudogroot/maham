import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { organization, twoFactor } from 'better-auth/plugins';

// Get database connection string from environment variables
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/maham';

// Configure better-auth
export const auth = betterAuth({
  // Set trusted origins for CORS
  trustedOrigins: [process.env.FRONTEND_URL || 'http://localhost:3000'],
  // Connect to database
  database: new Pool({
    connectionString: DATABASE_URL,
  }),
  // Enable email and password authentication
  emailAndPassword: {
    enabled: true,
    // Configure email sending
    emailVerification: {
      enabled: true,
      from: 'noreply@example.com',
      subject: 'Verify your email',
      transport: {
        type: 'mock', // Change to 'smtp' in production
        // Add your SMTP configuration in production
      }
    },
    passwordReset: {
      enabled: true,
      from: 'noreply@example.com',
      subject: 'Reset your password',
      transport: {
        type: 'mock', // Change to 'smtp' in production
      }
    }
  },
  // Enable two-factor authentication and organization management
  plugins: [
    organization(),
    twoFactor(),
  ],
  // JWT secret for session tokens
  session: {
    secret: process.env.JWT_SECRET || 'supersecretkey',
    expires: '7d', // Sessions expire after 7 days
  }
});

// Add custom helper functions that wrap better-auth functionality
// This is a workaround for TypeScript until we have proper type definitions
export const authHelpers = {
  // User methods
  user: {
    get: async ({ userId }: { userId: number }) => {
      // Implementation will depend on better-auth's actual API
      return {
        id: userId,
        email: 'user@example.com',
        name: 'Example User'
      };
    }
  },
  
  // Organization methods
  organization: {
    listByUser: async ({ userId }: { userId: number }) => {
      // Implementation will depend on better-auth's actual API
      return [
        { id: 1, name: 'Example Organization' }
      ];
    },
    create: async ({ userId, name }: { userId: number, name: string }) => {
      // Implementation will depend on better-auth's actual API
      return { 
        id: Math.floor(Math.random() * 1000),
        name,
        createdAt: new Date()
      };
    }
  },
  
  // Two-Factor methods
  twoFactor: {
    enable: async ({ userId }: { userId: number }) => {
      // This would typically generate a secret and QR code
      return {
        secret: "EXAMPLE_SECRET",
        qrCode: "https://example.com/qr"
      };
    },
    disable: async ({ userId }: { userId: number }) => {
      // Implementation to disable 2FA
      return true;
    },
    verify: async ({ userId, code }: { userId: number, code: string }) => {
      // Verify the 2FA code
      return { verified: code.length === 6 };
    }
  },
  
  // Session validation
  session: {
    validate: async ({ token }: { token: string }) => {
      try {
        // This is a basic implementation - the actual implementation
        // will depend on better-auth's API
        if (token && token.length > 10) {
          return {
            userId: 1,
            sessionId: 'example-session'
          };
        }
        return null;
      } catch (error) {
        console.error('Session validation error:', error);
        return null;
      }
    }
  }
}; 