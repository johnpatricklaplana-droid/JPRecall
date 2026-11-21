import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supbase";
import { login } from "./services/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputBase =
    "mt-2 w-full rounded-md border bg-[#111827] px-4 py-3 text-base text-[#F9FAFB] placeholder:text-[#9CA3AF]/70 focus:outline-none focus:ring-1";
const inputOk =
    "border-[#374151] focus:border-[#B8954B] focus:ring-[#B8954B]";
const inputBad =
    "border-red-400 focus:border-red-400 focus:ring-red-400";

type LoginLocationState = {
    from?: string;
};

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (isMounted) {
                setIsAuthenticated(Boolean(data.session));
                setIsCheckingSession(false);
            }
        };

        void checkSession();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isCheckingSession) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#111827] text-sm text-[#9CA3AF]">
                Checking your session...
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/review" replace />;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoginError("");

        const trimmedEmail = email.trim();
        let isValid = true;

        if (!trimmedEmail) {
            setEmailError("Enter your email address.");
            isValid = false;
        } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
            setEmailError("Enter a valid email address.");
            isValid = false;
        } else {
            setEmailError("");
        }

        if (!password) {
            setPasswordError("Enter your password.");
            isValid = false;
        } else {
            setPasswordError("");
        }

        if (!isValid || isSubmitting) return;

        setIsSubmitting(true);

        try {
            await login(trimmedEmail, password);
            const state = location.state as LoginLocationState | null;
            navigate(state?.from ?? "/review", { replace: true });
        } catch (error) {
            console.error("Failed to log in:", error);
            setLoginError(
                error instanceof Error
                    ? error.message
                    : "Unable to log in. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#111827] px-4 py-12 text-[#F9FAFB]">
            <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-[#B8954B] text-sm font-semibold tracking-tight text-[#D6B66A]">
                    JP
                </span>
                <span className="text-lg font-semibold tracking-tight">JPRecall</span>
            </div>

            <div className="mt-8 w-full max-w-md rounded-lg border border-[#374151] bg-[#1F2937] p-6 sm:p-8">
                <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                <p className="mt-2 text-sm text-[#9CA3AF]">
                    Log in to continue reviewing your topics.
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                    <div>
                        <label htmlFor="login-email" className="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="login-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                setEmailError("");
                                setLoginError("");
                            }}
                            placeholder="you@example.com"
                            aria-invalid={!!emailError}
                            aria-describedby={emailError ? "login-email-error" : undefined}
                            className={`${inputBase} ${emailError ? inputBad : inputOk}`}
                        />
                        {emailError && (
                            <p id="login-email-error" className="mt-2 text-sm text-red-400">
                                {emailError}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="login-password" className="block text-sm font-medium">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    setPasswordError("");
                                    setLoginError("");
                                }}
                                placeholder="Enter your password"
                                aria-invalid={!!passwordError}
                                aria-describedby={passwordError ? "login-password-error" : undefined}
                                className={`${inputBase} pr-16 ${passwordError ? inputBad : inputOk}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((visible) => !visible)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-2 top-1/2 mt-1 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-[#9CA3AF] hover:text-[#F9FAFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8954B]"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {passwordError && (
                            <p id="login-password-error" className="mt-2 text-sm text-red-400">
                                {passwordError}
                            </p>
                        )}
                    </div>

                    {loginError && (
                        <div
                            role="alert"
                            className="rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-300"
                        >
                            {loginError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-[#B8954B] px-5 py-3 text-sm font-semibold text-[#111827] transition-colors hover:bg-[#D6B66A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B66A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F2937] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? "Logging in..." : "Log in"}
                    </button>
                </form>
            </div>

            <p className="mt-6 text-sm text-[#9CA3AF]">
                Don&apos;t have an account?{" "}
                <Link
                    to="/register"
                    className="font-medium text-[#D6B66A] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8954B]"
                >
                    Create one
                </Link>
            </p>
        </div>
    );
}
