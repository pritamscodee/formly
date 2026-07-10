"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export const authClient = {
  signIn,
  signOut,
  useSession,
};
