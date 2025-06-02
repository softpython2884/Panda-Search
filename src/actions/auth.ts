// src/actions/auth.ts
'use server';

import { login as loginUser, register as registerUser, logout as logoutUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const RegisterSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
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
    if (user) {
      // Successful login
    } else {
      return { message: "Invalid email or password.", success: false, errors: { general: ["Invalid email or password."] } };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { message: "An unexpected error occurred.", success: false, errors: { general: ["An unexpected error occurred."] } };
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
    if (user) {
      // Successful registration
    } else {
      return { message: "User already exists or registration failed.", success: false, errors: { general: ["User already exists or registration failed."] } };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return { message: "An unexpected error occurred.", success: false, errors: { general: ["An unexpected error occurred."] } };
  }
  redirect('/');
}

export async function logoutAction() {
  await logoutUser();
  redirect('/');
}