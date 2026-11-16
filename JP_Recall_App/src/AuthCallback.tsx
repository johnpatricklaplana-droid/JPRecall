import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supbase";

export default function AuthCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function handleCallback() {
            const code = new URLSearchParams(window.location.search).get("code");

            if (!code) {
                setError("Confirmation code is missing.");
                return;
            }

            const { data, error } = await supabase.auth.exchangeCodeForSession(code);

            if (error) {
                setError(error.message);
                return;
            }

            if (!data.session) {
                setError("Unable to establish your session.");
                return;
            }

            navigate("/to-review", { replace: true });
        }

        handleCallback();
    }, [navigate]);

    if (error) return <p>{error}</p>;

    return <p>Verifying your email...</p>;
}