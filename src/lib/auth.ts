// This is a mock auth system. In a real app, use a secure solution.
'use server';
import { cookies } from 'next/headers';
import type { User } from '@/types';

const MOCK_USERS: Record<string, User> = {
  'user@example.com': { id: '1', email: 'user@example.com', password: 'password123' },
};

const SESSION_COOKIE_NAME = 'panda_session';

export async function login(email: string, password?: string): Promise<User | null> {
  // In a real app, hash passwords and compare securely
  const user = MOCK_USERS[email];
  if (user && user.password === password) {
    cookies().set(SESSION_COOKIE_NAME, user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return { id: user.id, email: user.email };
  }
  return null;
}

export async function register(email: string, password?: string): Promise<User | null> {
  if (MOCK_USERS[email]) {
    return null; // User already exists
  }
  const newUser: User = { id: String(Date.now()), email, password };
  MOCK_USERS[email] = newUser; // Simulate saving the user

  cookies().set(SESSION_COOKIE_NAME, newUser.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  return { id: newUser.id, email: newUser.email };
}

export async function logout() {
  cookies().delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<{ user: User; isLoggedIn: true } | { user: null; isLoggedIn: false }> {
  const userId = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (userId) {
    // In a real app, fetch user details from DB based on userId
    const user = Object.values(MOCK_USERS).find(u => u.id === userId);
    if (user) {
      return { user: { id: user.id, email: user.email }, isLoggedIn: true };
    }
  }
  return { user: null, isLoggedIn: false };
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session.user;
}
