
import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supbase";
import ReviewSchedulePicker from "../components/ReviewSchedulePicker";
import {
    formatDate,
    getMinimumReviewDate,
    parseInputDate,
    resolveReviewDate,
    type ReviewIntervalId,
} from "../helpers/dateHelper";

export default function LogStudyPage() {
    const [topic, setTopic] = useState("");
    const [interval, setInterval] = useState<ReviewIntervalId>("1d");
    const [customDate, setCustomDate] = useState("");
    const [topicError, setTopicError] = useState("");
    const [dateError, setDateError] = useState("");
    const [confirmation, setConfirmation] = useState("");

    const minDate = getMinimumReviewDate();

    const clearMessages = () => {
        setTopicError("");
        setDateError("");
        setConfirmation("");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearMessages();

        const trimmedTopic = topic.trim();

        if (!trimmedTopic) {
            setTopicError("Enter a topic to continue.");
            return;
        }

        const reviewDate = resolveReviewDate(interval, customDate);

        const parsedDate = parseInputDate(reviewDate);

        if (!parsedDate) {
            setDateError("Choose a valid review date.");
            return;
        }

        if (reviewDate < minDate) {
            setDateError("Choose a date after today.");
            return;
        }

        const { data, error } = await supabase 
            .from("to_review")
            .insert({
                name: trimmedTopic,
                scheduled_at: reviewDate
            });

        if(error) {
            console.log(error);
            throw error;
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
    };

    return (
        <div className="min-h-screen w-full text-[#F9FAFB]">
            <main className="pt-14 md:pt-0">
                <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-8 md:py-14 lg:px-12">
                    <header className="border-b border-[#374151] pb-6">
                        <h1 className="text-3xl font-semibold tracking-tight text-[#F9FAFB]">
                            Log Study
                        </h1>
                        <p className="mt-2 text-base text-[#9CA3AF]">
                            Record what you studied and plan when to review it.
                        </p>
                    </header>

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="mt-8 overflow-hidden rounded-lg border border-[#374151] bg-[#1F2937]"
                    >
                        <div className="space-y-8 p-6 sm:p-8">
                            {/* Topic */}
                            <div>
                                <label
                                    htmlFor="topic"
                                    className="block text-sm font-medium text-[#F9FAFB]"
                                >
                                    What topic did you study?
                                </label>

                                <input
                                    id="topic"
                                    type="text"
                                    required
                                    value={topic}
                                    onChange={(e) => {
                                        setTopic(e.target.value);
                                        setTopicError("");
                                        setConfirmation("");
                                    }}
                                    placeholder="e.g. Two Pointers, Sliding Window, Binary Search"
                                    aria-invalid={!!topicError}
                                    aria-describedby={
                                        topicError ? "topic-error" : undefined
                                    }
                                    className={`mt-3 w-full rounded-md border bg-[#111827] px-4 py-3.5 text-base text-[#F9FAFB] placeholder:text-[#9CA3AF]/70 focus:outline-none focus:ring-1 ${topicError
                                            ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                                            : "border-[#374151] focus:border-[#B8954B] focus:ring-[#B8954B]"
                                        }`}
                                />

                                {topicError && (
                                    <p
                                        id="topic-error"
                                        className="mt-2 text-sm text-red-400"
                                    >
                                        {topicError}
                                    </p>
                                )}
                            </div>

                            {/* Review schedule */}
                            <ReviewSchedulePicker
                                groupName="review-interval"
                                interval={interval}
                                customDate={customDate}
                                dateError={dateError}
                                onIntervalChange={(nextInterval) => {
                                    setInterval(nextInterval);
                                    setDateError("");
                                    setConfirmation("");
                                }}
                                onCustomDateChange={(nextDate) => {
                                    setCustomDate(nextDate);
                                    setDateError("");
                                    setConfirmation("");
                                }}
                            />

                            {/* Informational note */}
                            <div className="flex items-center gap-4 rounded-md border-l-2 border-[#B8954B] bg-[#B8954B]/10 px-4 py-3.5">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#B8954B]/20 text-[#D6B66A]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1.75}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                        className="h-[18px] w-[18px]"
                                    >
                                        <circle cx="12" cy="12" r="9" />
                                        <path d="M12 11v5M12 8h.01" />
                                    </svg>
                                </span>

                                <p className="text-sm leading-relaxed text-[#F9FAFB]">
                                    If you miss a scheduled review, the topic will remain in your
                                    review list until you revisit it.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col gap-4 border-t border-[#374151] bg-[#151D2B] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                            <div
                                role="status"
                                aria-live="polite"
                                className="min-h-[1.25rem] text-sm sm:max-w-md"
                            >
                                {confirmation && (
                                    <p className="flex items-start gap-2 text-[#D6B66A]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                            className="mt-0.5 h-4 w-4 shrink-0"
                                        >
                                            <path d="M5 12.5l4.5 4.5L19 7.5" />
                                        </svg>

                                        <span>{confirmation}</span>
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full shrink-0 rounded-md bg-[#B8954B] px-6 py-3 text-sm font-semibold text-[#111827] transition-colors hover:bg-[#D6B66A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B66A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#151D2B] sm:w-auto"
                            >
                                Save topic and schedule review
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
