import { getDateStatus } from "../helpers/dateHelper";
import type { Review } from "../types/types";

type DynamicBoxProps = {
    review: Review
};

export default function DynamicBox({ review }: Readonly<DynamicBoxProps>) {
    if (getDateStatus(review.scheduled_at) === "today") {
        return (
            <>
                <style>
                    {`
                    @keyframes glassSweep {
                        0%, 65% {
                            transform: translateX(-150%) skewX(-18deg);
                            opacity: 0;
                        }
                        72% {
                            opacity: 0.08;
                        }
                        85% {
                            opacity: 0.12;
                        }
                        100% {
                            transform: translateX(350%) skewX(-18deg);
                            opacity: 0;
                        }
                    }
                `}
                </style>

                <div className="relative h-fit isolate w-full rounded-2xl border border-[#B8954B]/40 bg-gradient-to-br from-[#29251B] via-[#1C1D20] to-[#171B24] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-colors duration-300 hover:border-[#D6B66A]/60 sm:p-6">

                    {/* Glass shimmer */}
                    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl">
                        <div
                            className="absolute -inset-y-10 left-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent blur-md"
                            style={{
                                animation: "glassSweep 3s ease-in-out infinite",
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">

                        {/* Header */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B66A]/30 bg-[#D6B66A]/10 px-3 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#D6B66A]" />

                                <span className="text-xs font-semibold uppercase tracking-wider text-[#E5C77E]">
                                    Today's focus
                                </span>
                            </div>

                            {/* Three-dot menu */}
                            <div className="group/menu relative shrink-0">
                                <button
                                    type="button"
                                    aria-label="Review actions"
                                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B66A]"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle cx="12" cy="5" r="1.7" />
                                        <circle cx="12" cy="12" r="1.7" />
                                        <circle cx="12" cy="19" r="1.7" />
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                <div className="absolute right-0 top-full z-50 hidden w-48 pt-2 group-hover/menu:block group-focus-within/menu:block">
                                    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1F2937] p-1.5 shadow-xl shadow-black/40">

                                        <button
                                            type="button"
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                                        >
                                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 2.651 2.651M4 20l4.5-1 11-11a2.121 2.121 0 0 0-3-3l-11 11L4 20Z" />
                                            </svg>
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                                        >
                                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <rect x="3" y="5" width="18" height="16" rx="2" />
                                                <path strokeLinecap="round" d="M16 3v4M8 3v4M3 10h18" />
                                            </svg>
                                            Reschedule
                                        </button>

                                        <button
                                            type="button"
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-emerald-400 transition hover:bg-emerald-400/10 hover:text-emerald-300"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
                                            </svg>
                                            Mark as reviewed
                                        </button>

                                        <div className="my-1 border-t border-white/10" />

                                        <button
                                            type="button"
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-400/10 hover:text-red-300"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 11v5m4-5v5" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Topic */}
                        <div className="mt-6">
                            <h3 className="break-words text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl">
                                {review.name}
                            </h3>

                            <p className="mt-2 text-sm text-gray-400">
                                Scheduled for today
                            </p>
                        </div>

                        {/* Primary action */}
                        <div className="mt-6 border-t border-white/[0.08] pt-5">
                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5C77E]/60 bg-[#D6B66A] px-5 py-3 text-sm font-semibold text-[#211C11] shadow-[0_2px_12px_rgba(214,182,106,0.12)] transition-all duration-200 hover:border-[#F5DFA5] hover:bg-[#E5C77E] hover:shadow-[0_2px_16px_rgba(214,182,106,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5DFA5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1D20] active:scale-[0.99]"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m5 12 4 4L19 6"
                                    />
                                </svg>

                                Mark as reviewed
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    if (getDateStatus(review.scheduled_at) === "future") {
        return (
            <div className="group relative w-full min-w-0 overflow-visible rounded-2xl border border-[#B8954B]/25 bg-gradient-to-br from-[#252016] via-[#171717] to-[#111827] p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B8954B]/50 hover:shadow-lg sm:p-5">

                {/* Subtle gold glow */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#B8954B]/10 blur-3xl" />

                {/* Header */}
                <div className="relative flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#B8954B]/25 bg-[#B8954B]/10 px-3 py-1.5 text-xs font-medium text-[#E5C078]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#E5C078]" />
                        Upcoming
                    </span>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                            Scheduled
                        </span>

                        {/* Three-dot menu */}
                        <div className="group/menu relative">
                            <button
                                type="button"
                                aria-label="Review actions"
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#B8954B]/50"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="5" r="1.7" />
                                    <circle cx="12" cy="12" r="1.7" />
                                    <circle cx="12" cy="19" r="1.7" />
                                </svg>
                            </button>

                            {/* Dropdown menu */}
                            <div className="absolute right-0 top-full z-30 hidden w-48 pt-2 group-hover/menu:block group-focus-within/menu:block">
                                <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1F2937] p-1.5 shadow-xl shadow-black/40">

                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                                    >
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 2.651 2.651M4 20l4.5-1 11-11a2.121 2.121 0 0 0-3-3l-11 11L4 20Z" />
                                        </svg>
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                                    >
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9 16 2 2 4-4" />
                                        </svg>
                                        Reschedule
                                    </button>

                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-emerald-400 transition hover:bg-emerald-400/10 hover:text-emerald-300"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
                                        </svg>
                                        Mark as reviewed
                                    </button>

                                    <div className="my-1 border-t border-white/10" />

                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-400/10 hover:text-red-300"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 11v5m4-5v5" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review details */}
                <div className="relative mt-4 min-w-0">
                    <h3 className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
                        {review.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                        Added {new Date(review.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>
                </div>

                {/* Scheduled date */}
                <div className="relative mt-4 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.04] px-3 py-3">
                    <div className="rounded-lg bg-[#B8954B]/10 p-2">
                        <svg
                            className="h-5 w-5 text-[#E5C078]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.7}
                        >
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <path strokeLinecap="round" d="M16 3v4M8 3v4M3 10h18" />
                        </svg>
                    </div>

                    <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                            Review date
                        </p>
                        <p className="truncate text-sm font-semibold text-gray-200">
                            {new Date(`${review.scheduled_at}T00:00:00`).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    if (getDateStatus(review.scheduled_at) === "past") {
        return (
            <div className="group relative w-full min-w-0 rounded-xl border border-white/[0.08] bg-[#1F2937] p-4 transition-colors duration-200 hover:border-[#B8954B]/30 sm:p-5">

                {/* Header */}
                <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8954B]" />

                            <span className="text-[11px] font-medium uppercase tracking-wider text-[#B8954B]">
                                Overdue
                            </span>
                        </div>

                        <h3 className="mt-2 break-words text-base font-semibold text-[#F9FAFB]">
                            {review.name}
                        </h3>
                    </div>

                    {/* Three-dot menu */}
                    <div className="group/menu relative shrink-0">
                        <button
                            type="button"
                            aria-label="Review actions"
                            className="rounded-lg p-2 text-[#9CA3AF] transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B66A]"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <circle cx="12" cy="5" r="1.7" />
                                <circle cx="12" cy="12" r="1.7" />
                                <circle cx="12" cy="19" r="1.7" />
                            </svg>
                        </button>

                        {/* Dropdown */}
                        <div className="absolute right-0 top-full z-30 hidden w-48 pt-2 group-hover/menu:block group-focus-within/menu:block">
                            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1F2937] p-1.5 shadow-xl shadow-black/40">

                                <button
                                    type="button"
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                                >
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 2.651 2.651M4 20l4.5-1 11-11a2.121 2.121 0 0 0-3-3l-11 11L4 20Z" />
                                    </svg>
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                                >
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <rect x="3" y="5" width="18" height="16" rx="2" />
                                        <path strokeLinecap="round" d="M16 3v4M8 3v4M3 10h18" />
                                    </svg>
                                    Reschedule
                                </button>

                                <button
                                    type="button"
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-emerald-400 transition hover:bg-emerald-400/10 hover:text-emerald-300"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
                                    </svg>
                                    Mark as reviewed
                                </button>

                                <div className="my-1 border-t border-white/10" />

                                <button
                                    type="button"
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-400/10 hover:text-red-300"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 11v5m4-5v5" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overdue information */}
                <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-3">
                    <svg
                        className="h-4 w-4 shrink-0 text-[#B8954B]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.7}
                    >
                        <circle cx="12" cy="12" r="9" />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 7v5l3 2"
                        />
                    </svg>

                    <span className="text-sm text-[#9CA3AF]">
                        2 days overdue
                    </span>
                </div>
            </div>
        );
    }
}