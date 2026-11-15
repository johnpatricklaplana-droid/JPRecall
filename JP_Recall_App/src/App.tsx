import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar";
import LogStudyPage from "./pages/LogStudy";
import ReviewSchedulePage from "./pages/ReviewSched";

function Layout() {
    return (
        <div>
            <Sidebar />

            <main className="md:pl-64 bg-[#111827] min-h-screen">
                <Routes>
                    <Route path="/to-review" element={<LogStudyPage />} />
                    <Route path="/review" element={<ReviewSchedulePage />} />
                    <Route path="/my-topics" element={<div className="p-8 text-white">My Topics</div>} />
                    <Route path="/review-history" element={<div className="p-8 text-white">Review History</div>} />
                    <Route path="/statistics" element={<div className="p-8 text-white">Statistics</div>} />
                    <Route path="/settings" element={<div className="p-8 text-white">Settings</div>} />
                </Routes>
            </main>

        </div>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    )
}