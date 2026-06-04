"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { t } from "@/lib/i18n";

interface Profile {
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

export default function ProfileEditor({ profile }: { profile: Profile }) {
  const locale = "zh"; // Will be passed from parent if needed

  const [nickname, setNickname] = useState(profile.nickname || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [birthDate, setBirthDate] = useState(profile.birthDate ? profile.birthDate.split("T")[0] : "");
  const [skills, setSkills] = useState<string[]>(profile.skills ? JSON.parse(profile.skills) : []);
  const [skillInput, setSkillInput] = useState("");
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(
    profile.socialLinks ? JSON.parse(profile.socialLinks) : { github: "", twitter: "", website: "" }
  );
  const [themePreference, setThemePreference] = useState(profile.themePreference);
  const [profilePublic, setProfilePublic] = useState(profile.profilePublic);
  const [avatar, setAvatar] = useState(profile.avatar || profile.image || null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/profile/avatar", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setAvatar(data.avatar);
    } catch {
      alert("头像上传失败");
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarRemove = async () => {
    setUploading(true);
    try {
      await fetch("/api/profile/avatar", { method: "DELETE" });
      setAvatar(profile.image);
    } catch { /* keep current */ } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => setSkills(skills.filter((s) => s !== skill));

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname, bio, birthDate: birthDate || null,
          skills: JSON.stringify(skills),
          socialLinks: JSON.stringify(socialLinks),
          themePreference, profilePublic,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t(locale, "profile")}</h1>
        <button onClick={handleSave} disabled={saving}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-50">
          {saving ? "..." : saved ? t(locale, "saved") : t(locale, "save")}
        </button>
      </div>

      {/* Avatar + Basic Info */}
      <section className="rounded-2xl border border-border/60 bg-bg-secondary/20 p-6">
        <h2 className="mb-4 text-lg font-semibold">{t(locale, "personalInfo")}</h2>
        <div className="flex items-start gap-6">
          <div className="relative">
            {avatar ? (
              <Image src={avatar} alt="" width={96} height={96} className="h-24 w-24 rounded-full object-cover border border-border" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/20 text-3xl font-bold text-accent">
                {(nickname || profile.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            <div className="mt-2 flex gap-1">
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="text-xs text-accent hover:underline">
                {uploading ? "..." : t(locale, "uploadAvatar")}
              </button>
              {avatar && avatar !== profile.image && (
                <button onClick={handleAvatarRemove} className="text-xs text-text-muted hover:underline">
                  {t(locale, "removeAvatar")}
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className="mb-1 block text-sm text-text-muted">{t(locale, "nickname")}</label>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-text-muted">{t(locale, "birthDate")}</label>
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-sm text-text-muted">{t(locale, "bio")}</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder={t(locale, "bioPlaceholder")} rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none resize-none" />
        </div>
      </section>

      {/* Social Links */}
      <section className="rounded-2xl border border-border/60 bg-bg-secondary/20 p-6">
        <h2 className="mb-4 text-lg font-semibold">{t(locale, "socialLinks")}</h2>
        <div className="space-y-3">
          {(["github", "twitter", "website"] as const).map((key) => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-20 text-sm text-text-muted capitalize">{key}</span>
              <input type="url" value={socialLinks[key] || ""} onChange={(e) => setSocialLinks({ ...socialLinks, [key]: e.target.value })}
                placeholder={`https://${key === "github" ? "github.com/you" : key === "twitter" ? "x.com/you" : "yoursite.com"}`}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none" />
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="rounded-2xl border border-border/60 bg-bg-secondary/20 p-6">
        <h2 className="mb-4 text-lg font-semibold">{t(locale, "skills")}</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((skill) => (
            <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {skill}
              <button onClick={() => removeSkill(skill)} className="ml-0.5 text-accent/60 hover:text-accent">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
            placeholder={t(locale, "skillPlaceholder")}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none" />
          <button onClick={addSkill}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:border-accent hover:text-accent">
            {t(locale, "addSkill")}
          </button>
        </div>
      </section>

      {/* Appearance + Privacy */}
      <section className="rounded-2xl border border-border/60 bg-bg-secondary/20 p-6">
        <h2 className="mb-4 text-lg font-semibold">{t(locale, "appearance")}</h2>
        <div className="flex gap-4 mb-6">
          {(["dark", "light", "system"] as const).map((mode) => (
            <label key={mode} className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm cursor-pointer transition-colors ${
              themePreference === mode ? "border-accent bg-accent/10 text-accent" : "border-border text-text-secondary hover:border-border-light"
            }`}>
              <input type="radio" name="theme" value={mode} checked={themePreference === mode} onChange={() => setThemePreference(mode)} className="sr-only" />
              {mode === "dark" ? t(locale, "darkMode") : mode === "light" ? t(locale, "lightMode") : t(locale, "systemMode")}
            </label>
          ))}
        </div>
        <h2 className="mb-4 text-lg font-semibold">{t(locale, "privacy")}</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <div className={`relative h-6 w-11 rounded-full transition-colors ${profilePublic ? "bg-accent" : "bg-border"}`}
            onClick={() => setProfilePublic(!profilePublic)}>
            <div className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${profilePublic ? "translate-x-5" : ""}`} />
          </div>
          <span className="text-sm text-text-secondary">
            {profilePublic ? t(locale, "publicProfile") : t(locale, "privateProfile")}
          </span>
        </label>
      </section>
    </div>
  );
}
