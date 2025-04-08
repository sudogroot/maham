// Temporary mock implementation for auth client
// This will be replaced by the real implementation once better-auth is installed

// Define types for our auth client
interface User {
  id: number;
  email: string;
  name?: string;
}

interface Session {
  token: string;
  userId: number;
  expiresAt: string;
}

interface AuthResult {
  user: User | null;
  session: Session | null;
  error?: string;
}

interface PasswordResetResult {
  success: boolean;
  error?: string;
}

// Mock auth client until better-auth is properly installed
export const authClient = {
  // Register a new user
  async register(email: string, password: string, name?: string): Promise<AuthResult> {
    console.log('Register called with:', email, password, name);
    // This is a mock implementation
    return { 
      user: { id: 1, email, name },
      session: { token: 'mock-token', userId: 1, expiresAt: '2099-01-01' },
      // error: 'Registration is temporarily disabled' // Uncomment to test error case
    };
  },
  
  // Login
  async login(email: string, password: string): Promise<AuthResult> {
    console.log('Login called with:', email, password);
    // This is a mock implementation
    return { 
      user: { id: 1, email },
      session: { token: 'mock-token', userId: 1, expiresAt: '2099-01-01' },
      // error: 'Invalid credentials' // Uncomment to test error case
    };
  },
  
  // Logout
  async logout(): Promise<boolean> {
    console.log('Logout called');
    // This is a mock implementation
    localStorage.removeItem('authToken');
    return true;
  },
  
  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    console.log('isAuthenticated called');
    // This is a mock implementation
    return !!localStorage.getItem('authToken');
  },
  
  // Request password reset
  async requestPasswordReset(email: string): Promise<PasswordResetResult> {
    console.log('requestPasswordReset called with:', email);
    // This is a mock implementation
    return { success: true };
  },
  
  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<PasswordResetResult> {
    console.log('resetPassword called with:', token, newPassword);
    // This is a mock implementation
    return { success: true };
  },
  
  // Get current user
  async getUser(): Promise<User | null> {
    console.log('getUser called');
    // This is a mock implementation
    return { id: 1, email: 'user@example.com', name: 'Example User' };
  },
}; 