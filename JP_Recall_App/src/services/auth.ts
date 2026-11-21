import { supabase } from "../lib/supbase";

export async function register(email: string, password: string) {
    
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            emailRedirectTo: `${window.location.origin}/auth-callback`
        }
    });

    if(error) {
        throw error;
    }

    return data;

}

export async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
    });

    if (error) {
        throw error;
    }

    return data;
}