import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/client";
import { nextCookies } from 'better-auth/next-js';
import * as schema from "./db/schema";
import {
  twoFactor,
  username,
  anonymous,
  organization,
  admin,
  emailOTP,
} from "better-auth/plugins";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: schema,
  }),
  // advanced: {
  // generateId: false
  // },
  session: {
    expiresIn: 60 * 60 * 24 * 3,     // 3 days in seconds
    updateAge: 60 * 60 * 12,         // 12 hours (half day) in seconds
  },
  appName: "maham",
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }, request) {
        // Send email with OTP
      },
    }),
    admin(),
    organization(),
    anonymous(),
    username(),
    twoFactor(),
    nextCookies()
  ],
});
