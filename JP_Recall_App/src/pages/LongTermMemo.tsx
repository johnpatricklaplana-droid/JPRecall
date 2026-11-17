
import { useMemo, useState } from "react";
import {
    BrainCircuit,
    Search,
    Ellipsis,
    RotateCcw,
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";

type MemoryTopic = {
    id: string;
    name: string;
    savedDate: string;
};

const initialTopics: MemoryTopic[] = [
    { id: "1", name: "Problem 1 – LeetCode", savedDate: "Nov 16" },
    { id: "2", name: "Dopamine – Psychology", savedDate: "Nov 15" },
    { id: "3", name: "Binary Search – Java", savedDate: "Nov 14" },
    { id: "4", name: "Photosynthesis – Biology", savedDate: "Nov 12" },
    { id: "5", name: "Two Pointers – LeetCode", savedDate: "Nov 10" },
];

export default function LongTermMemoryPage() {
    const [topics, setTopics] = useState(initialTopics);
    const [search, setSearch] = useState("");
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const filteredTopics = useMemo(
        () =>
            topics.filter((topic) =>
                topic.name.toLowerCase().includes(search.toLowerCase())
            ),
        [topics, search]
    );

    const handleDelete = (id: string) => {
        setTopics((current) => current.filter((topic) => topic.id !== id));
        setOpenMenu(null);
    };

    const handleAction = (action: string, topic: MemoryTopic) => {
        setOpenMenu(null);

        switch (action) {
            case "review":
                console.log("Review topic:", topic);
                break;
            case "details":
                console.log("View topic details:", topic);
                break;
            case "edit":
                console.log("Edit topic:", topic);
                break;
            case "test":
                console.log("Test with AI:", topic);
                break;
        }
    };

    return (
        <main className="min-h-screen bg-[#080D13] px-5 py-8 text-[#E6EAF0] sm:px-8 lg:px-10">
            <div className="mx-auto max-w-6xl space-y-7">

                {/* Header */}
                <header className="flex items-center justify-between">
                    <div>
                        <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-[#C6A45D]">
                            KNOWLEDGE ARCHIVE / 001
                        </p>

                        <h1 className="text-2xl font-semibold tracking-tight text-[#E6EAF0] sm:text-3xl">
                            Memory Library
                        </h1>

                        <p className="mt-2 text-sm text-[#8794A4]">
                            Everything you've learned, organized for recall.
                        </p>
                    </div>

                    <BrainCircuit
                        size={34}
                        strokeWidth={1.5}
                        className="text-[#D3AD5B]"
                    />
                </header>

                <div className="border-t border-[#34404D]" />

                {/* Statistics */}
                <section className="grid grid-cols-3 py-2">
                    <div>
                        <p className="text-2xl font-semibold tabular-nums text-[#E4E8EE]">
                            {String(topics.length).padStart(3, "0")}
                        </p>
                        <p className="mt-1 text-[10px] font-medium tracking-wider text-[#8794A4]">
                            STORED
                        </p>
                    </div>

                    <div className="border-x border-[#35414D] px-5 sm:px-8">
                        <p className="text-2xl font-semibold tabular-nums text-[#D5B15E]">
                            04
                        </p>
                        <p className="mt-1 text-[10px] font-medium tracking-wider text-[#8794A4]">
                            THIS MONTH
                        </p>
                    </div>

                    <div className="pl-5 text-right sm:pl-8">
                        <p className="text-2xl font-semibold tabular-nums text-[#B7C3D1]">
                            {String(topics.length).padStart(3, "0")}
                        </p>
                        <p className="mt-1 text-[10px] font-medium tracking-wider text-[#8794A4]">
                            AI ACCESSIBLE
                        </p>
                    </div>
                </section>

                <div className="border-t border-[#34404D]" />

                {/* Search */}
                <div className="flex items-center gap-3 rounded-lg border border-[#293746] bg-[#151F2B] px-4 py-3.5 transition-colors focus-within:border-[#526477]">
                    <Search size={18} className="shrink-0 text-[#8292A5]" />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Find something you've learned..."
                        className="w-full bg-transparent text-sm text-[#DCE2E9] outline-none placeholder:text-[#8795A7]"
                    />
                </div>

                {/* Topic List */}
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-[#E1E6ED]">
                            All saved knowledge
                        </h2>

                        <span className="text-xs tabular-nums text-[#8997A9]">
                            {filteredTopics.length} entries
                        </span>
                    </div>

                    {/* Table Header */}
                    <div className="flex items-center border-b border-[#35414D] py-3">
                        <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-semibold tracking-wider text-[#8795A7]">
                                TOPIC
                            </span>
                        </div>

                        <div className="w-[100px] shrink-0">
                            <span className="text-[10px] font-semibold tracking-wider text-[#8795A7]">
                                SAVED
                            </span>
                        </div>

                        <div className="w-[180px] shrink-0 text-right">
                            <span className="text-[10px] font-semibold tracking-wider text-[#8795A7]">
                                ACTION
                            </span>
                        </div>
                    </div>

                    {/* Topic Rows */}
                    {filteredTopics.length > 0 ? (
                        filteredTopics.map((topic) => (
                            <div
                                key={topic.id}
                                className="relative flex items-center border-b border-[#202A35] py-4"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-[#DCE2E9]">
                                        {topic.name}
                                    </p>
                                </div>

                                <div className="w-[100px] shrink-0">
                                    <p className="text-xs tabular-nums text-[#8795A7]">
                                        {topic.savedDate}
                                    </p>
                                </div>

                                <div className="flex w-[180px] shrink-0 items-center justify-end gap-3">
                                    {/* Test with AI */}
                                    <button
                                        type="button"
                                        onClick={() => handleAction("test", topic)}
                                        className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#C4CDD8] transition-colors hover:bg-[#1B2734] hover:text-white"
                                    >
                                        <BrainCircuit size={16} strokeWidth={1.8} />
                                        Test with AI
                                    </button>

                                    {/* More Actions */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            aria-label={`More actions for ${topic.name}`}
                                            aria-expanded={openMenu === topic.id}
                                            onClick={() =>
                                                setOpenMenu((current) =>
                                                    current === topic.id ? null : topic.id
                                                )
                                            }
                                            className="rounded-md p-2 text-[#8795A7] transition-colors hover:bg-[#1B2734] hover:text-white"
                                        >
                                            <Ellipsis size={19} />
                                        </button>

                                        {openMenu === topic.id && (
                                            <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-[#303B48] bg-[#111A24] p-1 shadow-xl">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAction("review", topic)}
                                                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[#C4CDD8] hover:bg-[#1D2A38] hover:text-white"
                                                >
                                                    <RotateCcw size={15} />
                                                    Review
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleAction("details", topic)}
                                                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[#C4CDD8] hover:bg-[#1D2A38] hover:text-white"
                                                >
                                                    <Eye size={15} />
                                                    View Details
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleAction("edit", topic)}
                                                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[#C4CDD8] hover:bg-[#1D2A38] hover:text-white"
                                                >
                                                    <Pencil size={15} />
                                                    Edit
                                                </button>

                                                <div className="my-1 border-t border-[#303B48]" />

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(topic.id)}
                                                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
                                                >
                                                    <Trash2 size={15} />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <Search size={22} className="mx-auto mb-3 text-[#64748B]" />
                            <p className="text-sm text-[#A0ADBC]">
                                No matching topics found.
                            </p>
                        </div>
                    )}
                </section>

                <p className="text-right text-xs text-[#7F8D9F]">
                    Showing {filteredTopics.length} of {topics.length} entries
                </p>
            </div>
        </main>
    );
}
