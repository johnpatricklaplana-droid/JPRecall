import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supbase";
import { getDateStatus, type DateStatus } from "../helpers/dateHelper";
import DynamicBox from "../components/DynamicBox";
import type { Review } from "../types/types";

export default function ReviewSchedulePage() {

    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const { data, error } = await supabase
                .from("to_review")
                .select("*");

            if (error) {
                console.error(error);
                return;
            }

            setReviews(data ?? []);
        };

        fetchReviews();
    }, []);

    const today = useMemo(() => {
        return reviews.filter(r => getDateStatus(r.scheduled_at) == 'today');
    }, [reviews]);

    const future = useMemo(() => {
        return reviews.filter(r => getDateStatus(r.scheduled_at) == 'future');
    }, [reviews]);

    const past = useMemo(() => {
        return reviews.filter(r => getDateStatus(r.scheduled_at) == 'past');
    }, [reviews]);

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8 md:py-14">
            <header className="flex items-baseline justify-between gap-4">
                <h1 className="text-base font-medium text-[#F9FAFB]">
                    Review Schedule
                </h1>
                <p className="text-sm text-[#9CA3AF]">{new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                })}</p>
            </header>

            <section className="mt-8">
                <h2 className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
                    Today
                </h2>
                <p className="mt-4 mb-2 text-xl font-medium text-[#F9FAFB]">
                    {today.length} topic {today.length > 1 ? 's' : ''} to review
                </p>
                <div className="grid grid-cols-2 gap-4">
                    {today.map(t =>
                        <DynamicBox key={t.id} review={t} />
                    )}
                </div>
            </section>

            <section className="mt-11">
                <h2 className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
                    Overdue · {past.length}
                </h2>
                <div className="space-y-4 mt-4">
                    {past.map(p =>
                        <DynamicBox key={p.id} review={p} />
                    )}
                </div>
            </section>

            <section className="mt-10">
                <h2 className="text-xs font-medium uppercase tracking-wider text-green-500">
                    Upcoming · {future.length}
                </h2>
                <div className="grid mt-4 grid-cols-2 gap-4">
                    {future.map(f =>
                        <DynamicBox key={f.id} review={f} />
                    )}
                </div>
            </section>
            
        </div>
    );
}