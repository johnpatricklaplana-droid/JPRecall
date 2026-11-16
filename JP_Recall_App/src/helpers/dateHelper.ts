export type DateStatus = "today" | "future" | "past";

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