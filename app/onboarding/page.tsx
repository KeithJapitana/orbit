"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Building2, User, Rocket } from "lucide-react";

type Step = "profile" | "team" | "workspace";

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("profile");
  const [displayName, setDisplayName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("My First Workspace");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    {
      key: "team",
      label: "Team",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      key: "workspace",
      label: "Workspace",
      icon: <Rocket className="w-4 h-4" />,
    },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const handleProfileUpdate = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Also update the users table
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("users")
        .update({ display_name: displayName })
        .eq("id", user.id);
    }

    setLoading(false);
    setStep("team");
  };

  const handleTeamCreate = async () => {
    setLoading(true);
    setError(null);

    const slug = teamName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: teamName, slug }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to create team");
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep("workspace");
  };

  const handleWorkspaceCreate = async () => {
    setLoading(true);
    setError(null);

    // Get the team we just created
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: teams } = await supabase
      .from("team_members")
      .select("team_id, teams(*)")
      .eq("user_id", user.id)
      .limit(1);

    if (!teams || teams.length === 0) {
      setError("No team found. Please go back and create a team.");
      setLoading(false);
      return;
    }

    const teamId = teams[0].team_id;
    const teamSlug = (teams[0] as unknown as { teams: { slug: string } }).teams.slug;

    const res = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: workspaceName,
        team_id: teamId,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create workspace");
      setLoading(false);
      return;
    }

    router.push(`/${teamSlug}/workspaces`);
    router.refresh();
  };

  const handleSkipWorkspace = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: teams } = await supabase
      .from("team_members")
      .select("teams(slug)")
      .eq("user_id", user.id)
      .limit(1);

    const teamSlug =
      (teams?.[0] as unknown as { teams: { slug: string } })?.teams?.slug || "dashboard";
    router.push(`/${teamSlug}/workspaces`);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg rotate-45" />
            <div className="absolute inset-0.5 bg-background rounded-lg rotate-45" />
            <div className="absolute inset-1.5 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-sm rotate-45" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Orbit</span>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  i <= currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s.icon}
                {s.label}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 h-px ${
                    i < currentStepIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card>
          {step === "profile" && (
            <>
              <CardHeader>
                <CardTitle>Set up your profile</CardTitle>
                <CardDescription>
                  How should your teammates know you?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display name</Label>
                  <Input
                    id="displayName"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button
                  onClick={handleProfileUpdate}
                  className="w-full"
                  disabled={!displayName || loading}
                >
                  {loading ? "Saving..." : "Continue"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </>
          )}

          {step === "team" && (
            <>
              <CardHeader>
                <CardTitle>Create your team</CardTitle>
                <CardDescription>
                  A team is where you and your colleagues collaborate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team name</Label>
                  <Input
                    id="teamName"
                    placeholder="Acme Inc."
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button
                  onClick={handleTeamCreate}
                  className="w-full"
                  disabled={!teamName || loading}
                >
                  {loading ? "Creating team..." : "Create Team"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </>
          )}

          {step === "workspace" && (
            <>
              <CardHeader>
                <CardTitle>Create your first workspace</CardTitle>
                <CardDescription>
                  Workspaces organize boards and tasks for different projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workspaceName">Workspace name</Label>
                  <Input
                    id="workspaceName"
                    placeholder="My Project"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleSkipWorkspace}
                    className="flex-1"
                    disabled={loading}
                  >
                    Skip for now
                  </Button>
                  <Button
                    onClick={handleWorkspaceCreate}
                    className="flex-1"
                    disabled={!workspaceName || loading}
                  >
                    {loading ? "Creating..." : "Create & Go"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
