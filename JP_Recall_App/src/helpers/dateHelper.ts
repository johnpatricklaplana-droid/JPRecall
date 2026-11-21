export type DateStatus = "today" | "future" | "past";

export const REVIEW_OPTIONS = [
    { id: "1d", label: "1 day", days: 1 },
    { id: "3d", label: "3 days", days: 3 },
    { id: "1w", label: "1 week", days: 7 },
    { id: "custom", label: "Custom date", days: null },
] as const;

export type ReviewIntervalId = (typeof REVIEW_OPTIONS)[number]["id"];

export const pad = (value: number) => String(value).padStart(2, "0");

export const toInputDate = (date: Date): string =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseInputDate = (value: string): Date | null => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
};

export const addDays = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return toInputDate(date);
};

export const formatDate = (
    value: string,
    options: Intl.DateTimeFormatOptions
): string => {
    const date = parseInputDate(value);
    return date ? date.toLocaleDateString("en-US", options) : "Pick a date";
};

export const getMinimumReviewDate = (): string => addDays(1);

export const resolveReviewDate = (
    interval: ReviewIntervalId,
    customDate: string
): string => {
    const selectedOption = REVIEW_OPTIONS.find((option) => option.id === interval);
    return interval === "custom"
        ? customDate
        : addDays(selectedOption?.days ?? 1);
};

export const getDateStatus = (date: string): DateStatus => {
    const now = new Date();

    const today = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
    ].join("-");

    if (date === today) return "today";
    if (date > today) return "future";
    return "past";
};