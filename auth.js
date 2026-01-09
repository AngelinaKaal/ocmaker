// --- SIGN UP FUNCTION ---
async function handleSignUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    const { data, error } = await _supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: { display_name: username } 
        }
    });

    if (error) {
        alert("Sign Up Error: " + error.message);
    } else {
        alert("Check your email to confirm your account!");
    }
}

// --- LOGIN FUNCTION ---
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert("Login Error: " + error.message);
    } else {
        // Redirect to your main gallery page after successful login
        window.location.href = "Main.html"; 
    }
}

// --- LOGOUT FUNCTION ---
async function handleSignOut() {
    const { error } = await _supabase.auth.signOut();
    if (error) alert(error.message);
    else window.location.href = "Login.html";
}