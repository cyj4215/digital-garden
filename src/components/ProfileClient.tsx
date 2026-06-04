"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileEditor from "@/components/ProfileEditor";

interface ProfileData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  nickname: string | null;
  bio: string | null;
  birthDate: string | null;
  avatar: string | null;
  skills: string | null;
  socialLinks: string | null;
  themePreference: string;
  profilePublic: boolean;
  createdAt: string;
}

export default function ProfileClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/zh/auth/login");
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/profile")
        .then((r) => r.json())
        .then((data) => setProfile(data.user))
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  if (!profile) return null;

  return <ProfileEditor profile={profile} />;
}
