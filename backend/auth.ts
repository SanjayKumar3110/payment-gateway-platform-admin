export interface AuthResponse {
    user?: { id: string; email: string; name: string; role: string };
    token?: string;
    error?: string;
  }
  
  export async function authenticateUser(email: string, password: string): Promise<AuthResponse> {
    try {
      // Send the credentials to your new Express server
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      // If the server returns a 401 error, pass it to the UI
      if (!response.ok) {
        return { error: data.error || 'Login failed. Please try again.' };
      }
  
      // Success! Return the token and user data
      return {
        token: data.token,
        user: data.user
      };
  
    } catch (error) {
      console.error("Auth fetch error:", error);
      return { error: 'Could not connect to the server. Is it running?' };
    }
  }