import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { loginWithGoogle, register } from "./services/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputBase =
    "mt-2 w-full rounded-md border bg-[#111827] px-4 py-3 text-base text-[#F9FAFB] placeholder:text-[#9CA3AF]/70 focus:outline-none focus:ring-1";
const inputOk = "border-[#374151] focus:border-[#B8954B] focus:ring-[#B8954B]";
const inputBad = "border-red-400 focus:border-red-400 focus:ring-red-400";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [authError, setAuthError] = useState("");
    const [done, setDone] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setDone(false);
        setAuthError("");

        const trimmed = email.trim();
        let valid = true;

        if (!trimmed) {
            setEmailError("Enter your email address.");
            valid = false;
        } else if (!EMAIL_PATTERN.test(trimmed)) {
            setEmailError("Enter a valid email address.");
            valid = false;
        } else {
            setEmailError("");
        }

        if (!password) {
            setPasswordError("Enter a password.");
            valid = false;
        } else if (password.length < 8) {
            setPasswordError("Use at least 8 characters.");
            valid = false;
        } else {
            setPasswordError("");
        }

        if (!valid) return;

        try {
            const data = await register(email, password);
            setDone(true);
        } catch (error) {
            console.error("Failed to create account:", error);
            setAuthError(
                error instanceof Error
                    ? error.message
                    : "Unable to create your account. Please try again."
            );
        }
    };

    const handleGoogle = async () => {
        setAuthError("");
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error("Failed to start Google sign-up:", error);
            setAuthError(
                error instanceof Error
                    ? error.message
                    : "Unable to continue with Google. Please try again."
            );
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#111827] px-4 py-12 text-[#F9FAFB]">
            {/* Brand */}
            <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-[#B8954B] text-sm font-semibold tracking-tight text-[#D6B66A]">
                    JP
                </span>
                <span className="text-lg font-semibold tracking-tight">JPRecall</span>
            </div>

            <div className="mt-8 w-full max-w-md rounded-lg border border-[#374151] bg-[#1F2937] p-6 sm:p-8">
                <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
                <p className="mt-2 text-sm text-[#9CA3AF]">
                    Start tracking what you study and when to review it.
                </p>

                {/* Google */}
                <button
                    type="button"
                    onClick={handleGoogle}
                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-md border border-[#374151] bg-[#111827] px-4 py-3 text-sm font-medium text-[#F9FAFB] transition-colors hover:border-[#9CA3AF]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8954B]"
                >
                    <span
                        aria-hidden="true"
                        className="flex h-5 w-5 items-center justify-center rounded-full border border-[#9CA3AF]/60 text-[11px] font-semibold text-[#F9FAFB]"
                    >
                        G
                    </span>
                    Sign up with Google
                </button>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                    <span className="h-px flex-1 bg-[#374151]" />
                    <span className="text-xs uppercase tracking-wider text-[#9CA3AF]">or</span>
                    <span className="h-px flex-1 bg-[#374151]" />
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError("");
                                setDone(false);
                            }}
                            placeholder="you@example.com"
                            aria-invalid={emailError ? true : undefined}
                            aria-describedby={emailError ? "email-error" : undefined}
                            className={`${inputBase} ${emailError ? inputBad : inputOk}`}
                        />
                        {emailError && (
                            <p id="email-error" className="mt-2 text-sm text-red-400">
                                {emailError}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError("");
                                    setDone(false);
                                }}
                                placeholder="At least 8 characters"
                                aria-invalid={passwordError ? true : undefined}
                                aria-describedby={passwordError ? "password-error" : "password-hint"}
                                className={`${inputBase} pr-16 ${passwordError ? inputBad : inputOk}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-2 top-1/2 mt-1 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-[#9CA3AF] hover:text-[#F9FAFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8954B]"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {passwordError ? (
                            <p id="password-error" className="mt-2 text-sm text-red-400">
                                {passwordError}
                            </p>
                        ) : (
                            <p id="password-hint" className="mt-2 text-xs text-[#9CA3AF]">
                                Use 8 or more characters.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-[#B8954B] px-5 py-3 text-sm font-semibold text-[#111827] transition-colors hover:bg-[#D6B66A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B66A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F2937]"
                    >
                        Create account
                    </button>

                    {authError && (
                        <div
                            role="alert"
                            className="rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-sm text-red-300"
                        >
                            {authError}
                        </div>
                    )}

                    <div role="status" aria-live="polite">
                        {done && (
                            <p className="flex items-start gap-2 text-sm text-[#D6B66A]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                    className="mt-0.5 h-4 w-4 shrink-0"
                                >
                                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                                </svg>
                                <span>Account details look good.</span>
                            </p>
                        )}
                    </div>
                </form>
            </div>

            <p className="mt-6 text-sm text-[#9CA3AF]">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-medium text-[#D6B66A] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8954B]"
                >
                    Log in
                </Link>
            </p>
        </div>
    );
}