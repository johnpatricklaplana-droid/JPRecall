import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "../lib/supbase";
import ReviewSchedulePicker from "./ReviewSchedulePicker";
import {
    formatDate,
    getMinimumReviewDate,
    parseInputDate,
    resolveReviewDate,
    type ReviewIntervalId,
} from "../helpers/dateHelper";

type LogStudyModalProps = {
    onClose: () => void;
    onSaved: () => void;
};

export default function LogStudyModal({
    onClose,
    onSaved,
}: Readonly<LogStudyModalProps>) {
    const [topic, setTopic] = useState("");
    const [interval, setInterval] = useState<ReviewIntervalId>("1d");
    const [customDate, setCustomDate] = useState("");
    const [topicError, setTopicError] = useState("");
    const [dateError, setDateError] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [saveError, setSaveError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const dialogRef = useRef<HTMLElement>(null);
    const topicInputRef = useRef<HTMLInputElement>(null);
    const onCloseRef = useRef(onClose);
    const isSavingRef = useRef(isSaving);
    const minDate = getMinimumReviewDate();

    onCloseRef.current = onClose;
    isSavingRef.current = isSaving;

    useEffect(() => {
        const previousActiveElement = document.activeElement;
        const previousBodyOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";
        topicInputRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !isSavingRef.current) {
                event.preventDefault();
                onCloseRef.current();
                return;
            }

            if (event.key !== "Tab") return;

            const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
                'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (!focusableElements?.length) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousBodyOverflow;

            if (
                previousActiveElement instanceof HTMLElement &&
                previousActiveElement.isConnected
            ) {
                previousActiveElement.focus();
            }
        };
    }, []);

    const clearMessages = () => {
        setTopicError("");
        setDateError("");
        setConfirmation("");
        setSaveError("");
    };

    const requestClose = () => {
        if (!isSaving) onClose();
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSaving) return;
        clearMessages();

        const trimmedTopic = topic.trim();
        if (!trimmedTopic) {
            setTopicError("Enter a topic to continue.");
            topicInputRef.current?.focus();
            return;
        }

        const reviewDate = resolveReviewDate(interval, customDate);
        if (!parseInputDate(reviewDate)) {
            setDateError("Choose a valid review date.");
            return;
        }

        if (reviewDate < minDate) {
            setDateError("Choose a date after today.");
            return;
        }

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from("to_review")
                .insert({
                    name: trimmedTopic,
                    scheduled_at: reviewDate,
                });

            if (error) {
                console.error("Failed to save study topic:", error);
                setSaveError("Unable to save this topic. Please try again.");
                return;
            }

            setConfirmation(
                `Saved “${trimmedTopic}”. Review scheduled for ${formatDate(
                    reviewDate,
                    {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    }
                )}.`
            );
            setTopic("");
            setInterval("1d");
            setCustomDate("");
            onSaved();
        } catch (error) {
            console.error("Unexpected topic save error:", error);
            setSaveError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-6"
            onClick={(event) => {
                if (event.target === event.currentTarget) requestClose();
            }}
        >
            <section
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="log-study-title"
                aria-describedby="log-study-description"
                className="flex max-h-[min(90vh,780px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#344256] bg-[#141D29] shadow-2xl shadow-black/50"
            >
                <header className="flex items-start gap-4 border-b border-[#293648] px-5 py-5 sm:px-7">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#B8954B]/20 bg-[#B8954B]/10 text-[#D6B66A]">
                        <svg
                            aria-hidden="true"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 5v14m-7-7h14"
                            />
                        </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8291A5]">
                            Study session
                        </p>
                        <h2
                            id="log-study-title"
                            className="mt-1 text-xl font-bold tracking-tight text-[#F3F4F6]"
                        >
                            Log study
                        </h2>
                        <p
                            id="log-study-description"
                            className="mt-1 text-sm text-[#8291A5]"
                        >
                            Record a topic and choose when you want to review it.
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label="Close log study dialog"
                        onClick={requestClose}
                        disabled={isSaving}
                        className="rounded-lg p-2 text-[#8291A5] transition-colors hover:bg-white/[0.05] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8954B] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg
                            aria-hidden="true"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m6 6 12 12M18 6 6 18"
                            />
                        </svg>
                    </button>
                </header>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
                        <div>
                            <label
                                htmlFor="log-study-topic"
                                className="block text-sm font-medium text-[#E5E7EB]"
                            >
                                What topic did you study?
                            </label>
                            <input
                                ref={topicInputRef}
                                id="log-study-topic"
                                type="text"
                                required
                                value={topic}
                                onChange={(event) => {
                                    setTopic(event.target.value);
                                    setTopicError("");
                                    setConfirmation("");
                                    setSaveError("");
                                }}
                                placeholder="e.g. Two Pointers, Sliding Window, Binary Search"
                                aria-invalid={Boolean(topicError)}
                                aria-describedby={
                                    topicError ? "log-study-topic-error" : undefined
                                }
                                className={`mt-2 w-full rounded-lg border bg-[#111923] px-4 py-3 text-base text-[#F3F4F6] placeholder:text-[#8291A5] focus:outline-none focus:ring-1 ${
                                    topicError
                                        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                                        : "border-[#344256] focus:border-[#B8954B] focus:ring-[#B8954B]"
                                }`}
                            />
                            {topicError && (
                                <p
                                    id="log-study-topic-error"
                                    className="mt-2 text-sm text-red-300"
                                >
                                    {topicError}
                                </p>
                            )}
                        </div>

                        <ReviewSchedulePicker
                            groupName="log-study-review-interval"
                            interval={interval}
                            customDate={customDate}
                            dateError={dateError}
                            onIntervalChange={(nextInterval) => {
                                setInterval(nextInterval);
                                setDateError("");
                                setConfirmation("");
                                setSaveError("");
                            }}
                            onCustomDateChange={(nextDate) => {
                                setCustomDate(nextDate);
                                setDateError("");
                                setConfirmation("");
                                setSaveError("");
                            }}
                        />

                        <div className="flex items-center gap-3 rounded-xl border border-[#B8954B]/20 bg-[#B8954B]/5 px-4 py-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#B8954B]/10 text-[#D6B66A]">
                                <svg
                                    aria-hidden="true"
                                    className="h-[18px] w-[18px]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.75}
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path
                                        strokeLinecap="round"
                                        d="M12 11v5m0-8h.01"
                                    />
                                </svg>
                            </span>
                            <p className="text-sm leading-relaxed text-[#CBD5E1]">
                                Missed reviews stay on your schedule until you revisit them.
                            </p>
                        </div>

                        {saveError && (
                            <p
                                role="alert"
                                className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-300"
                            >
                                {saveError}
                            </p>
                        )}
                        {confirmation && (
                            <p
                                role="status"
                                aria-live="polite"
                                className="flex items-start gap-2 text-sm text-[#D6B66A]"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="mt-0.5 h-4 w-4 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m5 12.5 4.5 4.5L19 7.5"
                                    />
                                </svg>
                                <span>{confirmation}</span>
                            </p>
                        )}
                    </div>

                    <footer className="flex flex-col-reverse gap-3 border-t border-[#293648] bg-[#111923] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                        <button
                            type="button"
                            onClick={requestClose}
                            disabled={isSaving}
                            className="rounded-lg border border-[#344256] px-5 py-2.5 text-sm font-medium text-[#CBD5E1] transition-colors hover:bg-white/[0.05] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8954B] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-lg bg-[#B8954B] px-5 py-2.5 text-sm font-semibold text-[#111827] transition-colors hover:bg-[#D6B66A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B66A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111923] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving ? "Saving..." : "Save topic"}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}
