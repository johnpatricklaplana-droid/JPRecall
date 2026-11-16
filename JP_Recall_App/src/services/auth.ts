import { supabase } from "../lib/supbase";

export async function register(email: string, password: string) {
    
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            emailRedirectTo: "http://localhost:5173/auth/callback"
        }
    });

    if(error) {
        throw error;
    }

    return data;

}