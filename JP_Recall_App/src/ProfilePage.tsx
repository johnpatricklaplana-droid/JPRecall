import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supbase";
import { logout } from "./services/auth";

type ProfileAvatarProps = {
    avatarUrl: string;
    displayName: string;
    email: string;
    sizeClass: string;
};

function ProfileAvatar({
    avatarUrl,
    displayName,
    email,
    sizeClass,
}: Readonly<ProfileAvatarProps>) {
    const [imageFailed, setImageFailed] = useState(false);
    const label = displayName || email || "User";

    if (avatarUrl && !imageFailed) {
        return (
            <img
                src={avatarUrl}
                alt={`${label} profile`}
                onError={() => setImageFailed(true)}
                referrerPolicy="no-referrer"
                className={`${sizeClass} shrink-0 rounded-full border border-[#B8954B]/30 object-cover`}
            />
        );
    }

    return (
        <div
            role="img"
            aria-label={`${label} profile`}
            className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full border border-[#344256] bg-[#182330] text-[#94A3B8]`}
        >
            <svg
                className="h-1/2 w-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
            >
                <circle cx="12" cy="8" r="4" />
                <path strokeLinecap="round" d="M4 21a8 8 0 0 1 16 0" />
            </svg>
        </div>
    );
}

export default function ProfilePage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadProfile = async () => {
            const { data, error: sessionError } = await supabase.auth.getUser();

            if (!isMounted) return;

            if (sessionError) {
                console.error("Failed to load profile:", sessionError);
                setError("Unable to load your profile.");
            } else {
                const user = data.user;
                const metadata = user?.user_metadata ?? {};
                const identityMetadata = user?.identities?.find(
                    (identity) => identity.identity_data
                )?.identity_data ?? {};
                const firstString = (...values: unknown[]) =>
                    values.find((value): value is string =>
                        typeof value === "string" && value.trim().length > 0
                    ) ?? "";

                setEmail(user?.email ?? "");
                setAvatarUrl(firstString(
                    metadata.avatar_url,
                    metadata.picture,
                    identityMetadata.avatar_url,
                    identityMetadata.picture
                ));
                setDisplayName(firstString(
                    metadata.full_name,
                    metadata.name,
                    identityMetadata.full_name,
                    identityMetadata.name
                ));
            }

            setIsLoading(false);
        };

        void loadProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        setError("");

        try {
            await logout();
            navigate("/login", { replace: true });
        } catch (logoutError) {
            console.error("Failed to log out:", logoutError);
            setError("Unable to log out. Please try again.");
            setIsLoggingOut(false);
        }
    };

    const closeLogoutConfirmation = () => {
        if (isLoggingOut) return;
        setShowLogoutConfirmation(false);
        setError("");
    };

    return (
        <>
            <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">
                    <aside className="rounded-2xl border border-[#293648] bg-[#111923] p-6 shadow-sm sm:sticky sm:top-7 sm:p-7">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8291A5]">
                                    ACCOUNT
                                </p>
                                <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#F3F4F6]">
                                    Profile
                                </h1>
                            </div>
                            {isLoading ? (
                                <div className="h-10 w-10 shrink-0 rounded-full border border-[#344256] bg-[#182330]" />
                            ) : (
                                <ProfileAvatar
                                    avatarUrl={avatarUrl}
                                    displayName={displayName}
                                    email={email}
                                    sizeClass="h-10 w-10"
                                />
                            )}
                        </div>

                        <p className="mt-2 text-sm text-[#8291A5]">
                            Manage your JPRecall account.
                        </p>

                        <div className="mt-9 rounded-xl border border-[#344256] bg-[#182330] p-5">
                            <p className="text-sm font-medium text-[#94A3B8]">Signed in as</p>
                            {isLoading ? (
                                <p className="mt-3 text-sm text-[#8291A5]">Loading profile...</p>
                            ) : (
                                <>
                                    {displayName && (
                                        <p className="mt-3 text-base font-semibold text-[#E5E7EB]">
                                            {displayName}
                                        </p>
                                    )}
                                    <p className={`${displayName ? "mt-1" : "mt-3"} break-all text-sm text-[#8291A5]`}>
                                        {email || "Unavailable"}
                                    </p>
                                </>
                            )}
                        </div>
                    </aside>

                    <main className="min-w-0">
                        <div className="mb-7">
                            <h2 className="text-2xl font-bold tracking-tight text-[#F3F4F6]">
                                Account settings
                            </h2>
                            <p className="mt-1 text-sm text-[#8291A5]">
                                Review your account details and session.
                            </p>
                        </div>

                        <section className="rounded-xl border border-white/[0.07] bg-[#141D29]">
                            <div className="flex items-center gap-4 border-b border-[#293648] px-5 py-5 sm:px-6">
                                {isLoading ? (
                                    <div className="h-12 w-12 shrink-0 rounded-full border border-[#344256] bg-[#182330]" />
                                ) : (
                                    <ProfileAvatar
                                        avatarUrl={avatarUrl}
                                        displayName={displayName}
                                        email={email}
                                        sizeClass="h-12 w-12"
                                    />
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#E5E7EB]">
                                        Your profile
                                    </p>
                                    <p className="mt-1 truncate text-xs text-[#8291A5]">
                                        {email || "Email unavailable"}
                                    </p>
                                </div>
                            </div>

                            <div className="px-5 py-5 sm:px-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-[#E5E7EB]">
                                            Current session
                                        </p>
                                        <p className="mt-1 text-xs text-[#8291A5]">
                                            Log out securely from this device.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setError("");
                                            setShowLogoutConfirmation(true);
                                        }}
                                        disabled={isLoading}
                                        className="rounded-xl border border-red-400/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/20 hover:text-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Log out
                                    </button>
                                </div>

                                {error && (
                                    <div
                                        role="alert"
                                        className="mt-5 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-300"
                                    >
                                        {error}
                                    </div>
                                )}
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            {showLogoutConfirmation && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="logout-dialog-title"
                        aria-describedby="logout-dialog-description"
                        className="w-full max-w-md rounded-2xl border border-[#344256] bg-[#17212D] p-6 shadow-2xl shadow-black/50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10 text-red-400">
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.8}
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5M14 8l4 4-4 4m4-4H9" />
                                </svg>
                            </div>
                            <div>
                                <h2 id="logout-dialog-title" className="text-lg font-semibold text-white">
                                    Log out?
                                </h2>
                                <p className="mt-0.5 text-sm text-[#94A3B8]">
                                    End your current session.
                                </p>
                            </div>
                        </div>

                        <p id="logout-dialog-description" className="mt-5 text-sm leading-relaxed text-[#A7B4C7]">
                            Are you sure you want to log out of JPRecall?
                        </p>

                        {error && (
                            <div
                                role="alert"
                                className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-300"
                            >
                                {error}
                            </div>
                        )}

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={closeLogoutConfirmation}
                                disabled={isLoggingOut}
                                className="rounded-xl border border-[#344256] px-5 py-2.5 text-sm font-medium text-[#CBD5E1] transition-colors hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="rounded-xl border border-red-400/30 bg-red-500/15 px-5 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/25 hover:text-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isLoggingOut ? "Logging out..." : "Log out"}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </>
    );
}
