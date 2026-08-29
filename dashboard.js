const SUPABASE_URL = "https://gqdclkxaxukvswiozgun.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_ZEBgVQwsdSYjjMq2F1WKZw_TD_fEFVC";

const supabaseClient = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY
);

async function loadDashboard() {

console.log("🌱 Loading AgroGuide AI dashboard...");

const { data, error } =
await supabaseClient.auth.getUser();

if (error || !data.user) {

```
console.log("No logged in user.");

window.location.href = "auth.html";

return;
```

}

const user = data.user;

console.log("Logged in user:", user);

const fullName =
user.user_metadata?.full_name ||
user.user_metadata?.name ||
user.email.split("@")[0];

document.getElementById("userName").textContent =
fullName;

document.getElementById("userEmail").textContent =
user.email;

}

/* LOGOUT */

document
.getElementById("logoutButton")
.addEventListener("click", async () => {

```
await supabaseClient.auth.signOut();

window.location.href = "index.html";
```

});

/* REGISTER FARM BUTTONS */

function openFarmRegistration() {

alert(
"Farm Registration is the next feature we are building! 🚜🌾"
);

}

document
.getElementById("registerFarmButton")
.addEventListener(
"click",
openFarmRegistration
);

document
.getElementById("quickFarmButton")
.addEventListener(
"click",
openFarmRegistration
);

loadDashboard();
