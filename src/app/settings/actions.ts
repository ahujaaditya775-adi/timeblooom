"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

export interface SettingsActionState {
  error?: string;
  success?: string;
}

export async function updateProfileAction(
  _prev: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const fullName = String(formData.get("fullName") || "").trim();
  const avatarUrl = String(formData.get("avatarUrl") || "").trim();

  const parsed = z.string().min(1, "Enter your name.").max(100).safeParse(fullName);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Your session expired — please log in again." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data, avatar_url: avatarUrl || null })
    .eq("id", user.id);

  if (error) return { error: "Couldn't save your profile. Please try again." };

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: "Profile updated." };
}

export async function changePasswordAction(
  _prev: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirmPassword") || "");

  if (password !== confirm) return { error: "Passwords don't match." };
  const parsed = z.string().min(8, "Password must be at least 8 characters.").safeParse(password);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data });
  if (error) return { error: error.message };

  return { success: "Password updated." };
}

export async function toggleNotificationsAction(enabled: boolean): Promise<SettingsActionState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Your session expired — please log in again." };

  const { error } = await supabase
    .from("profiles")
    .update({ email_notifications: enabled })
    .eq("id", user.id);

  if (error) return { error: "Couldn't update your notification preference." };
  revalidatePath("/settings");
  return { success: "Saved." };
}

export async function deleteAccountAction(_prev: SettingsActionState, formData: FormData): Promise<SettingsActionState> {
  const confirmation = String(formData.get("confirmation") || "");
  if (confirmation !== "DELETE") {
    return { error: 'Type "DELETE" to confirm.' };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Your session expired — please log in again." };

  // Deleting the auth user requires the service-role key; capsules,
  // capsule_media, reflections, and the profile row all cascade via FK.
  const admin = createServiceRoleClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return { error: "Couldn't delete your account. Please try again or contact support." };

  await supabase.auth.signOut();
  redirect("/");
}
