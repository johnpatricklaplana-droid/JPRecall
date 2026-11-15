import { useState, type ChangeEvent, type FormEvent } from "react";

const OPTIONS = [
    { id: "1d", label: "1 day", days: 1 },
    { id: "3d", label: "3 days", days: 3 },
    { id: "1w", label: "1 week", days: 7 },
    { id: "custom", label: "Custom date", days: null },
] as const;

type IntervalId = (typeof OPTIONS)[number]["id"];

const pad = (n: number) => String(n).padStart(2, "0");

const toInputDate = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const parseInputDate = (value: string) => {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
};

const addDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
};

const formatLong = (d: Date) =>
    d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

const formatShort = (d: Date) =>
    d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });

export default function LogStudyPage() {
    const [topic, setTopic] = useState("");
    const [interval, setInterval] = useState<IntervalId>("1d");
    const [customDate, setCustomDate] = useState("");
    const [topicError, setTopicError] = useState("");
    const [dateError, setDateError] = useState("");
    const [confirmation, setConfirmation] = useState("");

    const minDate = toInputDate(addDays(1));

    const handleTopicChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTopic(e.target.value);
        setTopicError("");
        setConfirmation("");
    };

    const handleIntervalChange = (id: IntervalId) => {
        setInterval(id);
        setDateError("");
        setConfirmation("");
    };

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomDate(e.target.value);
        setDateError("");
        setConfirmation("");
    };

    const getOptionDateText = (option: (typeof OPTIONS)[number]) => {
        if (option.days !== null) return formatShort(addDays(option.days));
        if (customDate && customDate >= minDate) {
            return formatShort(parseInputDate(customDate));
        }
        return "Pick a date";
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmed = topic.trim();
        if (!trimmed) {
            setTopicError("Enter a topic to continue.");
            setConfirmation("");
            return;
        }

        let reviewDate: Date;

        if (interval === "custom") {
            if (!customDate) {
                setDateError("Choose a review date.");
                setConfirmation("");
                return;
            }
            if (customDate < minDate) {
                setDateError("Choose a date after today.");
                setConfirmation("");
                return;
            }
            reviewDate = parseInputDate(customDate);
        } else {
            const selected = OPTIONS.find((o) => o.id === interval);
            reviewDate = addDays(selected?.days ?? 1);
        }

        setConfirmation(
            `Saved “${trimmed}”. Review scheduled for ${formatLong(reviewDate)}.`
        );
        setTopic("");
        setInterval("1d");
        setCustomDate("");
        setTopicError("");
        setDateError("");
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
                            {/* Topic input */}
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
                                    onChange={handleTopicChange}
                                    placeholder="e.g. Two Pointers, Sliding Window, Binary Search"
                                    aria-invalid={topicError ? true : undefined}
                                    aria-describedby={topicError ? "topic-error" : undefined}
                                    className={[
                                        "mt-3 w-full rounded-md border bg-[#111827] px-4 py-3.5 text-base text-[#F9FAFB] placeholder:text-[#9CA3AF]/70 focus:outline-none focus:ring-1",
                                        topicError
                                            ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                                            : "border-[#374151] focus:border-[#B8954B] focus:ring-[#B8954B]",
                                    ].join(" ")}
                                />
                                {topicError && (
                                    <p id="topic-error" className="mt-2 text-sm text-red-400">
                                        {topicError}
                                    </p>
                                )}
                            </div>

                            {/* Review schedule */}
                            <fieldset>
                                <legend className="text-sm font-medium text-[#F9FAFB]">
                                    When should you review it?
                                </legend>
                                <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                    {OPTIONS.map((option) => (
                                        <label key={option.id} className="block cursor-pointer">
                                            <input
                                                type="radio"
                                                name="review-interval"
                                                value={option.id}
                                                checked={interval === option.id}
                                                onChange={() => handleIntervalChange(option.id)}
                                                className="peer sr-only"
                                            />
                                            <span className="group relative flex h-full flex-col gap-1 rounded-md border border-[#374151] bg-[#111827] px-4 py-4 transition-colors hover:border-[#9CA3AF]/60 peer-checked:border-[#B8954B] peer-checked:bg-[#B8954B]/10 peer-focus-visible:ring-2 peer-focus-visible:ring-[#B8954B] [&_.dot]:peer-checked:border-[#D6B66A] [&_.dot]:peer-checked:bg-[#D6B66A] [&_.label]:peer-checked:text-[#D6B66A] [&_.date]:peer-checked:text-[#F9FAFB]">
                                                <span
                                                    aria-hidden="true"
                                                    className="dot absolute right-3 top-3.5 h-2.5 w-2.5 rounded-full border border-[#9CA3AF]/60"
                                                />
                                                <span className="label pr-5 text-sm font-medium text-[#F9FAFB]">
                                                    {option.label}
                                                </span>
                                                <span className="date text-xs text-[#9CA3AF]">
                                                    {getOptionDateText(option)}
                                                </span>
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {interval === "custom" && (
                                    <div className="mt-5">
                                        <label
                                            htmlFor="custom-date"
                                            className="block text-sm text-[#9CA3AF]"
                                        >
                                            Review date
                                        </label>
                                        <input
                                            id="custom-date"
                                            type="date"
                                            value={customDate}
                                            min={minDate}
                                            onChange={handleDateChange}
                                            aria-invalid={dateError ? true : undefined}
                                            aria-describedby={dateError ? "date-error" : undefined}
                                            className={[
                                                "mt-2 w-full rounded-md border bg-[#111827] px-4 py-3 text-sm text-[#F9FAFB] [color-scheme:dark] focus:outline-none focus:ring-1 sm:w-72",
                                                dateError
                                                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                                                    : "border-[#374151] focus:border-[#B8954B] focus:ring-[#B8954B]",
                                            ].join(" ")}
                                        />
                                        {dateError && (
                                            <p id="date-error" className="mt-2 text-sm text-red-400">
                                                {dateError}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </fieldset>

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

                        {/* Footer / primary action */}
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