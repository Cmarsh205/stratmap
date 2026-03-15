import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import {
  Users,
  User,
  Mail,
  Loader2,
  Trash2,
  Shield,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost";

interface TeamMember {
  user_id: number;
  username: string | null;
  email: string | null;
  role: string;
  joined_at: string;
}

interface TeamDetails {
  id: string;
  name: string;
  owner_id: number;
  created_at: string;
  currentUserRole: string;
  currentUserId: number;
  members: TeamMember[];
}

const TeamDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [loadState, setLoadState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [loadError, setLoadError] = useState<string | null>(null);

  const [inviteValue, setInviteValue] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  const [roleUpdating, setRoleUpdating] = useState<Record<number, boolean>>({});
  const [roleError, setRoleError] = useState<Record<number, string | null>>({});

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    if (!isAuthenticated) {
      setTeam(null);
      setLoadState("success");
      return;
    }

    let cancelled = false;

    const loadTeam = async () => {
      setLoadState("loading");
      setLoadError(null);

      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(`${API_URL}/api/v1/teams/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          let msg = "Failed to load team.";
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

        const data: TeamDetails = json.data;
        setTeam(data);
        setLoadState("success");
      } catch (err) {
        if (cancelled) return;
        console.error("Error loading team:", err);
        const message =
          err instanceof Error ? err.message : "Failed to load team.";
        setLoadError(message);
        setLoadState("error");
      }
    };

    loadTeam();

    return () => {
      cancelled = true;
    };
  }, [id, isAuthenticated, getAccessTokenSilently]);

  const refreshTeam = async () => {
    if (!id) return;
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_URL}/api/v1/teams/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const json = await res.json();
      const data: TeamDetails = json.data;
      setTeam(data);
    } catch {
      // ignore refresh errors
    }
  };

  const handleInvite = async () => {
    if (!id) return;
    const value = inviteValue.trim();
    if (!value) {
      setInviteError("Enter a username or email.");
      return;
    }

    setInviteLoading(true);
    setInviteError(null);
    setInviteSuccess(null);

    const payload: { email?: string; username?: string } = {};
    if (value.includes("@")) {
      payload.email = value;
    } else {
      payload.username = value;
    }

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_URL}/api/v1/teams/${id}/invite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = "Failed to invite user.";
        try {
          const body = await res.json();
          if (body?.message) msg = body.message;
          if (body?.error) msg = body.error;
        } catch {
          msg = res.statusText || msg;
        }
        throw new Error(msg);
      }

      setInviteSuccess("User invited to team.");
      setInviteValue("");
      await refreshTeam();
    } catch (err) {
      console.error("Error inviting user:", err);
      setInviteError(
        err instanceof Error ? err.message : "Failed to invite user.",
      );
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRoleChange = async (memberId: number, newRole: string) => {
    if (!id) return;
    if (!team) return;

    setRoleUpdating((prev) => ({ ...prev, [memberId]: true }));
    setRoleError((prev) => ({ ...prev, [memberId]: null }));

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(
        `${API_URL}/api/v1/teams/${id}/members/${memberId}/role`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        },
      );

      if (!res.ok) {
        let msg = "Failed to update role.";
        try {
          const body = await res.json();
          if (body?.message) msg = body.message;
          if (body?.error) msg = body.error;
        } catch {
          msg = res.statusText || msg;
        }
        throw new Error(msg);
      }

      await refreshTeam();
    } catch (err) {
      console.error("Error updating role:", err);
      setRoleError((prev) => ({
        ...prev,
        [memberId]:
          err instanceof Error ? err.message : "Failed to update role.",
      }));
    } finally {
      setRoleUpdating((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Remove this member from the team? They will lose access to this team's strats.",
    );
    if (!confirmed) return;

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(
        `${API_URL}/api/v1/teams/${id}/members/${memberId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        let msg = "Failed to remove member.";
        try {
          const body = await res.json();
          if (body?.message) msg = body.message;
          if (body?.error) msg = body.error;
        } catch {
          msg = res.statusText || msg;
        }
        throw new Error(msg);
      }

      await refreshTeam();
    } catch (err) {
      console.error("Error removing member:", err);
      // Surface error in a generic way
      alert(
        err instanceof Error ? err.message : "Failed to remove member from team.",
      );
    }
  };

  const handleDeleteTeam = async () => {
    if (!id) return;

    const confirmed = window.confirm(
      "Delete this team? This cannot be undone.",
    );
    if (!confirmed) return;

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_URL}/api/v1/teams/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let msg = "Failed to delete team.";
        try {
          const body = await res.json();
          if (body?.message) msg = body.message;
          if (body?.error) msg = body.error;
        } catch {
          msg = res.statusText || msg;
        }
        throw new Error(msg);
      }

      navigate("/teams");
    } catch (err) {
      console.error("Error deleting team:", err);
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete team.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatJoinedAt = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const canManage = team?.currentUserRole === "owner";

  return (
    <div className="!min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 !p-8">
      <div className="!mx-auto !max-w-5xl">
        <button
          onClick={() => navigate("/teams")}
          className="!mb-4 !text-sm !text-slate-400 hover:!text-slate-200 !transition-colors"
        >
          ← Back to teams
        </button>

        {!isAuthenticated ? (
          <p className="!text-gray-400 text-lg">
            Log in to view and manage team details.
          </p>
        ) : loadState === "loading" ? (
          <div className="!flex !items-center !justify-center !gap-2 !py-16 !text-slate-400">
            <Loader2 className="!w-6 !h-6 animate-spin" />
            <span>Loading team…</span>
          </div>
        ) : loadState === "error" ? (
          <p className="!text-red-400 text-lg">
            {loadError ?? "Failed to load team."}
          </p>
        ) : !team ? (
          <p className="!text-gray-400 text-lg">Team not found.</p>
        ) : (
          <>
            <div className="!flex !items-center !justify-between !mb-6">
              <div className="!flex !items-center !gap-3">
                <div className="!w-11 !h-11 !rounded-2xl !bg-yellow-500/20 !flex !items-center !justify-center">
                  <Users className="!w-6 !h-6 !text-yellow-400" />
                </div>
                <div>
                  <h1 className="!text-3xl !font-bold !text-white">
                    {team.name}
                  </h1>
                  <p className="!text-sm !text-slate-400">
                    {team.members.length} member
                    {team.members.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              {canManage && (
                <div className="!flex !flex-col !items-end !gap-2">
                  {deleteError && (
                    <p className="!text-xs !text-red-400 !max-w-xs !text-right">
                      {deleteError}
                    </p>
                  )}
                  <Button
                    onClick={handleDeleteTeam}
                    disabled={deleteLoading}
                    className="hover:cursor-pointer !h-10 !bg-red-500/20 hover:!bg-red-500 !text-red-400 hover:!text-white !rounded-xl !flex !items-center !gap-2 !px-4 !text-sm !font-semibold !border !border-red-500/40 hover:!border-red-500 !transition-all !duration-200"
                  >
                    {deleteLoading ? (
                      <Loader2 className="!w-4 !h-4 animate-spin" />
                    ) : (
                      <Trash2 className="!w-4 !h-4" />
                    )}
                    <span>{deleteLoading ? "Deleting…" : "Delete team"}</span>
                  </Button>
                </div>
              )}
            </div>

            <div className="!grid !grid-cols-1 lg:!grid-cols-3 !gap-6">
              <div className="lg:!col-span-2 !space-y-4">
                {team.members.map((member) => {
                  const isOwner = member.role === "owner";
                  const isSelf = member.user_id === team.currentUserId;
                  return (
                    <div
                      key={member.user_id}
                      className="!bg-slate-800/60 !border !border-slate-700/60 !rounded-2xl !p-4 !flex !items-center !justify-between !gap-4"
                    >
                      <div className="!flex !items-center !gap-3">
                        <div className="!w-10 !h-10 !rounded-full !bg-slate-700 !flex !items-center !justify-center">
                          <User className="!w-5 !h-5 !text-slate-200" />
                        </div>
                        <div>
                          <div className="!flex !items-center !gap-2">
                            <span className="!text-sm !font-semibold !text-white">
                              {member.username || member.email || "Member"}
                            </span>
                            {isOwner && (
                              <span className="!inline-flex !items-center !gap-1 !px-2 !py-0.5 !rounded-full !bg-amber-500/20 !text-amber-300 !text-xs !font-medium">
                                <Shield className="!w-3 !h-3" />
                                Owner
                              </span>
                            )}
                          </div>
                          {member.email && (
                            <p className="!text-xs !text-slate-400">
                              {member.email}
                            </p>
                          )}
                          <p className="!text-xs !text-slate-500 !mt-1">
                            Joined {formatJoinedAt(member.joined_at)}
                          </p>
                        </div>
                      </div>

                      <div className="!flex !flex-col !items-end !gap-2">
                        {canManage && !isSelf && (
                          <>
                            <select
                              value={member.role}
                              disabled={roleUpdating[member.user_id]}
                              onChange={(e) =>
                                handleRoleChange(
                                  member.user_id,
                                  e.target.value,
                                )
                              }
                              className="!bg-slate-900/70 !border !border-slate-700/80 !rounded-lg !px-3 !py-1.5 !text-xs !text-slate-100 focus:!outline-none focus:!ring-2 focus:!ring-yellow-500/80 focus:!border-yellow-500/80 !transition-all !duration-200"
                            >
                              <option value="member">Member</option>
                              <option value="moderator">Moderator</option>
                              <option value="owner" disabled>
                                Owner
                              </option>
                            </select>
                            <button
                              onClick={() => handleRemoveMember(member.user_id)}
                              className="!text-xs !text-red-400 hover:!text-red-300 !transition-colors"
                            >
                              Remove from team
                            </button>
                            {roleError[member.user_id] && (
                              <p className="!text-xs !text-red-400 !max-w-[200px] !text-right">
                                {roleError[member.user_id]}
                              </p>
                            )}
                          </>
                        )}
                        {!canManage && (
                          <p className="!text-xs !text-slate-500">
                            Role: {member.role}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="!space-y-4">
                {canManage && (
                  <div className="!bg-slate-800/60 !border !border-slate-700/60 !rounded-2xl !p-4">
                    <h2 className="!text-sm !font-semibold !text-white !mb-2">
                      Invite to team
                    </h2>
                    <p className="!text-xs !text-slate-400 !mb-3">
                      Invite players by username or email. They must have logged
                      in at least once so we can find their account.
                    </p>
                    <div className="!flex !gap-2">
                      <div className="!relative !flex-1">
                        <span className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-slate-500">
                          {inviteValue.includes("@") ? (
                            <Mail className="!w-4 !h-4" />
                          ) : (
                            <User className="!w-4 !h-4" />
                          )}
                        </span>
                        <input
                          type="text"
                          value={inviteValue}
                          onChange={(e) => {
                            setInviteValue(e.target.value);
                            setInviteError(null);
                            setInviteSuccess(null);
                          }}
                          placeholder="username or email"
                          className="!w-full !bg-slate-900/60 !border !border-slate-700/70 !rounded-xl !py-2.5 !pl-9 !pr-3 !text-sm !text-white !placeholder-slate-500 focus:!outline-none focus:!ring-2 focus:!ring-yellow-500/80 focus:!border-yellow-500/80 !transition-all !duration-200"
                        />
                      </div>
                      <Button
                        onClick={handleInvite}
                        disabled={inviteLoading}
                        className="hover:cursor-pointer !h-10 !px-4 !bg-slate-700 hover:!bg-yellow-500 !text-slate-100 hover:!text-slate-900 !rounded-xl !flex !items-center !justify-center !gap-1.5 !text-sm !font-medium !transition-all !duration-200"
                      >
                        {inviteLoading ? (
                          <Loader2 className="!w-4 !h-4 animate-spin" />
                        ) : (
                          <Users className="!w-4 !h-4" />
                        )}
                        <span>
                          {inviteLoading ? "Sending…" : "Invite"}
                        </span>
                      </Button>
                    </div>
                    {inviteError && (
                      <p className="!mt-2 !text-xs !text-red-400">
                        {inviteError}
                      </p>
                    )}
                    {inviteSuccess && (
                      <p className="!mt-2 !text-xs !text-emerald-400">
                        {inviteSuccess}
                      </p>
                    )}
                  </div>
                )}

                <div className="!bg-slate-800/40 !border !border-slate-700/60 !rounded-2xl !p-4 !text-xs !text-slate-400">
                  <h3 className="!text-sm !font-semibold !text-slate-100 !mb-2">
                    Team roles
                  </h3>
                  <ul className="!space-y-1.5">
                    <li>
                      <span className="!font-semibold !text-slate-200">
                        Owner:
                      </span>{" "}
                      Full control over the team, can invite members, change
                      roles, and delete the team.
                    </li>
                    <li>
                      <span className="!font-semibold !text-slate-200">
                        Moderator:
                      </span>{" "}
                      Can help manage members (depending on how you use this
                      role) but cannot delete the team.
                    </li>
                    <li>
                      <span className="!font-semibold !text-slate-200">
                        Member:
                      </span>{" "}
                      Standard team member with access to the team&apos;s
                      strats.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamDetailsPage;

