import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGoogleAccessToken } from "@/lib/google";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const accessToken = await getGoogleAccessToken(userId);

    // "mine=true" gets the channel owned by the signed-in Google account
    const res = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message || "YouTube API error" },
        { status: res.status }
      );
    }

    const channel = data.items?.[0];
    if (!channel) {
      return NextResponse.json({ error: "No YouTube channel found on this Google account." }, { status: 404 });
    }

    return NextResponse.json({
      title: channel.snippet?.title,
      subscribers: channel.statistics?.subscriberCount,
      views: channel.statistics?.viewCount,
      videos: channel.statistics?.videoCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
