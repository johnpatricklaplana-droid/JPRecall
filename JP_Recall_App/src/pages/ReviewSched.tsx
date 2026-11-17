
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supbase";
import { getDateStatus } from "../helpers/dateHelper";
import DynamicBox from "../components/DynamicBox";
import type { Review } from "../types/types";

type ActionMessage = {
    type: "success" | "error";
    text: string;
};

export default function ReviewSchedulePage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const [markingReviewId, setMarkingReviewId] = useState<string | null>(null);

    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [actionMessage, setActionMessage] = useState<ActionMessage | null>(null);

    // Fetch active review topics.
    useEffect(() => {
        const fetchReviews = async () => {
            const { data, error } = await supabase
                .from("to_review")
                .select("*")
                .eq("is_reviewed", false);

            if (error) {
                console.error("Failed to fetch reviews:", error);
                return;
            }

            setReviews(data ?? []);
        };

        void fetchReviews();
    }, []);

    // Mark a topic as reviewed.
    const handleMarkReviewed = async (review: Review) => {
        if (markingReviewId !== null) return;

        setMarkingReviewId(review.id);
        setActionMessage(null);

        try {
            const { data, error } = await supabase
                .from("to_review")
                .update({ is_reviewed: true })
                .eq("id", review.id)
                .eq("is_reviewed", false)
                .select("id")
                .maybeSingle();

            if (error) {
                console.error("Failed to mark topic as reviewed:", error);

                setActionMessage({
                    type: "error",
                    text: "Failed to mark topic as reviewed. Please try again.",
                });

                return;
            }

            if (!data) {
                setActionMessage({
                    type: "error",
                    text: "Topic was not found or has already been reviewed.",
                });

                return;
            }

            setReviews(currentReviews =>
                currentReviews.filter(item => item.id !== review.id)
            );

            setActionMessage({
                type: "success",
                text: `"${review.name}" marked as reviewed.`,
            });
        } catch (error) {
            console.error("Unexpected review update error:", error);

            setActionMessage({
                type: "error",
                text: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setMarkingReviewId(null);
        }
    };

    // Open delete confirmation.
    const requestDeleteReview = (review: Review) => {
        setDeleteError(null);
        setActionMessage(null);
        setSelectedReview(review);
    };

    // Close delete confirmation.
    const closeDeleteDialog = () => {
        if (isDeleting) return;

        setSelectedReview(null);
        setDeleteError(null);
    };

    // Permanently delete a topic.
    const handleDeleteReview = async () => {
        if (!selectedReview || isDeleting) return;

        const reviewToDelete = selectedReview;

        setIsDeleting(true);
        setDeleteError(null);

        try {
            const { data, error } = await supabase
                .from("to_review")
                .delete()
                .eq("id", reviewToDelete.id)
                .select("id")
                .maybeSingle();

            if (error) {
                console.error("Failed to delete review:", error);

                setDeleteError(
                    "Something went wrong. Please try again."
                );

                return;
            }

            if (!data) {
                setDeleteError(
                    "This topic could not be found or you don't have permission to delete it."
                );

                return;
            }

            setReviews(currentReviews =>
                currentReviews.filter(
                    review => review.id !== reviewToDelete.id
                )
            );

            setSelectedReview(null);

            setActionMessage({
                type: "success",
                text: "Topic deleted successfully.",
            });
        } catch (error) {
            console.error("Unexpected deletion error:", error);

            setDeleteError(
                "An unexpected error occurred. Please try again."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    // Categorize active reviews.
    const today = useMemo(
        () => reviews.filter(r => getDateStatus(r.scheduled_at) === "today"),
        [reviews]
    );

    const past = useMemo(
        () => reviews.filter(r => getDateStatus(r.scheduled_at) === "past"),
        [reviews]
    );

    const future = useMemo(
        () => reviews.filter(r => getDateStatus(r.scheduled_at) === "future"),
        [reviews]
    );

    // One continuous list, grouped by status order.
    const activeReviews = useMemo(
        () => [...today, ...past, ...future],
        [today, past, future]
    );

    const currentDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const stats = [
        {
            label: "Today",
            count: today.length,
            color: "text-[#E5C77E]",
            dot: "bg-[#E5B94F]",
        },
        {
            label: "Overdue",
            count: past.length,
            color: "text-[#D99A83]",
            dot: "bg-[#C77B63]",
        },
        {
            label: "Upcoming",
            count: future.length,
            color: "text-emerald-400",
            dot: "bg-emerald-400",
        },
    ];

    return (
        <>
            <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">

                    {/* Overview */}
                    <aside className="rounded-2xl border border-[#293648] bg-[#111923] p-6 shadow-sm sm:p-7">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8291A5]">
                                    YOUR ACTIVITY
                                </p>

                                <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#F3F4F6]">
                                    Review Overview
                                </h1>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#B8954B]/20 bg-[#B8954B]/10 text-[#E5C77E]">
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.8}
                                >
                                    <rect x="3" y="5" width="18" height="16" rx="2" />
                                    <path strokeLinecap="round" d="M16 3v4M8 3v4M3 10h18" />
                                </svg>
                            </div>
                        </div>

                        <p className="mt-2 text-sm text-[#8291A5]">
                            {currentDate}
                        </p>

                        {/* Total topics */}
                        <div className="mt-9 rounded-xl border border-[#344256] bg-[#182330] p-5">
                            <p className="text-sm font-medium text-[#94A3B8]">
                                Total topics
                            </p>

                            <div className="mt-2 flex items-end justify-between gap-3">
                                <span className="text-5xl font-bold tracking-tight text-white">
                                    {reviews.length}
                                </span>

                                <span className="mb-1 text-xs text-[#8291A5]">
                                    In your schedule
                                </span>
                            </div>
                        </div>

                        {/* Schedule breakdown */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-[#E5E7EB]">
                                    Schedule breakdown
                                </h2>

                                <span className="text-xs text-[#64748B]">
                                    {reviews.length} total
                                </span>
                            </div>

                            <div className="mt-4 space-y-2">
                                {stats.map(stat => (
                                    <div
                                        key={stat.label}
                                        className="flex items-center justify-between rounded-lg border border-white/[0.045] bg-white/[0.025] px-4 py-3.5 transition-colors hover:bg-white/[0.045]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`h-2.5 w-2.5 rounded-full ${stat.dot}`} />

                                            <span className={`text-sm font-medium ${stat.color}`}>
                                                {stat.label}
                                            </span>
                                        </div>

                                        <span className="text-lg font-semibold tabular-nums text-[#E5E7EB]">
                                            {stat.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Review list */}
                    <main className="min-w-0">
                        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-[#F3F4F6]">
                                    Review Schedule
                                </h2>

                                <p className="mt-1 text-sm text-[#8291A5]">
                                    Manage your topics and keep your knowledge fresh.
                                </p>
                            </div>

                            <span className="rounded-lg border border-[#293648] bg-[#111923] px-3 py-1.5 text-xs text-[#94A3B8]">
                                {reviews.length} topics
                            </span>
                        </div>

                        {/* All topics in one continuous column */}
                        <div className="space-y-2.5">
                            {activeReviews.map(review => (
                                <DynamicBox
                                    key={review.id}
                                    review={review}
                                    onRequestDelete={requestDeleteReview}
                                    onMarkReviewed={handleMarkReviewed}
                                    markingReviewId={markingReviewId}
                                />
                            ))}

                            {activeReviews.length === 0 && (
                                <div className="rounded-xl border border-dashed border-[#293648] bg-white/[0.015] px-4 py-10 text-center">
                                    <p className="text-sm font-medium text-[#CBD5E1]">
                                        No topics to review.
                                    </p>

                                    <p className="mt-1 text-xs text-[#64748B]">
                                        Your review schedule is currently empty.
                                    </p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Delete confirmation dialog */}
            {selectedReview && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-dialog-title"
                        aria-describedby="delete-dialog-description"
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
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 11v5m4-5v5"
                                    />
                                </svg>
                            </div>

                            <div>
                                <h2
                                    id="delete-dialog-title"
                                    className="text-lg font-semibold text-white"
                                >
                                    Delete topic?
                                </h2>

                                <p className="mt-0.5 text-sm text-[#94A3B8]">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <p
                            id="delete-dialog-description"
                            className="mt-5 text-sm leading-relaxed text-[#A7B4C7]"
                        >
                            Are you sure you want to delete this topic?
                        </p>

                        <div className="mt-4 rounded-xl border border-[#344256] bg-[#111923] px-4 py-3">
                            <p className="break-words text-sm font-semibold text-[#E5E7EB]">
                                {selectedReview.name}
                            </p>
                        </div>

                        <p className="mt-3 text-xs leading-relaxed text-[#8291A5]">
                            This will permanently remove the topic from your review schedule. It will not be moved to Long-Term Memory.
                        </p>

                        {deleteError && (
                            <div
                                role="alert"
                                className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-300"
                            >
                                {deleteError}
                            </div>
                        )}

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={closeDeleteDialog}
                                disabled={isDeleting}
                                className="rounded-xl border border-[#344256] px-5 py-2.5 text-sm font-medium text-[#CBD5E1] transition-colors hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteReview}
                                disabled={isDeleting}
                                className="flex items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-500/15 px-5 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/25 hover:text-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {/* Action notification */}
            {actionMessage && (
                <div
                    role="status"
                    className={`fixed bottom-5 right-5 z-[110] flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-xl border px-4 py-3 shadow-xl ${actionMessage.type === "success"
                            ? "border-emerald-400/20 bg-[#14271F] text-emerald-300"
                            : "border-red-400/20 bg-[#2A191B] text-red-300"
                        }`}
                >
                    <svg
                        className="h-5 w-5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        {actionMessage.type === "success" ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m5 12 4 4L19 6"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v4m0 4h.01M10.3 3.9 2.7 17.2A2 2 0 0 0 4.4 20h15.2a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z"
                            />
                        )}
                    </svg>

                    <p className="min-w-0 text-sm">
                        {actionMessage.text}
                    </p>

                    <button
                        type="button"
                        aria-label="Dismiss notification"
                        onClick={() => setActionMessage(null)}
                        className="ml-2 shrink-0 rounded p-1 opacity-70 transition hover:bg-white/10 hover:opacity-100"
                    >
                        ×
                    </button>
                </div>
            )}
        </>
    );
}
