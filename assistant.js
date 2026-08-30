const chatForm = document.getElementById("chatForm");
const userQuestion = document.getElementById("userQuestion");
const chatMessages = document.getElementById("chatMessages");

// Your Supabase Edge Function
const FUNCTION_URL =
  "https://gqdclkxaxukvswiozgun.supabase.co/functions/v1/quick-service";

// Paste your Supabase PUBLISHABLE key here
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_ZEBgVQwsdSYjjMq2F1WKZw_TD_fEFVC";


function addMessage(text, sender) {
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
        ${text}
      </div>
    `;
  }

  chatMessages.appendChild(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;

  return message;
}


async function askFarmPathAI(question) {

  // Get farm information if it exists
  const activeFarm =
    JSON.parse(localStorage.getItem("activeFarm")) || {};

  const response = await fetch(FUNCTION_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      "apikey": SUPABASE_PUBLISHABLE_KEY,

      "Authorization":
        `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
    },

    body: JSON.stringify({
      question: question,

      farm: {
        crop: activeFarm.crop || "",
        state: activeFarm.state || "",
        lga: activeFarm.lga || "",
        farmSize: activeFarm.farmSize || "",
        plantingDate: activeFarm.plantingDate || "",
        farmingType: activeFarm.farmingType || ""
      }
    })
  });


  const data = await response.json();

  if (!response.ok) {
    console.error("FarmPath AI Error:", data);

    throw new Error(
      data.details ||
      data.error ||
      "Could not connect to FarmPath AI."
    );
  }


  if (!data.answer) {
    throw new Error(
      "FarmPath AI returned an empty response."
    );
  }


  return data.answer;
}


chatForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();

    const question =
      userQuestion.value.trim();


    if (!question) {
      return;
    }


    // Show user's message
    addMessage(question, "user");

    // Clear input
    userQuestion.value = "";


    // Show thinking message
    const thinkingMessage =
      addMessage(
        `
        <b>🌾 FarmPath AI is thinking...</b>
        <p>Thinking...</p>
        `,
        "ai"
      );


    try {

      const answer =
        await askFarmPathAI(question);


      // Replace thinking message
      thinkingMessage.innerHTML = `
        <div class="chat-avatar">
          🤖
        </div>

        <div class="chat-bubble">
          ${answer}
        </div>
      `;

    } catch (error) {

      console.error(error);


      // Show the REAL error temporarily
      thinkingMessage.innerHTML = `
        <div class="chat-avatar">
          🤖
        </div>

        <div class="chat-bubble">
          <b>⚠️ FarmPath AI connection error</b>

          <p>
            ${error.message}
          </p>
        </div>
      `;

    }


    chatMessages.scrollTop =
      chatMessages.scrollHeight;

  }
);


// Suggested questions
document
  .querySelectorAll(".suggestion")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        userQuestion.value =
          button.textContent.trim();

        chatForm.requestSubmit();

      }
    );

  });
