import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supbase";

type CallbackResult =
    | { success: true }
    | { success: false; message: string };

async function completeAuthCallback(): Promise<CallbackResult> {
    const callbackUrl = new URL(window.location.href);
    const hashParams = new URLSearchParams(callbackUrl.hash.slice(1));
    const providerError =
        callbackUrl.searchParams.get("error_description") ??
        callbackUrl.searchParams.get("error") ??
        hashParams.get("error_description") ??
        hashParams.get("error");

    if (providerError) {
        console.error("Authentication provider returned an error:", providerError);
        return {
            success: false,
            message: "Authentication was not completed. Please try again.",
        };
    }

    const code = callbackUrl.searchParams.get("code");
    if (!code) {
        console.error("Authentication callback did not include an authorization code.", {
            hasImplicitAccessToken: hashParams.has("access_token"),
        });
        return {
            success: false,
            message: "The sign-in response was incomplete. Please try again.",
        };
    }

    try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error("Failed to exchange authentication code:", error);
            return {
                success: false,
                message: "We couldn't verify your sign-in. Please try again.",
            };
        }

        if (!data.session) {
            return {
                success: false,
                message: "We couldn't establish your session. Please try again.",
            };
        }

        return { success: true };
    } catch (error) {
        console.error("Unexpected authentication callback error:", error);
        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
        };
    }
}

export default function AuthCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const callbackPromiseRef = useRef<Promise<CallbackResult> | null>(null);

    useEffect(() => {
        let isMounted = true;
        callbackPromiseRef.current ??= completeAuthCallback();

        void callbackPromiseRef.current.then((result) => {
            if (!isMounted) return;

            if (result.success) {
                navigate("/review", { replace: true });
            } else {
                setError(result.message);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#111827] px-4 py-12 text-[#F3F4F6]">
            <section
                role={error ? "alert" : "status"}
                aria-live={error ? "assertive" : "polite"}
                className="w-full max-w-md rounded-2xl border border-[#293648] bg-[#141D29] p-6 text-center shadow-xl shadow-black/20 sm:p-8"
            >
                {error ? (
                    <>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10 text-red-300">
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v4m0 4h.01M10.3 3.9 2.7 17.2A2 2 0 0 0 4.4 20h15.2a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z"
                                />
                            </svg>
                        </div>
                        <h1 className="mt-5 text-xl font-semibold tracking-tight">
                            Authentication unsuccessful
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
                            {error}
                        </p>
                        <Link
                            to="/login"
                            className="mt-6 inline-flex rounded-lg bg-[#B8954B] px-5 py-2.5 text-sm font-semibold text-[#111827] transition-colors hover:bg-[#D6B66A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B66A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141D29]"
                        >
                            Return to login
                        </Link>
                    </>
                ) : (
                    <>
                        <div
                            aria-hidden="true"
                            className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#344256] border-t-[#D6B66A] motion-reduce:animate-none"
                        />
                        <h1 className="mt-5 text-xl font-semibold tracking-tight">
                            Completing authentication
                        </h1>
                        <p className="mt-2 text-sm text-[#94A3B8]">
                            Please wait while we verify your account.
                        </p>
                    </>
                )}
            </section>
        </main>
    );
}