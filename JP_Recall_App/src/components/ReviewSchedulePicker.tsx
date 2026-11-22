import {
    REVIEW_OPTIONS,
    addDays,
    formatDate,
    getMinimumReviewDate,
    type ReviewIntervalId,
} from "../helpers/dateHelper";

type ReviewSchedulePickerProps = {
    groupName: string;
    interval: ReviewIntervalId;
    customDate: string;
    dateError: string;
    onIntervalChange: (interval: ReviewIntervalId) => void;
    onCustomDateChange: (date: string) => void;
};

export default function ReviewSchedulePicker({
    groupName,
    interval,
    customDate,
    dateError,
    onIntervalChange,
    onCustomDateChange,
}: Readonly<ReviewSchedulePickerProps>) {
    const minDate = getMinimumReviewDate();

    const getOptionDateText = (
        option: (typeof REVIEW_OPTIONS)[number]
    ): string => {
        if (option.days !== null) {
            return formatDate(
                addDays(option.days),
                {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                }
            );
        }

        return customDate >= minDate
            ? formatDate(customDate, {
                weekday: "short",
                month: "short",
                day: "numeric",
            })
            : "Pick a date";
    };

    return (
        <fieldset>
            <legend className="text-sm font-medium text-[#E5E7EB]">
                When should you review it?
            </legend>

            <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {REVIEW_OPTIONS.map((option) => (
                    <label key={option.id} className="block cursor-pointer">
                        <input
                            type="radio"
                            name={groupName}
                            value={option.id}
                            checked={interval === option.id}
                            onChange={() => onIntervalChange(option.id)}
                            className="peer sr-only"
                        />
                        <span className="group relative flex h-full flex-col gap-1 rounded-lg border border-[#344256] bg-[#111923] px-4 py-4 transition-colors hover:border-[#B8954B]/60 peer-checked:border-[#B8954B] peer-checked:bg-[#B8954B]/10 peer-focus-visible:ring-2 peer-focus-visible:ring-[#B8954B] [&_.dot]:peer-checked:border-[#D6B66A] [&_.dot]:peer-checked:bg-[#D6B66A] [&_.label]:peer-checked:text-[#D6B66A] [&_.date]:peer-checked:text-[#F3F4F6]">
                            <span
                                aria-hidden="true"
                                className="dot absolute right-3 top-3.5 h-2.5 w-2.5 rounded-full border border-[#8291A5]/60"
                            />
                            <span className="label pr-5 text-sm font-medium text-[#E5E7EB]">
                                {option.label}
                            </span>
                            <span className="date text-xs text-[#8291A5]">
                                {getOptionDateText(option)}
                            </span>
                        </span>
                    </label>
                ))}
            </div>

            {interval === "custom" && (
                <div className="mt-5">
                    <label
                        htmlFor={`${groupName}-custom-date`}
                        className="block text-sm text-[#8291A5]"
                    >
                        Review date
                    </label>
                    <input
                        id={`${groupName}-custom-date`}
                        type="date"
                        value={customDate}
                        min={minDate}
                        onChange={(event) => onCustomDateChange(event.target.value)}
                        aria-invalid={!!dateError}
                        aria-describedby={dateError ? `${groupName}-date-error` : undefined}
                        className={`mt-2 w-full rounded-lg border bg-[#111923] px-4 py-3 text-sm text-[#F3F4F6] [color-scheme:dark] focus:outline-none focus:ring-1 sm:w-72 ${
                            dateError
                                ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                                : "border-[#344256] focus:border-[#B8954B] focus:ring-[#B8954B]"
                        }`}
                    />
                </div>
            )}

            {dateError && (
                <p
                    id={`${groupName}-date-error`}
                    role="alert"
                    className="mt-2 text-sm text-red-300"
                >
                    {dateError}
                </p>
            )}
        </fieldset>
    );
}
