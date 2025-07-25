// src/hooks/use-profile.ts
import { useState, useEffect } from "react";
import { ProfileFormData } from "@/lib/validations/profiles";
import { toast } from "sonner";

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string | null;
}

interface UseProfile {
  profile: Profile | null;
  updateProfile: (data: ProfileFormData) => Promise<void>;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
}

export function useProfile(): UseProfile {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  async function fetchProfile() {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      const { data : user_profile } = await response.json();
      setProfile(user_profile);
      return user_profile;
    } catch (error) {
      setProfile(null);
      return null;
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return { profile, updateProfile, isLoading, fetchProfile };
}