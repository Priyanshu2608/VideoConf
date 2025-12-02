"use client";

import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
  console.log("✅ Stream Provider Component Rendered");

  const [videoClient, setVideoClient] = useState<
    StreamVideoClient | undefined
  >();

  const { user, isLoaded } = useUser();

  // reset client if user logs out
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) setVideoClient(undefined);
  }, [user, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (!apiKey) throw new Error("NEXT_PUBLIC_STREAM_API_KEY is missing");

    console.log("✅ Stream Provider Initializing...");

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user.id,
        name: user.username || user.id,
        image: user.imageUrl,
      },
      tokenProvider,
    });

    console.log("✅ Stream client created for:", user.id);

    setVideoClient(client);

    // cleanup to prevent ghost clients
    return () => {
      client.disconnectUser();
      console.log("🧹 Stream client disconnected");
    };
  }, [user, isLoaded]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
