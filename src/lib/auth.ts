// src/lib/auth.ts
'use server';
import { cookies } from 'next/headers';
import type { User } from '@/types';

const PANDA_API_URL = process.env.PANDA_API_URL || 'http://localhost:9002';
const SESSION_COOKIE_NAME = 'panda_session';
const JWT_COOKIE_NAME = 'panda_jwt_token';
const USER_EMAIL_COOKIE_NAME = 'panda_user_email'; // To store email for quick access in getSession

interface PandaUserLoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    created_at: string;
  };
}

interface PandaUserRegisterResponse {
  id: string;
  email: string;
  created_at: string;
}

export async function login(email: string, password?: string): Promise<User | null> {
  try {
    const response = await fetch(`${PANDA_API_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Login failed: ${response.statusText}` }));
      throw new Error(errorData.message || `Login failed: ${response.statusText}`);
    }

    const responseData: PandaUserLoginResponse = await response.json();

    if (responseData.token && responseData.user) {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      };
      cookies().set(JWT_COOKIE_NAME, responseData.token, cookieOptions);
      cookies().set(SESSION_COOKIE_NAME, responseData.user.id, cookieOptions);
      cookies().set(USER_EMAIL_COOKIE_NAME, responseData.user.email, cookieOptions);
      
      return { id: responseData.user.id, email: responseData.user.email };
    }
    return null;
  } catch (error) {
    console.error('PANDA API Login error:', error);
    if (error instanceof Error) {
        throw error; // Re-throw the error to be caught by the action
    }
    throw new Error('An unexpected error occurred during login.');
  }
}

export async function register(email: string, password?: string): Promise<User | null> {
  try {
    const response = await fetch(`${PANDA_API_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Registration failed: ${response.statusText}` }));
      throw new Error(errorData.message || `Registration failed: ${response.statusText}`);
    }

    // const responseData: PandaUserRegisterResponse = await response.json(); // Not strictly needed if we auto-login
    // After successful registration, attempt to log the user in
    return await login(email, password);

  } catch (error) {
    console.error('PANDA API Register error:', error);
     if (error instanceof Error) {
        throw error; // Re-throw the error to be caught by the action
    }
    throw new Error('An unexpected error occurred during registration.');
  }
}

export async function logout() {
  cookies().delete(JWT_COOKIE_NAME);
  cookies().delete(SESSION_COOKIE_NAME);
  cookies().delete(USER_EMAIL_COOKIE_NAME);
}

export async function getSession(): Promise<{ user: User | null; isLoggedIn: boolean }> {
  const userId = cookies().get(SESSION_COOKIE_NAME)?.value;
  const userEmail = cookies().get(USER_EMAIL_COOKIE_NAME)?.value;
  // We could also validate the JWT_COOKIE_NAME here if needed, or call /api/users/me
  // For now, presence of userId and userEmail implies loggedIn status for the UI

  if (userId && userEmail) {
    return { user: { id: userId, email: userEmail }, isLoggedIn: true };
  }
  return { user: null, isLoggedIn: false };
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session.user;
}

export async function getJwtToken(): Promise<string | undefined> {
  return cookies().get(JWT_COOKIE_NAME)?.value;
}
