import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Returns a valid Google access token for this user, refreshing it first
 * if it has expired. NextAuth stores the original access_token + refresh_token
 * in the Account table (via the Prisma adapter) when a user signs in with
 * access_type: "offline".
 */
export async function getGoogleAccessToken(userId: string): Promise<string> {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });

  if (!account) {
    throw new Error("No Google account linked for this user.");
  }

  const isExpired =
    !account.expires_at || account.expires_at * 1000 < Date.now();

  if (!isExpired && account.access_token) {
    return account.access_token;
  }

  if (!account.refresh_token) {
    throw new Error(
      "No refresh token on file. The user needs to sign out and sign in again with consent to get one."
    );
  }

  // Refresh the token with Google
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: account.refresh_token,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      `Failed to refresh Google token: ${data.error || res.statusText}`
    );
  }

  // Save the new access token + expiry back to the database
  await prisma.account.update({
    where: { id: account.id },
    data: {
      access_token: data.access_token,
      expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
    },
  });

  return data.access_token;
}
