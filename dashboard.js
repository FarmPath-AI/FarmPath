const SUPABASE_URL = "https://gqdclkxaxukvswiozgun.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_ZEBgVQwsdSYjjMq2F1WKZw_TD_fEFVC";

const supabaseClient =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY
);

let currentUser = null;

/* LOAD USER */

async function initializeDashboard() {

const { data, error } =
await supabaseClient.auth.getUser();

if (error || !data.user) {

window.location.href = "auth.html";

return;

}

currentUser = data.user;

const name =
currentUser.user_metadata?.full_name ||
currentUser.user_metadata?.name ||
currentUser.email.split("@")[0];

document.getElementById("userName").textContent =
name;

document.getElementById("userEmail").textContent =
currentUser.email;

loadFarms();

}

/* MODAL */

const farmModal =
document.getElementById("farmModal");

document
.getElementById("registerFarmButton")
.addEventListener("click", () => {

farmModal.classList.add("show");

});

document
.getElementById("closeModal")
.addEventListener("click", () => {

farmModal.classList.remove("show");

});

farmModal.addEventListener("click", (event) => {

if (event.target === farmModal) {

farmModal.classList.remove("show");

}

});

/* SAVE FARM */

document
.getElementById("farmForm")
.addEventListener("submit", async (event) => {

event.preventDefault();

const button =
document.getElementById("saveFarmButton");

const message =
document.getElementById("farmMessage");

button.disabled = true;

button.textContent =
"Saving your farm...";

const farm = {

user_id: currentUser.id,

farm_name:
document.getElementById("farmName").value.trim(),

location:
document.getElementById("farmLocation").value.trim(),

farm_size:
Number(
document.getElementById("farmSize").value
),

size_unit:
"hectares",

soil_type:
document.getElementById("soilType").value,

crop:
document.getElementById("farmCrop").value,

farming_history:
document.getElementById("farmHistory").value.trim()

};

const { error } =
await supabaseClient
.from("farms")
.insert([farm]);

if (error) {

console.error(error);

message.textContent =
"Error: " + error.message;

message.style.color = "red";

button.disabled = false;

button.textContent =
"Save Farm & Generate Plan 🌾";

return;

}

message.textContent =
"Farm saved successfully! 🌱";

message.style.color =
"#167a45";

document
.getElementById("farmForm")
.reset();

button.disabled = false;

button.textContent =
"Save Farm & Generate Plan 🌾";

await loadFarms();

setTimeout(() => {

farmModal.classList.remove("show");

message.textContent = "";

}, 1500);

});

/* LOAD FARMS */

async function loadFarms() {

if (!currentUser) return;

const { data, error } =
await supabaseClient
.from("farms")
.select("*")
.eq("user_id", currentUser.id)
.order("created_at", {
ascending: false
});

if (error) {

console.error(error);

return;

}

const farmList =
document.getElementById("farmList");

const farmCount =
document.getElementById("farmCount");

farmCount.textContent =
data.length;

document.getElementById("planCount").textContent =
data.length;

if (data.length === 0) {

farmList.innerHTML = `

<div class="empty">

No farms registered yet.

<br><br>

Click <strong>Register Your Farm</strong>
to begin your farming journey 🌾

</div>

`;

return;

}

farmList.innerHTML =
data.map(farm => `

<div class="farm-card">

<h3>
🌾 ${farm.farm_name}
</h3>

<p>
📍 ${farm.location || "Location not provided"}
</p>

<p>
📏 ${farm.farm_size || 0} hectares
</p>

<p>
🌱 Crop: ${farm.crop}
</p>

<p>
🟤 Soil: ${farm.soil_type || "Unknown"}
</p>

<button onclick="generatePlan('${farm.id}')">
View Farm Plan 🤖
</button>

</div>

`).join("");

}

/* FARM PLAN */

window.generatePlan =
async function(farmId) {

const { data, error } =
await supabaseClient
.from("farms")
.select("*")
.eq("id", farmId)
.single();

if (error) {

alert(error.message);

return;

}

const plan = `

🌾 FARM PLAN FOR ${data.farm_name}

1️⃣ LAND PREPARATION

Clear unwanted vegetation and prepare the soil before planting.

2️⃣ SOIL PREPARATION

Your recorded soil type is ${data.soil_type}.

Consider carrying out a proper soil test for precise fertilizer recommendations.

3️⃣ CROP

Selected crop: ${data.crop}.

Use certified, healthy seeds or planting materials.

4️⃣ PLANTING

Plant at the beginning of suitable rainfall or use irrigation.

Maintain recommended spacing and plant population.

5️⃣ CROP MANAGEMENT

Monitor weeds, pests and diseases regularly.

Apply fertilizer based on soil and crop requirements.

6️⃣ HARVESTING

Monitor crop maturity and harvest at the appropriate stage.

7️⃣ POST-HARVEST

Dry, store and protect produce properly to reduce losses.

`;

alert(plan);

};

/* NAVIGATION */

document
.getElementById("myFarmsNav")
.addEventListener("click", () => {

document
.getElementById("farmsSection")
.scrollIntoView({
behavior: "smooth"
});

});

document
.getElementById("calendarNav")
.addEventListener("click", () => {

alert(
"📅 Farm Calendar will use your crop and planting date to create personalized activities."
);

});

document
.getElementById("aiNav")
.addEventListener("click", () => {

alert(
"🤖 AI Agronomist coming next! It will answer questions about your farm."
);

});

/* LOGOUT */

document
.getElementById("logoutButton")
.addEventListener("click", async () => {

await supabaseClient.auth.signOut();

window.location.href =
"index.html";

});

initializeDashboard();
