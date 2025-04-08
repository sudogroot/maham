import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '../../back/src/trpc/router';

// Create a tRPC client
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/trpc',
      headers: () => {
        // Get the token from localStorage if available
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        
        return {
          ...(token && { Authorization: `Bearer ${token}` }),
        };
      },
    }),
  ],
});

// Auth helper functions
export const auth = {
  // Register a new user
  async register(email: string, password: string, name?: string) {
    try {
      const result = await trpc.auth.register.mutate({ email, password, name });
      if (result.token) {
        localStorage.setItem('authToken', result.token);
      }
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return { user: null, token: null, error: 'Registration failed' };
    }
  },
  
  // Login
  async login(email: string, password: string) {
    try {
      const result = await trpc.auth.login.mutate({ email, password });
      if (result.token) {
        localStorage.setItem('authToken', result.token);
      }
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, token: null, error: 'Login failed' };
    }
  },
  
  // Logout
  async logout() {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await trpc.auth.logout.mutate({ token });
        localStorage.removeItem('authToken');
      }
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },
  
  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return false;
      
      const result = await trpc.auth.verifySession.query({ token });
      return result.valid;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },
  
  // Request password reset
  async requestPasswordReset(email: string) {
    try {
      return await trpc.auth.requestPasswordReset.mutate({ email });
    } catch (error) {
      console.error('Password reset request error:', error);
      return { success: false };
    }
  },
  
  // Reset password
  async resetPassword(token: string, newPassword: string) {
    try {
      return await trpc.auth.resetPassword.mutate({ token, newPassword });
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false };
    }
  },
}; 