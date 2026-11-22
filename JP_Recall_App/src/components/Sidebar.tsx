import { Brain } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";
import { supabase } from "../lib/supbase";

type SidebarProfile = {
    avatarUrl: string;
    displayName: string;
    email: string;
};

const base =
    "flex w-full cursor-pointer items-center gap-3 rounded-md border-l-2 px-3 py-2 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8954B]";
const active = `${base} border-[#B8954B] bg-transparent font-medium text-[#D6B66A]`;
const idle = `${base} border-transparent text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F9FAFB]`;
const icon = "h-[18px] w-[18px] shrink-0";
const label = "px-3 pb-2 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]";

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const [profile, setProfile] = useState<SidebarProfile>({
        avatarUrl: "",
        displayName: "",
        email: "",
    });

    useEffect(() => {
        let isMounted = true;

        const loadProfile = async () => {
            const { data, error } = await supabase.auth.getUser();

            if (!isMounted) return;

            if (error) {
                console.error("Failed to load sidebar profile:", error);
                return;
            }

            const user = data.user;
            if (!user) return;

            const metadata = user.user_metadata ?? {};
            const identityMetadata = user.identities?.find(
                (identity) => identity.identity_data
            )?.identity_data ?? {};
            const firstString = (...values: unknown[]) =>
                values.find((value): value is string =>
                    typeof value === "string" && value.trim().length > 0
                ) ?? "";

            setProfile({
                avatarUrl: firstString(
                    metadata.avatar_url,
                    metadata.picture,
                    identityMetadata.avatar_url,
                    identityMetadata.picture
                ),
                displayName: firstString(
                    metadata.full_name,
                    metadata.name,
                    identityMetadata.full_name,
                    identityMetadata.name
                ),
                email: user.email ?? "",
            });
        };

        void loadProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            {/* Mobile top bar */}
            <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[#374151] bg-[#151D2B] px-4 md:hidden">
                <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[#B8954B] text-sm font-semibold tracking-tight text-[#D6B66A]">
                        R
                    </span>
                    <span className="text-base font-semibold tracking-tight text-[#F9FAFB]">
                        JPRecall
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Open navigation"
                    className="rounded-md p-2 text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F9FAFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8954B]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </header>

            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 md:hidden"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                aria-label="Primary"
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#374151] bg-[#151D2B] transition-transform duration-200 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Brand */}
                <div className="flex h-14 items-center justify-between px-5 md:h-16">
                    <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[#B8954B] text-sm font-semibold tracking-tight text-[#D6B66A]">
                            R
                        </span>
                        <span className="text-base font-semibold tracking-tight text-[#F9FAFB]">
                            JPRecall
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Close navigation"
                        className="rounded-md p-2 text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F9FAFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8954B] md:hidden"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-4">
                    <p className={label}>Study</p>
                    <ul className="space-y-1">
                        <li>
                            <NavLink
                                to="/review"
                                end
                                onClick={() => setOpen(false)}
                                className={({ isActive }) => isActive ? active : idle}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={icon}>
                                    <rect x="3" y="5" width="18" height="16" rx="2" />
                                    <path d="M16 3v4M8 3v4M3 11h18" />
                                </svg>
                                <span>Review Schedule</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/long-term-memory"
                                end
                                onClick={() => setOpen(false)}
                                className={({ isActive }) => isActive ? active : idle}
                            >
                                <Brain
                                    className={icon}
                                    strokeWidth={1.75}
                                    aria-hidden="true"
                                />
                                <span>Long term memory</span>
                            </NavLink>
                        </li>
                    </ul>

                    <p className={`${label} pt-6`}>Progress</p>
                    <ul className="space-y-1">
                        <li>
                            <NavLink
                                to="/review-history"
                                end
                                onClick={() => setOpen(false)}
                                className={({ isActive }) => isActive ? active : idle}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={icon}>
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M12 7v5l3 2" />
                                </svg>
                                <span>Review History</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/statistics"
                                end
                                onClick={() => setOpen(false)}
                                className={({ isActive }) => isActive ? active : idle}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={icon}>
                                    <path d="M5 20v-9M12 20V5M19 20v-6" />
                                </svg>
                                <span>Statistics</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                {/* Bottom */}
                <div className="border-t border-[#374151] px-3 py-3">
                    <NavLink
                        to="/profile"
                        end
                        onClick={() => setOpen(false)}
                        className={({ isActive }) => isActive ? active : idle}
                    >
                        <ProfileAvatar
                            {...profile}
                            sizeClass="h-7 w-7"
                            decorative
                        />
                        <span
                            className="min-w-0 truncate"
                            title={profile.displayName || profile.email || "Profile"}
                        >
                            {profile.displayName || profile.email || "Profile"}
                        </span>
                    </NavLink>
                </div>
            </aside>
        </>
    );
}