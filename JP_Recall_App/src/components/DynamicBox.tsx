
import { useRef, useState } from "react";
import { getDateStatus, type DateStatus } from "../helpers/dateHelper";
import type { Review } from "../types/types";

type DynamicBoxProps = {
    review: Review;
    onRequestDelete: (review: Review) => void;
    onMarkReviewed: (review: Review) => void;
    markingReviewId: string | null;
};

function formatScheduledDate(value: string) {
    const [year, month, day] = value.slice(0, 10).split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatCreatedDate(value: string) {
    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getDaysOverdue(value: string) {
    const [year, month, day] = value.slice(0, 10).split("-").map(Number);

    const now = new Date();
    const today = Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const dueDate = Date.UTC(year, month - 1, day);

    return Math.max(1, Math.floor((today - dueDate) / 86400000));
}

function CalendarIcon() {
    return (
        <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
        >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path strokeLinecap="round" d="M16 3v4M8 3v4M3 10h18" />
        </svg>
    );
}

type ActionMenuProps = {
    review: Review;
    onDelete: (review: Review) => void;
    onMarkReviewed: (review: Review) => void;
    isMarking: boolean;
};

function ActionMenu({
    review,
    onDelete,
    onMarkReviewed,
    isMarking,
}: ActionMenuProps) {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [opensUp, setOpensUp] = useState(false);

    const updateMenuPosition = () => {
        const trigger = triggerRef.current;

        if (!trigger) return;

        const rect = trigger.getBoundingClientRect();

        const spaceAbove = rect.top;
        const spaceBelow = window.innerHeight - rect.bottom;

        // Approximate height of the complete dropdown.
        const menuHeight = 200;
        const gap = 8;

        setOpensUp(
            spaceBelow < menuHeight + gap &&
            spaceAbove > spaceBelow
        );
    };

    return (
        <div className="group/menu relative z-20 shrink-0">
            <button
                ref={triggerRef}
                type="button"
                aria-label="Review actions"
                aria-haspopup="true"
                onMouseEnter={updateMenuPosition}
                onFocus={updateMenuPosition}
                className="rounded-lg p-2 text-[#8291A5] transition-colors hover:bg-white/[0.07] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B66A]"
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

            {/* Automatically changes dropdown direction */}
            <div
                className={`absolute right-0 z-50 hidden w-48 group-hover/menu:block group-focus-within/menu:block ${opensUp
                        ? "bottom-full pb-2"
                        : "top-full pt-2"
                    }`}
            >
                <div className="overflow-hidden rounded-xl border border-[#344256] bg-[#17212D] p-1.5 shadow-xl shadow-black/40">

                    <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#CBD5E1] transition hover:bg-white/[0.07] hover:text-white"
                    >
                        <svg
                            className="h-4 w-4 text-[#94A3B8]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 2.651 2.651M4 20l4.5-1 11-11a2.121 2.121 0 0 0-3-3l-11 11L4 20Z"
                            />
                        </svg>
                        Edit
                    </button>

                    <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#CBD5E1] transition hover:bg-white/[0.07] hover:text-white"
                    >
                        <CalendarIcon />
                        Reschedule
                    </button>

                    <button
                        type="button"
                        disabled={isMarking}
                        onClick={() => onMarkReviewed(review)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-emerald-400 transition hover:bg-emerald-400/10 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m5 12 4 4L19 6"
                            />
                        </svg>
                        {isMarking ? "Marking..." : "Mark as reviewed"}
                    </button>

                    <div className="my-1 border-t border-white/[0.08]" />

                    <button
                        type="button"
                        onClick={() => onDelete(review)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-400/10 hover:text-red-300"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 11v5m4-5v5"
                            />
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function DynamicBox({
    review,
    onRequestDelete,
    onMarkReviewed,
    markingReviewId,
}: Readonly<DynamicBoxProps>) {
    const status = getDateStatus(review.scheduled_at);

    const daysOverdue =
        status === "past" ? getDaysOverdue(review.scheduled_at) : 0;

    const styles: Record<
        DateStatus,
        {
            indicator: string;
            badge: string;
            card: string;
            label: string;
        }
    > = {
        today: {
            indicator: "bg-[#E5B94F]",
            badge: "bg-[#E5B94F]/10 text-[#E5C77E]",
            card: "border-[#B8954B]/30 hover:border-[#B8954B]/60",
            label: "TODAY",
        },
        past: {
            indicator: "bg-[#C77B63]",
            badge: "bg-[#C77B63]/10 text-[#D99A83]",
            card: "border-white/[0.07] hover:border-[#C77B63]/40",
            label: "OVERDUE",
        },
        future: {
            indicator: "bg-emerald-400",
            badge: "bg-emerald-400/10 text-emerald-400",
            card: "border-white/[0.07] hover:border-emerald-400/30",
            label: "UPCOMING",
        },
    };

    const style = styles[status];

    return (
        <article
            className={`group relative flex min-w-0 items-center gap-4 rounded-xl border bg-[#141D29] px-4 py-3.5 transition-all duration-200 hover:bg-[#192433] ${style.card}`}
        >
            <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.indicator}`}
            />

            <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[#E5E7EB] transition-colors group-hover:text-white sm:text-[15px]">
                        {review.name}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#8291A5]">
                        <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide ${style.badge}`}
                        >
                            {style.label}
                        </span>

                        <span>
                            {status === "past"
                                ? `Due ${formatScheduledDate(review.scheduled_at)}`
                                : status === "today"
                                    ? "Scheduled for today"
                                    : `Scheduled ${formatScheduledDate(review.scheduled_at)}`}
                        </span>

                        {status === "future" && (
                            <>
                                <span className="text-[#526176]">·</span>
                                <span>
                                    Added {formatCreatedDate(review.created_at)}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {status === "past" && (
                    <span className="hidden shrink-0 text-xs text-[#D99A83] sm:block">
                        {daysOverdue} {daysOverdue === 1 ? "day" : "days"} overdue
                    </span>
                )}
            </div>

            <ActionMenu
                review={review}
                onDelete={onRequestDelete}
                onMarkReviewed={onMarkReviewed}
                isMarking={markingReviewId === review.id}
            />
        </article>
    );
}
