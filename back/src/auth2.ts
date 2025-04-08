import { createAuthClient } from "better-auth/client";
import type { auth } from "./auth";
import {
  inferAdditionalFields,
  twoFactorClient,
  usernameClient,
  anonymousClient,
  organizationClient,
  adminClient,
  emailOTPClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [
    inferAdditionalFields<typeof auth>(),
    twoFactorClient(),
    usernameClient(),
    anonymousClient(),
    organizationClient(),
    adminClient(),
    emailOTPClient(),
  ],
});
