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
                <p className="text-sm text-[#9CA3AF]">Monday, November 16</p>
            </header>

            <section className="mt-8 rounded-xl bg-[#1F2937] p-6 sm:p-7">
                <h2 className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
                    Today
                </h2>
                <p className="mt-2 text-2xl font-medium text-[#F9FAFB]">
                    2 topics to review
                </p>
                {today.map(t =>
                    <DynamicBox key={t.id} review={t} />
                )}
            </section>

            <section className="mt-11">
                <h2 className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
                    Overdue · 2
                </h2>
                {past.map(p =>
                    <DynamicBox key={p.id} review={p} />
                )}
            </section>

            <section className="mt-10">
                <h2 className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
                    Upcoming · 4
                </h2>
                {future.map(f => 
                    <DynamicBox key={f.id} review={f} />
                )}
            </section>
            
        </div>
    );
}