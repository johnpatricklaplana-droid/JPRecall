import { useState } from "react";

type Status = "overdue" | "today" | "upcoming";
type Filter = "all" | Status;
type Topic = { id: number; name: string; offset: number };

// offset = days from today (negative = missed)
const TOPICS: Topic[] = [
    { id: 1, name: "Two Pointers", offset: -2 },
    { id: 2, name: "Sliding Window", offset: -1 },
    { id: 3, name: "Binary Search", offset: 0 },
    { id: 4, name: "Hash Maps", offset: 0 },
    { id: 5, name: "Stacks", offset: 1 },
    { id: 6, name: "Linked Lists", offset: 3 },
    { id: 7, name: "Dynamic Programming", offset: 7 },
];

const FILTERS: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "overdue", label: "Overdue" },
    { id: "today", label: "Today" },
    { id: "upcoming", label: "Upcoming" },
];

const GROUPS: { key: Status; title: string }[] = [
    { key: "overdue", title: "Overdue" },
    { key: "today", title: "Due today" },
    { key: "upcoming", title: "Upcoming" },
];

const dateFor = (offset: number) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + offset);
    return d;
};

const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });

const statusOf = (offset: number): Status =>
    offset < 0 ? "overdue" : offset === 0 ? "today" : "upcoming";

const pillText = (offset: number) => {
    if (offset < 0) {
        const n = Math.abs(offset);
        return `${n} ${n === 1 ? "day" : "days"} overdue`;
    }
    if (offset === 0) return "Due today";
    return `In ${offset} ${offset === 1 ? "day" : "days"}`;
};

const pillStyle: Record<Status, string> = {
    overdue: "border-red-400/40 bg-red-400/10 text-red-300",
    today: "border-[#B8954B]/50 bg-[#B8954B]/10 text-[#D6B66A]",
    upcoming: "border-[#374151] bg-[#111827] text-[#9CA3AF]",
};

export default function ReviewSchedulePage() {
    const [filter, setFilter] = useState<Filter>("all");

    const count = (s: Status) =>
        TOPICS.filter((t) => statusOf(t.offset) === s).length;

    const visibleGroups = GROUPS.filter(
        (g) => filter === "all" || filter === g.key
    )
        .map((g) => ({
            ...g,
            topics: TOPICS.filter((t) => statusOf(t.offset) === g.key).sort(
                (a, b) => a.offset - b.offset
            ),
        }))
        .filter((g) => g.topics.length > 0);

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-8 md:py-14 lg:px-12">
            <header className="border-b border-[#374151] pb-6">
                <h1 className="text-3xl font-semibold tracking-tight text-[#F9FAFB]">
                    Review Schedule
                </h1>
                <p className="mt-2 text-base text-[#9CA3AF]">
                    Topics waiting for review, ordered by due date.
                </p>
            </header>

            {/* Summary */}
            <dl className="mt-8 grid grid-cols-3 divide-x divide-[#374151] overflow-hidden rounded-lg border border-[#374151] bg-[#1F2937]">
                {[
                    { label: "Overdue", value: count("overdue") },
                    { label: "Due today", value: count("today") },
                    { label: "Upcoming", value: count("upcoming") },
                ].map((item) => (
                    <div key={item.label} className="px-5 py-4 sm:px-6">
                        <dt className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
                            {item.label}
                        </dt>
                        <dd className="mt-1 text-2xl font-semibold text-[#F9FAFB]">
                            {item.value}
                        </dd>
                    </div>
                ))}
            </dl>

            {/* Filters */}
            <div
                role="tablist"
                aria-label="Filter review schedule"
                className="mt-8 flex flex-wrap gap-2"
            >
                {FILTERS.map((f) => {
                    const selected = filter === f.id;
                    return (
                        <button
                            key={f.id}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            onClick={() => setFilter(f.id)}
                            className={[
                                "rounded-md border px-3.5 py-1.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8954B]",
                                selected
                                    ? "border-[#B8954B] bg-[#B8954B]/10 font-medium text-[#D6B66A]"
                                    : "border-[#374151] bg-[#1F2937] text-[#9CA3AF] hover:text-[#F9FAFB]",
                            ].join(" ")}
                        >
                            {f.label}
                        </button>
                    );
                })}
            </div>

            {/* List */}
            <div className="mt-6 space-y-8">
                {visibleGroups.length === 0 && (
                    <div className="rounded-lg border border-dashed border-[#374151] px-6 py-12 text-center text-sm text-[#9CA3AF]">
                        Nothing here. No topics match this filter.
                    </div>
                )}

                {visibleGroups.map((group) => (
                    <section key={group.key}>
                        <h2 className="px-1 pb-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
                            {group.title}
                        </h2>
                        <ul className="divide-y divide-[#374151] overflow-hidden rounded-lg border border-[#374151] bg-[#1F2937]">
                            {group.topics.map((topic) => (
                                <li
                                    key={topic.id}
                                    className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-base font-medium text-[#F9FAFB]">
                                            {topic.name}
                                        </p>
                                        <p className="mt-0.5 text-sm text-[#9CA3AF]">
                                            {formatDate(dateFor(topic.offset))}
                                        </p>
                                    </div>
                                    <span
                                        className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium ${pillStyle[statusOf(topic.offset)]}`}
                                    >
                                        {pillText(topic.offset)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
}