const SUPABASE_URL = "https://gqdclkxaxukvswiozgun.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_ZEBgVQwsdSYjjMq2F1WKZw_TD_fEFVC";

const supabaseClient = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY
);

let currentUser = null;
let userFarms = [];

/* ===============================
INITIALIZE DASHBOARD
================================ */

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

document.getElementById("userName").textContent = name;

document.getElementById("userEmail").textContent =
currentUser.email;

await loadFarms();

createSmartFeatures();
}

/* ===============================
FARM MODAL
================================ */

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

/* ===============================
SAVE FARM
================================ */

document
.getElementById("farmForm")
.addEventListener("submit", async (event) => {

```
event.preventDefault();

const button =
  document.getElementById("saveFarmButton");

const message =
  document.getElementById("farmMessage");

button.disabled = true;
button.textContent = "Saving your farm...";

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

  size_unit: "hectares",

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

message.style.color = "#167a45";


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

}, 1200);
```

});

/* ===============================
LOAD FARMS
================================ */

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

```
console.error(error);

return;
```

}

userFarms = data || [];

document.getElementById("farmCount").textContent =
userFarms.length;

document.getElementById("planCount").textContent =
userFarms.length;

const farmList =
document.getElementById("farmList");

if (userFarms.length === 0) {

```
farmList.innerHTML = `
  <div class="empty">
    No farms registered yet.

    <br><br>

    Click <strong>Register Your Farm</strong>
    to begin your farming journey 🌾
  </div>
`;

return;
```

}

farmList.innerHTML =
userFarms.map(farm => `

```
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
```

}

/* ===============================
FARM PLAN
================================ */

window.generatePlan =
async function (farmId) {

const farm =
userFarms.find(f => f.id === farmId);

if (!farm) return;

const plan =
getFarmPlan(farm);

showFeatureModal(
`🌾 ${farm.farm_name} Farm Plan`,
`       <div class="smart-plan">
        ${plan}       </div>
    `
);

};

function getFarmPlan(farm) {

const crop =
farm.crop.toLowerCase();

let planting = "";
let fertilizer = "";
let spacing = "";

if (crop === "maize") {

```
planting =
  "Plant at the beginning of suitable rainfall or when irrigation is available.";

spacing =
  "Suggested spacing: approximately 75 cm × 25 cm, depending on the variety and local recommendation.";

fertilizer =
  "Use soil-test-based fertilizer recommendations where available. Split nitrogen applications when appropriate.";
```

}

else if (crop === "cassava") {

```
planting =
  "Use healthy disease-free cassava stems and plant at the beginning of the rainy season.";

spacing =
  "Common spacing is around 1 m × 1 m, depending on variety and production system.";

fertilizer =
  "Improve poor soils with organic matter and follow local soil-test recommendations.";
```

}

else if (crop === "rice") {

```
planting =
  "Choose a planting period suitable for your local rainfall pattern or irrigation system.";

spacing =
  "Use the spacing recommended for your rice variety and production method.";

fertilizer =
  "Split nutrient applications and avoid applying more fertilizer than the crop requires.";
```

}

else {

```
planting =
  "Choose planting dates based on your local rainfall, temperature and crop variety.";

spacing =
  "Follow locally recommended spacing for the selected crop and variety.";

fertilizer =
  "A soil test is recommended before deciding fertilizer type and quantity.";
```

}

return `

```
<h3>1️⃣ Land Preparation</h3>

<p>
  Clear unwanted vegetation, remove obstacles and prepare the field carefully.
  Avoid unnecessary burning where possible and protect soil organic matter.
</p>

<h3>2️⃣ Soil Management</h3>

<p>
  Recorded soil type: <strong>${farm.soil_type}</strong>.
  A laboratory soil test will provide more precise nutrient recommendations.
</p>

<h3>3️⃣ Crop Selection</h3>

<p>
  Your selected crop is <strong>${farm.crop}</strong>.
  Use certified and healthy seeds or planting materials.
</p>

<h3>4️⃣ Planting Advice</h3>

<p>${planting}</p>

<p><strong>${spacing}</strong></p>

<h3>5️⃣ Fertilizer Strategy</h3>

<p>${fertilizer}</p>

<h3>6️⃣ Crop Monitoring</h3>

<p>
  Inspect the farm regularly for weeds, pests, diseases, nutrient problems
  and water stress.
</p>

<h3>7️⃣ Harvest</h3>

<p>
  Harvest when the crop reaches the appropriate maturity stage and reduce
  delays that could increase losses.
</p>

<h3>8️⃣ Post-Harvest</h3>

<p>
  Dry, clean and store produce properly. Protect harvested crops from
  moisture, insects and contamination.
</p>
```

`;

}

/* ===============================
SMART FEATURES
================================ */

function createSmartFeatures() {

const main =
document.querySelector(".main");

const featureSection =
document.createElement("section");

featureSection.className = "card";

featureSection.style.marginTop = "25px";

featureSection.innerHTML = `

```
<h2>🤖 AgroGuide AI Tools</h2>

<div style="
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:15px;
">

  <button class="quick-action" id="aiAssistantButton">

    <strong>🤖 AI Agronomist</strong>

    <span>
      Ask questions about crops, fertilizer, pests and farming.
    </span>

  </button>


  <button class="quick-action" id="calendarButton">

    <strong>📅 Farm Calendar</strong>

    <span>
      Generate a farming activity calendar.
    </span>

  </button>


  <button class="quick-action" id="yieldButton">

    <strong>📈 Yield Prediction</strong>

    <span>
      Estimate a possible production range.
    </span>

  </button>


  <button class="quick-action" id="cropAdvisorButton">

    <strong>🌾 Crop Advisor</strong>

    <span>
      Get smart crop recommendations from farm data.
    </span>

  </button>

</div>
```

`;

main.appendChild(featureSection);

document
.getElementById("aiAssistantButton")
.addEventListener(
"click",
openAIAssistant
);

document
.getElementById("calendarButton")
.addEventListener(
"click",
openFarmCalendar
);

document
.getElementById("yieldButton")
.addEventListener(
"click",
openYieldPrediction
);

document
.getElementById("cropAdvisorButton")
.addEventListener(
"click",
openCropAdvisor
);

}

/* ===============================
AI AGRONOMIST
================================ */

function openAIAssistant() {

showFeatureModal(
"🤖 AgroGuide AI Agronomist",

```
`

<p style="margin-bottom:15px;color:#68746c">

  Ask about planting, fertilizer, pests, weeds,
  irrigation or harvesting.

</p>


<div id="aiChat" style="
  height:300px;
  overflow-y:auto;
  border:1px solid #e1e8df;
  border-radius:12px;
  padding:15px;
  margin-bottom:15px;
  background:#f8fbf7;
">

  <p>
    👋 Hello! I am AgroGuide AI.

    Ask me a farming question.
  </p>

</div>


<div style="display:flex;gap:10px">

  <input
    id="aiQuestion"
    placeholder="Example: When should I fertilize maize?"
  >

  <button
    id="askAIButton"
    style="
      border:none;
      padding:12px 18px;
      border-radius:10px;
      background:#0b3d27;
      color:white;
      font-weight:700;
      cursor:pointer;
    "
  >
    Ask
  </button>

</div>

`
```

);

document
.getElementById("askAIButton")
.addEventListener(
"click",
askAgronomist
);

document
.getElementById("aiQuestion")
.addEventListener(
"keydown",
event => {

```
    if (event.key === "Enter") {
      askAgronomist();
    }

  }
);
```

}

function askAgronomist() {

const input =
document.getElementById("aiQuestion");

const question =
input.value.trim();

if (!question) return;

const chat =
document.getElementById("aiChat");

chat.innerHTML += `

```
<div style="
  text-align:right;
  margin:12px 0;
">

  <strong>You:</strong>
  ${escapeHTML(question)}

</div>
```

`;

const answer =
generateAgronomistAnswer(question);

chat.innerHTML += `

```
<div style="
  background:white;
  padding:12px;
  border-radius:10px;
  margin:12px 0;
">

  <strong>🤖 AgroGuide AI:</strong>

  <br><br>

  ${answer}

</div>
```

`;

input.value = "";

chat.scrollTop =
chat.scrollHeight;

}

function generateAgronomistAnswer(question) {

const q =
question.toLowerCase();

if (
q.includes("fertilizer") ||
q.includes("fertilise") ||
q.includes("fertilize")
) {

```
return `
  Fertilizer decisions should ideally be based on a soil test,
  the crop, its growth stage and local agronomic recommendations.

  Avoid applying fertilizer without considering nutrient needs.
  Split applications may be appropriate for some nutrients and crops.

  Tell me your crop, farm size and growth stage for more specific guidance.
`;
```

}

if (
q.includes("pest") ||
q.includes("insect") ||
q.includes("disease")
) {

```
return `
  Inspect affected plants closely and identify symptoms before treatment.

  Check leaves, stems and roots for insects, spots, wilting or unusual damage.

  Avoid spraying an unidentified chemical. If possible, upload clear photos
  in the future Pest Detection module and consult local agricultural experts
  for confirmation.
`;
```

}

if (
q.includes("water") ||
q.includes("irrigation")
) {

```
return `
  Irrigation should depend on rainfall, soil moisture, crop stage and weather.

  Young plants and crops at critical flowering or fruiting stages may be
  particularly sensitive to water stress.

  Avoid over-irrigation because it can reduce oxygen around roots and
  encourage some diseases.
`;
```

}

if (
q.includes("weed")
) {

```
return `
  Control weeds early because young crops compete poorly with weeds.

  Use suitable methods such as manual weeding, mulching, mechanical control
  or carefully selected herbicides according to the crop and local regulations.
`;
```

}

if (
q.includes("maize") ||
q.includes("corn")
) {

```
return `
  For maize, focus on timely planting, good plant population,
  early weed control, adequate nutrients and regular pest monitoring.

  Tell me your maize growth stage and I can provide more targeted guidance.
`;
```

}

if (
q.includes("cassava")
) {

```
return `
  Cassava production benefits from healthy planting material,
  appropriate spacing, early weed management and monitoring for diseases.

  Avoid using visibly diseased stems as planting material.
`;
```

}

if (
q.includes("harvest")
) {

```
return `
  Harvest when the crop reaches the correct maturity stage for its intended use.

  Harvesting too early or too late can reduce quality and increase losses.

  Proper drying and storage are also essential after harvest.
`;
```

}

return `
AgroGuide AI recommends making decisions based on your crop,
farm location, soil condition and current growth stage.

```
Please tell me more details about your crop or the farming problem
so I can provide more targeted guidance.
```

`;

}

/* ===============================
FARM CALENDAR
================================ */

function openFarmCalendar() {

if (userFarms.length === 0) {

```
alert(
  "Please register a farm first."
);

return;
```

}

let html = `

```
<p style="margin-bottom:20px">
  Personalized activity suggestions for your registered farms.
</p>
```

`;

userFarms.forEach(farm => {

```
html += `

  <div style="
    border:1px solid #e1e8df;
    padding:18px;
    border-radius:14px;
    margin-bottom:15px;
  ">

    <h3>
      🌾 ${farm.farm_name}
    </h3>

    <p>
      Crop: ${farm.crop}
    </p>

    <br>

    <p>📅 <strong>Week 1:</strong> Land and planting preparation</p>

    <p>📅 <strong>Week 2:</strong> Planting and establishment checks</p>

    <p>📅 <strong>Weeks 3–4:</strong> Weed monitoring and crop inspection</p>

    <p>📅 <strong>Throughout season:</strong> Monitor water, pests and diseases</p>

    <p>📅 <strong>Before harvest:</strong> Check crop maturity</p>

  </div>

`;
```

});

showFeatureModal(
"📅 Personalized Farm Calendar",
html
);

}

/* ===============================
YIELD PREDICTION
================================ */

function openYieldPrediction() {

if (userFarms.length === 0) {

```
alert(
  "Please register a farm first."
);

return;
```

}

let html = `

```
<p style="margin-bottom:18px;color:#68746c">
  This is a simple planning estimate, not a guaranteed yield.
  Actual production depends on weather, variety, soil, pests,
  management and many other factors.
</p>
```

`;

userFarms.forEach(farm => {

```
const estimate =
  getYieldEstimate(farm);


html += `

  <div style="
    background:#f8fbf7;
    border:1px solid #e1e8df;
    padding:20px;
    border-radius:14px;
    margin-bottom:15px;
  ">

    <h3>
      🌾 ${farm.farm_name}
    </h3>

    <p>
      Crop: <strong>${farm.crop}</strong>
    </p>

    <p>
      Farm size:
      <strong>${farm.farm_size} hectares</strong>
    </p>

    <br>

    <h2 style="color:#167a45">
      ${estimate}
    </h2>

  </div>

`;
```

});

showFeatureModal(
"📈 Yield Planning Estimate",
html
);

}

function getYieldEstimate(farm) {

const size =
Number(farm.farm_size) || 1;

const crop =
farm.crop.toLowerCase();

let low = 1;
let high = 3;

if (crop === "maize") {
low = 2;
high = 6;
}

else if (crop === "rice") {
low = 2;
high = 6;
}

else if (crop === "cassava") {
low = 10;
high = 30;
}

else if (crop === "yam") {
low = 8;
high = 25;
}

return `     Planning range:
    ${low * size} – ${high * size} tonnes
  `;

}

/* ===============================
CROP ADVISOR
================================ */

function openCropAdvisor() {

if (userFarms.length === 0) {

```
alert(
  "Please register a farm first."
);

return;
```

}

let html = "";

userFarms.forEach(farm => {

```
html += `

  <div style="
    border:1px solid #e1e8df;
    padding:18px;
    border-radius:14px;
    margin-bottom:15px;
  ">

    <h3>
      🌱 ${farm.farm_name}
    </h3>

    <p>
      Based on your recorded soil type
      <strong>${farm.soil_type}</strong>
      and selected crop
      <strong>${farm.crop}</strong>,
      AgroGuide recommends confirming your soil nutrients
      with a proper soil test.
    </p>

    <br>

    <p>
      Consider crop varieties recommended by local agricultural
      research and extension services for your specific region.
    </p>

  </div>

`;
```

});

showFeatureModal(
"🌾 Smart Crop Advisor",
html
);

}

/* ===============================
FEATURE MODAL
================================ */

function showFeatureModal(title, content) {

const oldModal =
document.getElementById("featureModal");

if (oldModal) {
oldModal.remove();
}

const modal =
document.createElement("div");

modal.id = "featureModal";

modal.className = "modal show";

modal.innerHTML = `

```
<div class="modal-box">

  <div class="modal-top">

    <h2>${title}</h2>

    <button
      id="closeFeatureModal"
      class="close"
    >
      ×
    </button>

  </div>

  ${content}

</div>
```

`;

document.body.appendChild(modal);

document
.getElementById("closeFeatureModal")
.addEventListener(
"click",
() => modal.remove()
);

modal.addEventListener(
"click",
event => {

```
  if (event.target === modal) {
    modal.remove();
  }

}
```

);

}

/* ===============================
NAVIGATION
================================ */

document
.getElementById("myFarmsNav")
.addEventListener("click", () => {

```
document
  .getElementById("farmsSection")
  .scrollIntoView({
    behavior: "smooth"
  });
```

});

document
.getElementById("calendarNav")
.addEventListener(
"click",
openFarmCalendar
);

document
.getElementById("aiNav")
.addEventListener(
"click",
openAIAssistant
);

/* ===============================
LOGOUT
================================ */

document
.getElementById("logoutButton")
.addEventListener("click", async () => {

```
await supabaseClient.auth.signOut();

window.location.href =
  "index.html";
```

});

/* ===============================
SECURITY
================================ */

function escapeHTML(text) {

const div =
document.createElement("div");

div.textContent = text;

return div.innerHTML;

}

/* START */

initializeDashboard();
