import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Users, Plus, Loader2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost";

interface Team {
  id: string;
  name: string;
  owner_id: number;
  created_at: string;
  role: string;
  member_count: number;
}

const TeamsPage = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [teams, setTeams] = useState<Team[]>([]);
  const [loadState, setLoadState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [loadError, setLoadError] = useState<string | null>(null);

  const [newTeamName, setNewTeamName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setTeams([]);
      setLoadState("success");
      return;
    }

    let cancelled = false;

    const loadTeams = async () => {
      setLoadState("loading");
      setLoadError(null);

      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(`${API_URL}/api/v1/teams`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          let msg = "Failed to load teams.";
          try {
            const body = await res.json();
            if (body?.message) msg = body.message;
            if (body?.error) msg = body.error;
          } catch {
            msg = res.statusText || msg;
          }
          throw new Error(msg);
        }

        const json = await res.json();
        if (cancelled) return;

        const data: Team[] = json.data ?? [];
        setTeams(data);
        setLoadState("success");
      } catch (err) {
        if (cancelled) return;
        console.error("Error loading teams:", err);
        const message =
          err instanceof Error ? err.message : "Failed to load teams.";
        setLoadError(message);
        setLoadState("error");
      }
    };

    loadTeams();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      setCreateError("Team name is required.");
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_URL}/api/v1/teams`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newTeamName.trim() }),
      });

      if (!res.ok) {
        let msg = "Failed to create team.";
        try {
          const body = await res.json();
          if (body?.message) msg = body.message;
          if (body?.error) msg = body.error;
        } catch {
          msg = res.statusText || msg;
        }
        throw new Error(msg);
      }

      const json = await res.json();
      const created: Team = json.data;
      setTeams((prev) => [created, ...prev]);
      setNewTeamName("");
    } catch (err) {
      console.error("Error creating team:", err);
      setCreateError(
        err instanceof Error ? err.message : "Failed to create team.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenTeam = (teamId: string) => {
    navigate(`/teams/${teamId}`);
  };

  return (
    <div className="!min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 !p-8">
      <div className="!mx-auto">
        <div className="!flex !items-center !gap-3 !mb-2">
          <Users className="!w-8 !h-8 !text-yellow-400" />
          <h1 className="!text-4xl !font-bold !text-yellow-400">Teams</h1>
        </div>
        <h2 className="!text-lg !text-slate-300 !mb-6">
          Create teams, invite players, and manage the squads you are part of.
        </h2>

        {!isAuthenticated ? (
          <p className="!text-gray-400 text-lg">
            Log in to create and manage your teams.
          </p>
        ) : (
          <>
            <div className="!bg-slate-800/60 !border !border-slate-700/60 !rounded-2xl !p-6 !mb-8 !flex !flex-col md:!flex-row !items-stretch md:!items-end !gap-4">
              <div className="!flex-1">
                <label className="!block !text-sm !font-medium !text-slate-300 !mb-2">
                  Team name
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Enter a team name…"
                  className="!w-full !bg-slate-900/60 !border !border-slate-700/70 !rounded-xl !py-3 !px-4 !text-white !placeholder-slate-500 focus:!outline-none focus:!ring-2 focus:!ring-yellow-500/80 focus:!border-yellow-500/80 !transition-all !duration-200"
                />
                {createError && (
                  <p className="!mt-2 !text-sm !text-red-400">{createError}</p>
                )}
              </div>
              <div className="md:!w-auto !flex !items-end">
                <Button
                  onClick={handleCreateTeam}
                  disabled={isCreating}
                  className="hover:cursor-pointer !h-12 !bg-gradient-to-r !from-yellow-500 !to-yellow-600 hover:!from-yellow-400 hover:!to-yellow-500 !text-slate-900 !font-semibold !py-3 !px-6 !rounded-xl !flex !items-center !gap-2 !shadow-lg hover:!shadow-amber-500/25 !transition-all !duration-200"
                >
                  {isCreating ? (
                    <Loader2 className="!w-4 !h-4 animate-spin" />
                  ) : (
                    <Plus className="!w-4 !h-4" />
                  )}
                  <span>{isCreating ? "Creating…" : "Create team"}</span>
                </Button>
              </div>
            </div>

            {loadState === "loading" ? (
              <div className="!flex !items-center !justify-center !gap-2 !py-16 !text-slate-400">
                <Loader2 className="!w-6 !h-6 animate-spin" />
                <span>Loading teams…</span>
              </div>
            ) : loadState === "error" ? (
              <p className="!text-red-400 text-lg">
                {loadError ?? "Failed to load teams."}
              </p>
            ) : teams.length === 0 ? (
              <p className="!text-gray-400 text-lg">
                You are not part of any shared teams yet. Create one above to
                get started.
              </p>
            ) : (
              <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 !gap-6">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="group !bg-slate-800/60 !backdrop-blur-sm !rounded-2xl !border !border-slate-700/60 hover:!border-slate-600/60 !transition-all !duration-300 hover:!shadow-2xl hover:!shadow-slate-900/50 hover:!scale-[1.02] !flex !flex-col"
                  >
                    <div className="!p-5 !flex-1 !flex !flex-col !gap-3">
                      <div className="!flex !items-center !gap-3">
                        <div className="!w-10 !h-10 !rounded-xl !bg-yellow-500/20 !flex !items-center !justify-center">
                          <Users className="!w-5 !h-5 !text-yellow-400" />
                        </div>
                        <div className="!flex-1 !min-w-0">
                          <h3
                            className="!text-lg !font-semibold !text-white !truncate group-hover:!text-yellow-400 !transition-colors !duration-200"
                            title={team.name}
                          >
                            {team.name}
                          </h3>
                          <p className="!text-xs !text-slate-400 !mt-0.5">
                            Role:{" "}
                            <span className="!font-medium !text-slate-200">
                              {team.role}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="!flex !items-center !justify-between !mt-1">
                        <div className="!flex !items-center !gap-2 !text-slate-300 !text-sm">
                          <User className="!w-4 !h-4 !text-slate-400" />
                          <span>{team.member_count} members</span>
                        </div>
                      </div>

                      <div className="!mt-4 !pt-3 !border-t !border-slate-700/60 !flex !justify-center">
                        <Button
                          onClick={() => handleOpenTeam(team.id)}
                          className="hover:cursor-pointer !h-10 !px-4 !bg-slate-700 hover:!bg-yellow-500 !text-slate-100 hover:!text-slate-900 !rounded-xl !flex !items-center !justify-center !gap-1.5 !text-sm !font-medium !transition-all !duration-200"
                        >
                          <User className="!w-4 !h-4" />
                          <span>View team</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;
