import { z } from "zod";

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  // RapidAPI
  NEXT_PUBLIC_RAPIDAPI_URL: z.string().url(),
  NEXT_PUBLIC_RAPIDAPI_KEY: z.string().min(1),
  NEXT_PUBLIC_RAPIDAPI_HOST: z.string().min(1),
  NEXT_PUBLIC_RAPIDAPI_USER: z.string().min(1),
});

export const env = envSchema.parse({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

  // RapidAPI
  NEXT_PUBLIC_RAPIDAPI_URL: process.env.NEXT_PUBLIC_RAPIDAPI_URL,
  NEXT_PUBLIC_RAPIDAPI_KEY: process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
  NEXT_PUBLIC_RAPIDAPI_HOST: process.env.NEXT_PUBLIC_RAPIDAPI_HOST,
  NEXT_PUBLIC_RAPIDAPI_USER: process.env.NEXT_PUBLIC_RAPIDAPI_USER,
});

export type Env = z.infer<typeof envSchema>;
