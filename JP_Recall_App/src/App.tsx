import { useEffect, useState, type ReactNode } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { supabase } from "./lib/supbase";
import LogStudyPage from "./pages/LogStudy";
import ReviewSchedulePage from "./pages/ReviewSched";
import Sidebar from "./components/Sidebar";
import RegisterPage from "./RegisterPage";
import AuthCallback from "./AuthCallback";
import LongTermMemoryPage from "./pages/LongTermMemo";
import LoginPage from "./LoginPage";

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

function FullPageStatus({ text }: Readonly<{ text: string }>) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#111827] text-sm text-[#9CA3AF]">
            {text}
        </div>
    );
}

function RootDestination() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (isMounted) {
                setIsAuthenticated(Boolean(data.session));
                setIsLoading(false);
            }
        };

        void loadSession();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) return <FullPageStatus text="Checking your session..." />;
    return <Navigate to={isAuthenticated ? "/review" : "/login"} replace />;
}

function ProtectedRoute({ children }: Readonly<{ children: ReactNode }>) {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (isMounted) {
                setIsAuthenticated(Boolean(data.session));
                setIsLoading(false);
            }
        };

        void loadSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (isMounted) {
                setIsAuthenticated(Boolean(session));
                setIsLoading(false);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    if (isLoading) return <FullPageStatus text="Checking your session..." />;
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return children;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* No sidebar */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth-callback" element={<AuthCallback />} />
                <Route path="/" element={<RootDestination />} />

                {/* With sidebar */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="/to-review" element={<LogStudyPage />} />
                    <Route path="/long-term-memory" element={<LongTermMemoryPage />} />
                    <Route path="/review" element={<ReviewSchedulePage />} />
                    <Route path="/my-topics" element={<div className="p-8 text-white">My Topics</div>} />
                    <Route path="/review-history" element={<div className="p-8 text-white">Review History</div>} />
                    <Route path="/statistics" element={<div className="p-8 text-white">Statistics</div>} />
                    <Route path="/settings" element={<div className="p-8 text-white">Settings</div>} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}