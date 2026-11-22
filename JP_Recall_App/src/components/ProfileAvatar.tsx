import { useEffect, useState } from "react";

type ProfileAvatarProps = {
    avatarUrl: string;
    displayName: string;
    email: string;
    sizeClass: string;
    decorative?: boolean;
};

export default function ProfileAvatar({
    avatarUrl,
    displayName,
    email,
    sizeClass,
    decorative = false,
}: Readonly<ProfileAvatarProps>) {
    const [imageFailed, setImageFailed] = useState(false);
    const label = displayName || email || "User";

    useEffect(() => {
        setImageFailed(false);
    }, [avatarUrl]);

    if (avatarUrl && !imageFailed) {
        return (
            <img
                src={avatarUrl}
                alt={decorative ? "" : `${label} profile`}
                aria-hidden={decorative || undefined}
                onError={() => setImageFailed(true)}
                referrerPolicy="no-referrer"
                className={`${sizeClass} shrink-0 rounded-full border border-[#B8954B]/30 object-cover`}
            />
        );
    }

    return (
        <div
            role={decorative ? undefined : "img"}
            aria-label={decorative ? undefined : `${label} profile`}
            aria-hidden={decorative || undefined}
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
