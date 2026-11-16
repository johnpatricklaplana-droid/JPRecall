import { getDateStatus } from "../helpers/dateHelper";
import type { Review } from "../types/types";

type DynamicBoxProps = {
    review: Review
};

export default function DynamicBox({ review }: Readonly<DynamicBoxProps>) {
    if(getDateStatus(review.scheduled_at) === 'today') {
        return (
            <div className="flex items-center justify-between gap-4 rounded-lg bg-[#111827]/60 px-4 py-3">
                <span className="min-w-0 truncate text-base text-[#F9FAFB]">
                    {review.name}
                </span>
                <button
                    type="button"
                    className="shrink-0 rounded-md border border-[#B8954B] px-3.5 py-1.5 text-sm font-medium text-[#D6B66A] transition-colors hover:bg-[#B8954B]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B66A]"
                >
                    Mark as reviewed
                </button>
            </div>
        );
    }
    if(getDateStatus(review.scheduled_at) === 'future') {
        return (
            <div className="mt-2 space-y-4">
                
                <div>
                    <p className="py-2 text-sm text-[#9CA3AF]">{review.scheduled_at}</p>
                    <p className="truncate py-2 text-sm text-[#D1D5DB]">{review.name}</p>
                </div>

            </div>
        );
    }
    if(getDateStatus(review.scheduled_at) === 'past') {
        return (
            <div className="flex items-center justify-between gap-4 py-2">
                <p className="min-w-0 truncate text-sm text-[#D1D5DB]">
                    {review.name}
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
            </div>
        );
    }
}