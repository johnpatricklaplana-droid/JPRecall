import { getDateStatus } from "../helpers/dateHelper";
import type { Review } from "../types/types";

type DynamicBoxProps = {
    review: Review
};

export default function DynamicBox({ review }: Readonly<DynamicBoxProps>) {
    if(getDateStatus(review.scheduled_at) === 'today') {
        return (
            <section className="mt-8 rounded-xl bg-[#1F2937] p-6 sm:p-7">
                <h2 className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
                    Today
                </h2>
                <p className="mt-2 text-2xl font-medium text-[#F9FAFB]">
                    2 topics to review
                </p>

                <ul className="mt-6 space-y-2">
                    <li className="flex items-center justify-between gap-4 rounded-lg bg-[#111827]/60 px-4 py-3">
                        <span className="min-w-0 truncate text-base text-[#F9FAFB]">
                            Binary Search
                        </span>
                        <button
                            type="button"
                            className="shrink-0 rounded-md border border-[#B8954B] px-3.5 py-1.5 text-sm font-medium text-[#D6B66A] transition-colors hover:bg-[#B8954B]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B66A]"
                        >
                            Mark as reviewed
                        </button>
                    </li>

                    <li className="flex items-center justify-between gap-4 rounded-lg bg-[#111827]/60 px-4 py-3">
                        <span className="min-w-0 truncate text-base text-[#F9FAFB]">
                            Hash Maps
                        </span>
                        <button
                            type="button"
                            className="shrink-0 rounded-md border border-[#B8954B] px-3.5 py-1.5 text-sm font-medium text-[#D6B66A] transition-colors hover:bg-[#B8954B]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B66A]"
                        >
                            Mark as reviewed
                        </button>
                    </li>

                    <li className="flex items-center justify-between gap-4 rounded-lg bg-[#111827]/35 px-4 py-3">
                        <span className="min-w-0 truncate text-base text-[#9CA3AF] line-through decoration-[#4B5563]">
                            Graphs
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5 text-sm text-[#9CA3AF]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                                className="h-4 w-4 text-[#D6B66A]"
                            >
                                <path d="M5 12.5l4.5 4.5L19 7.5" />
                            </svg>
                            Reviewed
                        </span>
                    </li>
                </ul>
            </section>
        );
    }
    if(getDateStatus(review.scheduled_at) === 'future') {
        return (
            <section className="mt-10">
                <h2 className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
                    Upcoming · 4
                </h2>

                <div className="mt-2 space-y-4">
                    <div>
                        <p className="py-2 text-sm text-[#9CA3AF]">Tomorrow</p>
                        <ul>
                            <li className="truncate py-2 text-sm text-[#D1D5DB]">Stacks</li>
                        </ul>
                    </div>

                    <div>
                        <p className="py-2 text-sm text-[#9CA3AF]">Thu, Nov 19</p>
                        <ul>
                            <li className="truncate py-2 text-sm text-[#D1D5DB]">Linked Lists</li>
                            <li className="truncate py-2 text-sm text-[#D1D5DB]">Dynamic Programming</li>
                        </ul>
                    </div>

                    <div>
                        <p className="py-2 text-sm text-[#9CA3AF]">Mon, Nov 23</p>
                        <ul>
                            <li className="truncate py-2 text-sm text-[#D1D5DB]">Heaps</li>
                        </ul>
                    </div>
                </div>
            </section>
        );
    }
    if(getDateStatus(review.scheduled_at) === 'past') {
        return (
            <section className="mt-11">
                <h2 className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
                    Overdue · 2
                </h2>
                <ul className="mt-2">
                    <li className="flex items-center justify-between gap-4 py-2">
                        <p className="min-w-0 truncate text-sm text-[#D1D5DB]">
                            Two Pointers
                        </p>
                        <div className="flex shrink-0 items-center gap-5">
                            <span className="text-sm text-[#9CA3AF]">2 days overdue</span>
                            <button
                                type="button"
                                className="rounded text-sm text-[#D6B66A] transition-colors hover:text-[#F9FAFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B66A]"
                            >
                                Mark as reviewed
                            </button>
                        </div>
                    </li>

                    <li className="flex items-center justify-between gap-4 py-2">
                        <p className="min-w-0 truncate text-sm text-[#D1D5DB]">
                            Sliding Window
                        </p>
                        <div className="flex shrink-0 items-center gap-5">
                            <span className="text-sm text-[#9CA3AF]">1 day overdue</span>
                            <button
                                type="button"
                                className="rounded text-sm text-[#D6B66A] transition-colors hover:text-[#F9FAFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B66A]"
                            >
                                Mark as reviewed
                            </button>
                        </div>
                    </li>
                </ul>
            </section>
        );
    }
}