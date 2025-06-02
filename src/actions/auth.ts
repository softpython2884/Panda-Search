// src/actions/auth.ts
'use server';

import { login as loginUser, register as registerUser, logout as logoutUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password cannot be empty." }), // Min 1 for backend to validate length
});

const RegisterSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], 
});


export type LoginFormState = {
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    general?: string[];
  };
  success: boolean;
};

export async function loginAction(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await loginUser(email, password);
    if (!user) {
      // This case might not be reached if loginUser always throws on API error
      return { message: "Login failed. Please check your credentials.", success: false, errors: { general: ["Login failed. Please check your credentials."] } };
    }
    // Successful login, user object might be used if needed here
  } catch (error) {
    console.error("Login action error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred during login.";
    return { message, success: false, errors: { general: [message] } };
  }
  redirect('/');
}


export type RegisterFormState = {
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    general?: string[];
  };
  success: boolean;
};

export async function registerAction(prevState: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await registerUser(email, password);
    if (!user) {
      // This case might not be reached if registerUser always throws on API error or auto-login failure
       return { message: "Registration failed. Please try again.", success: false, errors: { general: ["Registration failed. Please try again."] } };
    }
    // Successful registration and auto-login
  } catch (error) {
    console.error("Register action error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred during registration.";
    return { message, success: false, errors: { general: [message] } };
  }
  redirect('/');
}

export async function logoutAction() {
  await logoutUser();
  redirect('/');
}
