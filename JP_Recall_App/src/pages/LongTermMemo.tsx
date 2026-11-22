
import { useEffect, useMemo, useState } from "react";
import { BrainCircuit, RotateCcw, Search, Trash2 } from "lucide-react";
import { supabase } from "../lib/supbase";
import ReviewSchedulePicker from "../components/ReviewSchedulePicker";
import SkeletonBlock from "../components/SkeletonBlock";
import {
    formatDate,
    getMinimumReviewDate,
    parseInputDate,
    resolveReviewDate,
    type ReviewIntervalId,
} from "../helpers/dateHelper";
import type { Review } from "../types/types";

type ActionMessage = {
    type: "success" | "error";
    text: string;
};

const formatMemoryDate = (value: string) =>
    formatDate(value, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

export default function LongTermMemoryPage() {
    const [topics, setTopics] = useState<Review[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<Review | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [movingTopicId, setMovingTopicId] = useState<string | null>(null);
    const [reschedulingTopicId, setReschedulingTopicId] = useState<string | null>(null);
    const [reviewInterval, setReviewInterval] = useState<ReviewIntervalId>("1d");
    const [customReviewDate, setCustomReviewDate] = useState("");
    const [dateError, setDateError] = useState("");
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [actionMessage, setActionMessage] = useState<ActionMessage | null>(null);

    useEffect(() => {
        const fetchReviewedTopics = async () => {
            setIsLoading(true);
            setFetchError(null);

            const { data, error } = await supabase
                .from("to_review")
                .select("id,name,scheduled_at,created_at,is_reviewed")
                .eq("is_reviewed", true)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Failed to fetch long-term memory topics:", error);
                setFetchError("Unable to load your memory library.");
                setTopics([]);
            } else {
                setTopics(data ?? []);
            }

            setIsLoading(false);
        };

        void fetchReviewedTopics();
    }, []);

    const filteredTopics = useMemo(
        () =>
            topics.filter((topic) =>
                topic.name.toLowerCase().includes(search.toLowerCase())
            ),
        [topics, search]
    );

    const closeDeleteDialog = () => {
        if (isDeleting) return;
        setSelectedTopic(null);
        setDeleteError(null);
    };

    const handleDelete = async () => {
        if (!selectedTopic || isDeleting) return;

        setIsDeleting(true);
        setDeleteError(null);

        try {
            const { data, error } = await supabase
                .from("to_review")
                .delete()
                .eq("id", selectedTopic.id)
                .eq("is_reviewed", true)
                .select("id")
                .maybeSingle();

            if (error) {
                console.error("Failed to delete memory topic:", error);
                setDeleteError("Something went wrong. Please try again.");
                return;
            }

            if (!data) {
                setDeleteError("This topic could not be found or you do not have permission to delete it.");
                return;
            }

            setTopics((current) =>
                current.filter((topic) => topic.id !== selectedTopic.id)
            );
            setSelectedTopic(null);
            setActionMessage({
                type: "success",
                text: `"${selectedTopic.name}" deleted successfully.`,
            });
        } catch (error) {
            console.error("Unexpected memory deletion error:", error);
            setDeleteError("An unexpected error occurred. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const openReschedule = (topic: Review) => {
        setActionMessage(null);
        setDateError("");
        setReviewInterval("1d");
        setCustomReviewDate("");
        setReschedulingTopicId((current) =>
            current === topic.id ? null : topic.id
        );
    };

    const closeReschedule = () => {
        if (movingTopicId !== null) return;
        setReschedulingTopicId(null);
        setDateError("");
    };

    const handleReturnToReview = async (topic: Review) => {
        if (movingTopicId !== null) return;

        const scheduledAt = resolveReviewDate(reviewInterval, customReviewDate);
        const parsedDate = parseInputDate(scheduledAt);
        const minDate = getMinimumReviewDate();

        if (!parsedDate) {
            setDateError("Choose a valid review date.");
            return;
        }

        if (scheduledAt < minDate) {
            setDateError("Choose a date after today.");
            return;
        }

        setMovingTopicId(topic.id);
        setActionMessage(null);
        setDateError("");

        try {
            const { data, error } = await supabase
                .from("to_review")
                .update({
                    is_reviewed: false,
                    scheduled_at: scheduledAt,
                })
                .eq("id", topic.id)
                .eq("is_reviewed", true)
                .select("id")
                .maybeSingle();

            if (error) {
                console.error("Failed to return topic to review:", error);
                setActionMessage({
                    type: "error",
                    text: "Failed to return the topic to review. Please try again.",
                });
                return;
            }

            if (!data) {
                setActionMessage({
                    type: "error",
                    text: "Topic was not found or is already in the review schedule.",
                });
                return;
            }

            setTopics((current) =>
                current.filter((item) => item.id !== topic.id)
            );
            setReschedulingTopicId(null);
            setActionMessage({
                type: "success",
                text: `"${topic.name}" returned to review for ${formatMemoryDate(scheduledAt)}.`,
            });
        } catch (error) {
            console.error("Unexpected return-to-review error:", error);
            setActionMessage({
                type: "error",
                text: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setMovingTopicId(null);
        }
    };

    const thisMonth = topics.filter((topic) => {
        const saved = new Date(topic.created_at);
        const now = new Date();
        return (
            saved.getFullYear() === now.getFullYear() &&
            saved.getMonth() === now.getMonth()
        );
    }).length;


    return (
        <>
            <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">
                    <aside className="rounded-2xl border border-[#293648] bg-[#111923] p-6 shadow-sm sm:sticky sm:top-7 sm:p-7">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8291A5]">
                                    KNOWLEDGE ARCHIVE
                                </p>
                                <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#F3F4F6]">
                                    Memory Library
                                </h1>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#B8954B]/20 bg-[#B8954B]/10 text-[#E5C77E]">
                                <BrainCircuit className="h-5 w-5" strokeWidth={1.8} />
                            </div>
                        </div>

                        <p className="mt-2 text-sm text-[#8291A5]">
                            Topics you have completed reviewing.
                        </p>

                        <div className="mt-9 rounded-xl border border-[#344256] bg-[#182330] p-5">
                            <p className="text-sm font-medium text-[#94A3B8]">Stored topics</p>
                            <div className="mt-2 flex items-end justify-between gap-3">
                                <span className="text-5xl font-bold tracking-tight text-white">
                                    {isLoading ? (
                                        <SkeletonBlock className="h-12 w-16" />
                                    ) : fetchError ? (
                                        "—"
                                    ) : (
                                        topics.length
                                    )}
                                </span>
                                <span className="mb-1 text-xs text-[#8291A5]">
                                    In long-term memory
                                </span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-sm font-semibold text-[#E5E7EB]">Library breakdown</h2>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between rounded-lg border border-white/[0.045] bg-white/[0.025] px-4 py-3.5">
                                    <span className="flex items-center gap-3 text-sm font-medium text-[#E5C77E]">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#E5B94F]" />
                                        Reviewed this month
                                    </span>
                                    {isLoading ? (
                                        <SkeletonBlock className="h-6 w-8" />
                                    ) : (
                                        <span className="text-lg font-semibold tabular-nums text-[#E5E7EB]">
                                            {fetchError ? "—" : thisMonth}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="min-w-0">
                        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-[#F3F4F6]">
                                    Memory Library
                                </h2>
                                <p className="mt-1 text-sm text-[#8291A5]">
                                    Browse the topics you have already mastered.
                                </p>
                            </div>
                            <span className="rounded-lg border border-[#293648] bg-[#111923] px-3 py-1.5 text-xs text-[#94A3B8]">
                                {isLoading ? (
                                    <SkeletonBlock className="h-3 w-16" />
                                ) : fetchError ? (
                                    "— topics"
                                ) : (
                                    `${filteredTopics.length} topics`
                                )}
                            </span>
                        </div>

                        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#293648] bg-[#111923] px-4 py-3.5 transition-colors focus-within:border-[#526477]">
                            <Search size={18} className="shrink-0 text-[#8291A5]" />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search your memory library..."
                                className="w-full bg-transparent text-sm text-[#E5E7EB] outline-none placeholder:text-[#8291A5]"
                            />
                        </div>

                        {isLoading ? (
                            <div
                                role="status"
                                aria-label="Loading memory library"
                                className="space-y-2.5"
                            >
                                <span className="sr-only">Loading memory library...</span>
                                {Array.from({ length: 4 }, (_, index) => (
                                    <article
                                        key={index}
                                        aria-hidden="true"
                                        className="flex flex-wrap items-center gap-4 rounded-xl border border-white/[0.07] bg-[#141D29] px-4 py-3.5 sm:flex-nowrap"
                                    >
                                        <SkeletonBlock className="h-2.5 w-2.5 shrink-0 rounded-full" />
                                        <div className="min-w-0 flex-1">
                                            <SkeletonBlock className="h-4 w-2/5 max-w-48" />
                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                <SkeletonBlock className="h-4 w-16 rounded" />
                                                <SkeletonBlock className="h-3 w-28" />
                                            </div>
                                        </div>
                                        <SkeletonBlock className="h-9 w-32 rounded-lg" />
                                        <SkeletonBlock className="h-9 w-9 rounded-lg" />
                                    </article>
                                ))}
                            </div>
                        ) : fetchError ? (
                            <div role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-4 text-sm text-red-300">
                                {fetchError}
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {filteredTopics.map((topic) => (
                                    <div key={topic.id} className="space-y-2">
                                        <article
                                            className="group flex flex-wrap items-center gap-4 rounded-xl border border-white/[0.07] bg-[#141D29] px-4 py-3.5 transition-colors hover:border-[#B8954B]/40 hover:bg-[#192433] sm:flex-nowrap"
                                        >
                                            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-sm font-semibold text-[#E5E7EB] group-hover:text-white sm:text-[15px]">
                                                    {topic.name}
                                                </h3>
                                                <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-[#8291A5]">
                                                    <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-400">
                                                        REVIEWED
                                                    </span>
                                                    <span>Stored {formatMemoryDate(topic.created_at)}</span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                aria-expanded={reschedulingTopicId === topic.id}
                                                onClick={() => openReschedule(topic)}
                                                className="inline-flex items-center gap-2 rounded-lg border border-[#344256] px-3 py-2 text-xs font-medium text-[#D6B66A] transition-colors hover:border-[#B8954B]/50 hover:bg-[#B8954B]/10"
                                            >
                                                <RotateCcw className="h-4 w-4" strokeWidth={1.8} />
                                                {reschedulingTopicId === topic.id ? "Cancel" : "Return to review"}
                                            </button>
                                            <button
                                                type="button"
                                                aria-label={`Delete ${topic.name}`}
                                                onClick={() => {
                                                    setDeleteError(null);
                                                    setActionMessage(null);
                                                    setSelectedTopic(topic);
                                                }}
                                                className="rounded-lg p-2 text-[#8291A5] transition-colors hover:bg-red-400/10 hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </article>

                                        {reschedulingTopicId === topic.id && (
                                            <div className="rounded-xl border border-[#344256] bg-[#111923] p-4 sm:p-5">
                                                <ReviewSchedulePicker
                                                    groupName={`review-interval-${topic.id}`}
                                                    interval={reviewInterval}
                                                    customDate={customReviewDate}
                                                    dateError={dateError}
                                                    onIntervalChange={(nextInterval) => {
                                                        setReviewInterval(nextInterval);
                                                        setDateError("");
                                                    }}
                                                    onCustomDateChange={(nextDate) => {
                                                        setCustomReviewDate(nextDate);
                                                        setDateError("");
                                                    }}
                                                />

                                                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={closeReschedule}
                                                        disabled={movingTopicId === topic.id}
                                                        className="rounded-md border border-[#374151] px-5 py-2.5 text-sm font-medium text-[#CBD5E1] transition-colors hover:bg-white/[0.05] disabled:opacity-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => void handleReturnToReview(topic)}
                                                        disabled={movingTopicId === topic.id}
                                                        className="rounded-md bg-[#B8954B] px-5 py-2.5 text-sm font-semibold text-[#111827] transition-colors hover:bg-[#D6B66A] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {movingTopicId === topic.id
                                                            ? "Scheduling..."
                                                            : "Save and return"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {filteredTopics.length === 0 && (
                                    <div className="rounded-xl border border-dashed border-[#293648] bg-white/[0.015] px-4 py-10 text-center">
                                        <p className="text-sm font-medium text-[#CBD5E1]">
                                            {search ? "No matching topics found." : "No reviewed topics yet."}
                                        </p>
                                        <p className="mt-1 text-xs text-[#64748B]">
                                            {search
                                                ? "Try a different search."
                                                : "Completed reviews will appear here."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {selectedTopic && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-memory-title"
                        aria-describedby="delete-memory-description"
                        className="w-full max-w-md rounded-2xl border border-[#344256] bg-[#17212D] p-6 shadow-2xl shadow-black/50"
                    >
                        <h2 id="delete-memory-title" className="text-lg font-semibold text-white">
                            Delete topic?
                        </h2>
                        <p id="delete-memory-description" className="mt-2 text-sm leading-relaxed text-[#A7B4C7]">
                            This permanently removes the topic from your memory library.
                        </p>
                        <div className="mt-4 rounded-xl border border-[#344256] bg-[#111923] px-4 py-3">
                            <p className="break-words text-sm font-semibold text-[#E5E7EB]">
                                {selectedTopic.name}
                            </p>
                        </div>
                        {deleteError && (
                            <div role="alert" className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-300">
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
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="rounded-xl border border-red-400/30 bg-red-500/15 px-5 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {actionMessage && (
                <div
                    role="status"
                    className={`fixed bottom-5 right-5 z-[110] flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-xl border px-4 py-3 shadow-xl ${
                        actionMessage.type === "success"
                            ? "border-emerald-400/20 bg-[#14271F] text-emerald-300"
                            : "border-red-400/20 bg-[#2A191B] text-red-300"
                    }`}
                >
                    <p className="text-sm">{actionMessage.text}</p>
                    <button
                        type="button"
                        aria-label="Dismiss notification"
                        onClick={() => setActionMessage(null)}
                        className="rounded p-1 opacity-70 hover:bg-white/10 hover:opacity-100"
                    >
                        ×
                    </button>
                </div>
            )}
        </>
    );
}
