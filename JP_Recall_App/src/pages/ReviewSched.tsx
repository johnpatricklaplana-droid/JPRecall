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

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8 md:py-14">
            <header className="flex items-baseline justify-between gap-4">
                <h1 className="text-base font-medium text-[#F9FAFB]">
                    Review Schedule
                </h1>
                <p className="text-sm text-[#9CA3AF]">Monday, November 16</p>
            </header>

            {reviews.map(r => 
                <DynamicBox review={r} />
            )}
            
        </div>
    );
}