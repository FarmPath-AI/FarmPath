const SUPABASE_URL = "https://gqdclkxaxukvswiozgun.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_ZEBgVQwsdSYjjMq2F1WKZw_TD_fEFVC";

const supabaseClient = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY,
{
auth: {
persistSession: true,
autoRefreshToken: true,
detectSessionInUrl: true
}
}
);

console.log("AgroGuide AI authentication loaded successfully");

const tabs = document.querySelectorAll(".auth-tab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const authMessage = document.getElementById("authMessage");
const googleLoginButton = document.getElementById("googleLoginButton");

function showMessage(message, type = "error") {
authMessage.textContent = message;
authMessage.className = `message ${type}`;
}

function clearMessage() {
authMessage.textContent = "";
authMessage.className = "message";
}

/* SWITCH LOGIN / SIGNUP */

tabs.forEach((tab) => {
tab.addEventListener("click", () => {
clearMessage();

```
tabs.forEach((item) => {
  item.classList.remove("active");
});

tab.classList.add("active");

if (tab.dataset.form === "login") {
  loginForm.classList.add("active");
  signupForm.classList.remove("active");
} else {
  signupForm.classList.add("active");
  loginForm.classList.remove("active");
}
```

});
});

/* LOGIN */

loginForm.addEventListener("submit", async (event) => {
event.preventDefault();

clearMessage();

const email = document
.getElementById("loginEmail")
.value
.trim();

const password = document
.getElementById("loginPassword")
.value;

const button =
loginForm.querySelector('button[type="submit"]');

button.disabled = true;
button.textContent = "Logging in...";

try {
const { data, error } =
await supabaseClient.auth.signInWithPassword({
email: email,
password: password
});

```
if (error) {
  showMessage(error.message);

  button.disabled = false;
  button.textContent = "Log In →";
  return;
}

if (!data.session) {
  showMessage("Login succeeded, but no session was created.");

  button.disabled = false;
  button.textContent = "Log In →";
  return;
}

showMessage(
  "Login successful! Opening dashboard...",
  "success"
);

window.location.href = "dashboard.html";
```

} catch (error) {
console.error(error);

```
showMessage("Something went wrong. Please try again.");

button.disabled = false;
button.textContent = "Log In →";
```

}
});

/* CREATE ACCOUNT */

signupForm.addEventListener("submit", async (event) => {
event.preventDefault();

clearMessage();

const fullName =
document.getElementById("signupName").value.trim();

const email =
document.getElementById("signupEmail").value.trim();

const password =
document.getElementById("signupPassword").value;

const button =
signupForm.querySelector('button[type="submit"]');

button.disabled = true;
button.textContent = "Creating account...";

try {
const { data, error } =
await supabaseClient.auth.signUp({
email: email,
password: password,
options: {
data: {
full_name: fullName
}
}
});

```
if (error) {
  showMessage(error.message);

  button.disabled = false;
  button.textContent = "Create My Account →";
  return;
}

if (data.session) {
  showMessage(
    "Account created! Opening dashboard...",
    "success"
  );

  window.location.href = "dashboard.html";
  return;
}

showMessage(
  "Account created successfully. Please log in.",
  "success"
);

button.disabled = false;
button.textContent = "Create My Account →";
```

} catch (error) {
console.error(error);

```
showMessage("Something went wrong. Please try again.");

button.disabled = false;
button.textContent = "Create My Account →";
```

}
});

/* GOOGLE LOGIN */

if (googleLoginButton) {
googleLoginButton.addEventListener("click", async () => {

```
clearMessage();

googleLoginButton.disabled = true;

googleLoginButton.innerHTML =
  '<span class="google-g">G</span> Connecting to Google...';

try {
  const { error } =
    await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          "https://farmpath-ai.github.io/AgroGuide-AI/dashboard.html"
      }
    });

  if (error) {
    console.error(error);

    showMessage(error.message);

    googleLoginButton.disabled = false;

    googleLoginButton.innerHTML =
      '<span class="google-g">G</span> Continue with Google';
  }

} catch (error) {
  console.error(error);

  showMessage("Google login failed. Please try again.");

  googleLoginButton.disabled = false;

  googleLoginButton.innerHTML =
    '<span class="google-g">G</span> Continue with Google';
}
```

});
});

/* CHECK SESSION */

async function checkExistingSession() {
const { data } =
await supabaseClient.auth.getSession();

if (data && data.session) {
console.log("Existing login session found.");
}
}

checkExistingSession();
