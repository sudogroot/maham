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

// Auth client for better-auth integration

// API URL for connecting to the backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper functions for working with auth in the client
export const authClient = {
  // Register a new user
  async register(email: string, password: string, name?: string) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        return { 
          user: null, 
          session: null, 
          error: result.error || 'Registration failed' 
        };
      }
      
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        user: null, 
        session: null, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  },
  
  // Login with email and password
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        return { 
          user: null, 
          session: null, 
          error: result.error || 'Login failed' 
        };
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { 
        user: null, 
        session: null, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  },
  
  // Logout the current user
  async logout() {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      return response.ok;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },
  
  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const session = await this.getSession();
      return !!session;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },
  
  // Get current user session
  async getSession() {
    try {
      const response = await fetch(`${API_URL}/auth/session`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      return data.session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  },
  
  // Request password reset
  async requestPasswordReset(email: string) {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const result = await response.json();
        return { 
          success: false, 
          error: result.error || 'Request failed' 
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Password reset request error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Request failed' 
      };
    }
  },
  
  // Reset password with token
  async resetPassword(token: string, newPassword: string) {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password: newPassword }),
      });
      
      if (!response.ok) {
        const result = await response.json();
        return { 
          success: false, 
          error: result.error || 'Reset failed' 
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Reset failed' 
      };
    }
  },
  
  // Get current user
  async getUser() {
    try {
      const session = await this.getSession();
      return session?.user || null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }
}; 