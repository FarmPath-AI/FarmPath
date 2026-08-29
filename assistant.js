const chatForm = document.getElementById("chatForm");

const userQuestion = document.getElementById("userQuestion");

const chatMessages = document.getElementById("chatMessages");

function addMessage(text, sender) {

const message = document.createElement("div");

message.className = `chat-message ${sender}`;

if (sender === "ai") {

```
message.innerHTML = `
  <div class="chat-avatar">🤖</div>

  <div class="chat-bubble">
    ${text}
  </div>
`;
```

} else {

```
message.innerHTML = `
  <div class="chat-bubble">
    ${text}
  </div>
`;
```

}

chatMessages.appendChild(message);

chatMessages.scrollTop =
chatMessages.scrollHeight;

}

function getFarmPathResponse(question) {

const q = question.toLowerCase();

if (
q.includes("plant") ||
q.includes("maize") ||
q.includes("seed")
) {

```
return `
  <b>🌱 Planting guidance</b>

  <p>
    The best planting time depends on your state,
    rainfall pattern and whether your farm is irrigated.
  </p>

  <p>
    Before planting, make sure the land is properly prepared,
    use suitable seed and plant when soil moisture is adequate.
  </p>

  <p>
    <b>Tip:</b> Tell me your crop, state and planting date
    for more personalized guidance.
  </p>
`;
```

}

if (
q.includes("fertilizer") ||
q.includes("fertiliser")
) {

```
return `
  <b>🧪 Fertilizer guidance</b>

  <p>
    Fertilizer recommendations should ideally be based on
    a soil test, crop requirements and your farm size.
  </p>

  <p>
    Avoid applying fertilizer immediately before heavy rainfall,
    because nutrients may be lost.
  </p>

  <p>
    Tell me your crop, farm size and available soil information
    and FarmPath can help you plan the calculation.
  </p>
`;
```

}

if (
q.includes("pest") ||
q.includes("armyworm") ||
q.includes("insect")
) {

```
return `
  <b>🐛 Pest management</b>

  <p>
    Start by scouting the farm carefully to confirm
    the type and level of infestation.
  </p>

  <p>
    Remove badly affected plant material where appropriate
    and avoid spraying a product until the pest has been
    correctly identified.
  </p>

  <p>
    📷 You can also use the <b>Crop Doctor</b> page
    to record a crop problem.
  </p>

  <p>
    ⚠️ Always follow the product label and local agricultural guidance.
  </p>
`;
```

}

if (
q.includes("yellow") ||
q.includes("disease") ||
q.includes("leaf") ||
q.includes("sick")
) {

```
return `
  <b>🩺 Crop health check</b>

  <p>
    Yellow leaves can have several causes, including nutrient
    deficiency, water stress, pests, diseases or root problems.
  </p>

  <p>
    Check whether symptoms appear on older or younger leaves,
    whether they are spreading and whether insects are present.
  </p>

  <p>
    📷 For better diagnosis, use the FarmPath Crop Doctor
    and upload a clear photograph.
  </p>
`;
```

}

if (
q.includes("water") ||
q.includes("irrigation") ||
q.includes("irrigate")
) {

```
return `
  <b>💧 Irrigation guidance</b>

  <p>
    The right irrigation schedule depends on the crop,
    growth stage, soil type and recent rainfall.
  </p>

  <p>
    Check soil moisture before irrigating and avoid
    overwatering, which can damage roots and increase disease risk.
  </p>

  <p>
    Tell me your crop and farming stage for more specific guidance.
  </p>
`;
```

}

if (
q.includes("land") ||
q.includes("prepare") ||
q.includes("clearing") ||
q.includes("plough")
) {

```
return `
  <b>🚜 Land preparation</b>

  <p>
    A typical land preparation process may include:
  </p>

  <ol>
    <li>Assess the field and clear unwanted vegetation.</li>
    <li>Remove obstacles and manage crop residues appropriately.</li>
    <li>Plough where suitable for the farming system.</li>
    <li>Harrow to prepare a suitable seedbed.</li>
    <li>Create ridges or beds where appropriate for the crop.</li>
  </ol>

  <p>
    The correct approach depends on soil conditions,
    slope, crop and local farming practices.
  </p>
`;
```

}

if (
q.includes("harvest") ||
q.includes("harvesting")
) {

```
return `
  <b>🌾 Harvest planning</b>

  <p>
    Harvest when the crop has reached the appropriate
    maturity indicators for that crop.
  </p>

  <p>
    Plan labour, drying, storage and transportation
    before harvest begins to reduce post-harvest losses.
  </p>

  <p>
    Tell me the crop you are growing and I can provide
    more specific harvest guidance.
  </p>
`;
```

}

return ` <b>🌾 FarmPath AI</b>

```
<p>
  I can help you with land preparation, planting,
  fertilizer, pests, crop diseases, irrigation and harvesting.
</p>

<p>
  To give you better guidance, tell me:
</p>

<ul>
  <li>Your crop</li>
  <li>Your state or location</li>
  <li>Your farm size</li>
  <li>Your current farming stage</li>
</ul>
```

`;

}

chatForm.addEventListener("submit", function (event) {

event.preventDefault();

const question =
userQuestion.value.trim();

if (!question) {

```
return;
```

}

addMessage(question, "user");

userQuestion.value = "";

setTimeout(() => {

```
const response =
  getFarmPathResponse(question);


addMessage(response, "ai");
```

}, 600);

});

document
.querySelectorAll(".suggestion")
.forEach((button) => {

```
button.addEventListener("click", () => {

  userQuestion.value =
    button.textContent.trim();


  chatForm.requestSubmit();

});
```

});
