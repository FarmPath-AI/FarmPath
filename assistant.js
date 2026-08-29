document.addEventListener("DOMContentLoaded", () => {

const chatForm = document.getElementById("chatForm");
const userQuestion = document.getElementById("userQuestion");
const chatMessages = document.getElementById("chatMessages");

console.log("FarmPath AI Assistant loaded");

if (!chatForm || !userQuestion || !chatMessages) {
console.error("FarmPath AI error: Chat elements were not found.");
return;
}

function scrollToBottom() {
chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHTML(text) {
const div = document.createElement("div");
div.textContent = text;
return div.innerHTML;
}

function addMessage(text, sender) {

```
const message = document.createElement("div");

message.className = `chat-message ${sender}`;

if (sender === "ai") {

  message.innerHTML = `
    <div class="chat-avatar">🤖</div>

    <div class="chat-bubble">
      ${text}
    </div>
  `;

} else {

  message.innerHTML = `
    <div class="chat-bubble">
      ${escapeHTML(text)}
    </div>
  `;
}

chatMessages.appendChild(message);

scrollToBottom();
```

}

function showThinking() {

```
const thinking = document.createElement("div");

thinking.className = "chat-message ai";
thinking.id = "thinkingMessage";

thinking.innerHTML = `
  <div class="chat-avatar">🤖</div>

  <div class="chat-bubble">
    🌾 FarmPath is thinking...
  </div>
`;

chatMessages.appendChild(thinking);

scrollToBottom();
```

}

function removeThinking() {

```
const thinking =
  document.getElementById("thinkingMessage");

if (thinking) {
  thinking.remove();
}
```

}

function getFarmPathResponse(question) {

```
const q = question.toLowerCase();


/* PLANTING */

if (
  q.includes("plant") ||
  q.includes("planting") ||
  q.includes("maize") ||
  q.includes("seed")
) {

  return `
    <b>🌱 Planting guidance</b>

    <p>
      The best planting time depends on your location,
      rainfall pattern, crop variety and whether your farm
      is irrigated or rain-fed.
    </p>

    <p>
      Before planting:
    </p>

    <ol>
      <li>Prepare the land properly.</li>
      <li>Use good-quality seed suitable for your area.</li>
      <li>Ensure adequate soil moisture.</li>
      <li>Use the correct spacing and planting depth.</li>
      <li>Monitor germination after planting.</li>
    </ol>

    <p>
      🌾 <b>For personalized guidance, tell me:</b>
      your crop, state, farm size and planned planting date.
    </p>
  `;
}


/* FERTILIZER */

if (
  q.includes("fertilizer") ||
  q.includes("fertiliser") ||
  q.includes("npk") ||
  q.includes("urea")
) {

  return `
    <b>🧪 Fertilizer guidance</b>

    <p>
      Fertilizer recommendations should ideally be based on
      soil-test information, crop requirements and farm size.
    </p>

    <p>
      FarmPath can help you plan:
    </p>

    <ul>
      <li>Suitable fertilizer types</li>
      <li>Application timing</li>
      <li>Application method</li>
      <li>Estimated quantity for your farm</li>
    </ul>

    <p>
      ⚠️ Avoid blindly applying the same fertilizer rate to
      every farm. Soil conditions can vary significantly.
    </p>

    <p>
      Tell me your <b>crop, farm size and soil information</b>.
    </p>
  `;
}


/* PESTS */

if (
  q.includes("pest") ||
  q.includes("armyworm") ||
  q.includes("insect") ||
  q.includes("caterpillar")
) {

  return `
    <b>🐛 Pest management</b>

    <p>
      First, inspect the affected plants carefully to identify
      the pest and estimate how widespread the problem is.
    </p>

    <p>
      Recommended steps:
    </p>

    <ol>
      <li>Inspect several parts of the farm.</li>
      <li>Look for insects, eggs and feeding damage.</li>
      <li>Record how many plants are affected.</li>
      <li>Take clear photographs of symptoms and pests.</li>
      <li>Use the Crop Doctor for additional assessment.</li>
    </ol>

    <p>
      ⚠️ Do not apply a pesticide until the pest and product
      suitability have been properly confirmed. Always follow
      the product label and qualified local agricultural advice.
    </p>
  `;
}


/* DISEASE */

if (
  q.includes("yellow") ||
  q.includes("disease") ||
  q.includes("leaf") ||
  q.includes("sick") ||
  q.includes("spot") ||
  q.includes("wilting")
) {

  return `
    <b>🩺 Crop health check</b>

    <p>
      Crop symptoms can have several possible causes, including:
    </p>

    <ul>
      <li>Nutrient deficiencies</li>
      <li>Water stress</li>
      <li>Insect pests</li>
      <li>Fungal or bacterial diseases</li>
      <li>Root problems</li>
      <li>Heat stress</li>
    </ul>

    <p>
      Check whether symptoms are appearing on older or younger
      leaves, whether they are spreading and whether insects are
      present.
    </p>

    <p>
      📷 For a better assessment, use the FarmPath
      <b>Crop Doctor</b> and upload a clear photograph.
    </p>

    <p>
      If symptoms are severe or spreading quickly, contact a
      qualified agricultural extension officer.
    </p>
  `;
}


/* WATER */

if (
  q.includes("water") ||
  q.includes("irrigation") ||
  q.includes("irrigate") ||
  q.includes("dry")
) {

  return `
    <b>💧 Irrigation guidance</b>

    <p>
      The correct irrigation schedule depends on:
    </p>

    <ul>
      <li>Crop type</li>
      <li>Growth stage</li>
      <li>Soil type</li>
      <li>Recent rainfall</li>
      <li>Temperature and evaporation</li>
    </ul>

    <p>
      Check soil moisture before irrigating. Avoid both
      underwatering and overwatering.
    </p>

    <p>
      🌾 Tell me your crop and current growth stage for
      more specific guidance.
    </p>
  `;
}


/* LAND PREPARATION */

if (
  q.includes("land") ||
  q.includes("prepare") ||
  q.includes("clearing") ||
  q.includes("plough") ||
  q.includes("harrow") ||
  q.includes("ridge")
) {

  return `
    <b>🚜 Land preparation</b>

    <p>
      A typical preparation process may include:
    </p>

    <ol>
      <li>Assess the field and clear unwanted vegetation.</li>
      <li>Remove obstacles safely.</li>
      <li>Manage residues appropriately.</li>
      <li>Plough where suitable.</li>
      <li>Harrow to prepare the seedbed.</li>
      <li>Create ridges or beds when appropriate for the crop.</li>
    </ol>

    <p>
      The correct method depends on soil conditions,
      slope, crop and local farming practices.
    </p>
  `;
}


/* HARVEST */

if (
  q.includes("harvest") ||
  q.includes("harvesting") ||
  q.includes("storage") ||
  q.includes("drying")
) {

  return `
    <b>🌾 Harvest and post-harvest guidance</b>

    <p>
      Harvest should be based on the maturity indicators
      appropriate for your specific crop.
    </p>

    <p>
      Before harvesting, plan for:
    </p>

    <ul>
      <li>Labour</li>
      <li>Drying</li>
      <li>Storage</li>
      <li>Transportation</li>
      <li>Protection from moisture and pests</li>
    </ul>

    <p>
      Good post-harvest handling can significantly reduce losses.
      Tell me your crop for more specific guidance.
    </p>
  `;
}


/* GREETING */

if (
  q.includes("hello") ||
  q.includes("hi") ||
  q.includes("good morning") ||
  q.includes("good afternoon")
) {

  return `
    <b>Hello! 👋 Welcome to FarmPath.</b>

    <p>
      I'm here to help guide you through your farming journey.
    </p>

    <p>
      You can ask me about:
    </p>

    <ul>
      <li>🌱 Planting</li>
      <li>🚜 Land preparation</li>
      <li>🧪 Fertilizer</li>
      <li>🐛 Pests</li>
      <li>🩺 Crop problems</li>
      <li>💧 Irrigation</li>
      <li>🌾 Harvesting</li>
    </ul>
  `;
}


/* DEFAULT */

return `
  <b>🌾 FarmPath AI</b>

  <p>
    I can help you with land preparation, planting,
    fertilizer, pests, crop diseases, irrigation,
    farm management and harvesting.
  </p>

  <p>
    To give you better guidance, tell me:
  </p>

  <ul>
    <li>🌱 Your crop</li>
    <li>📍 Your state or location</li>
    <li>📏 Your farm size</li>
    <li>🌾 Your current farming stage</li>
  </ul>

  <p>
    Try asking something like:
    <b>"How should I prepare my land for maize?"</b>
  </p>
`;
```

}

/* SEND QUESTION */

chatForm.addEventListener("submit", (event) => {

```
event.preventDefault();

const question = userQuestion.value.trim();

if (!question) return;


console.log("Farmer asked:", question);


addMessage(question, "user");

userQuestion.value = "";


showThinking();


setTimeout(() => {

  try {

    const response =
      getFarmPathResponse(question);

    removeThinking();

    addMessage(response, "ai");

  } catch (error) {

    console.error(error);

    removeThinking();

    addMessage(
      `
        <b>⚠️ FarmPath encountered a problem.</b>

        <p>
          Please try asking your question again.
        </p>
      `,
      "ai"
    );
  }

}, 700);
```

});

/* SUGGESTED QUESTIONS */

document
.querySelectorAll(".suggestion")
.forEach((button) => {

```
  button.addEventListener("click", () => {

    const question =
      button.textContent.trim();

    userQuestion.value = question;

    userQuestion.focus();

    chatForm.requestSubmit();

  });

});
```

console.log("FarmPath AI Assistant is ready");

});
