import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import LogStudyPage from "./pages/LogStudy";
import ReviewSchedulePage from "./pages/ReviewSched";
import Sidebar from "./components/Sidebar";
import RegisterPage from "./RegisterPage";
import AuthCallback from "./AuthCallback";
import LongTermMemoryPage from "./pages/LongTermMemo";

function Layout() {
    return (
        <div>
            <Sidebar />

            <main className="md:pl-64 bg-[#111827] min-h-screen">
                <Outlet />
            </main>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* No sidebar */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth-callback" element={<AuthCallback />} />

                {/* With sidebar */}
                <Route element={<Layout />}>
                    <Route path="/to-review" element={<LogStudyPage />} />
                    <Route path="/long-term-memory" element={<LongTermMemoryPage />} />
                    <Route path="/review" element={<ReviewSchedulePage />} />
                    <Route path="/my-topics" element={<div className="p-8 text-white">My Topics</div>} />
                    <Route path="/review-history" element={<div className="p-8 text-white">Review History</div>} />
                    <Route path="/statistics" element={<div className="p-8 text-white">Statistics</div>} />
                    <Route path="/settings" element={<div className="p-8 text-white">Settings</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}