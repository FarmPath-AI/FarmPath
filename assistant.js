const chatForm = document.getElementById("chatForm");
const userQuestion = document.getElementById("userQuestion");
const chatMessages = document.getElementById("chatMessages");

const SUPABASE_URL = "https://gqdclkxaxukvswiozgun.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_ZEBgVQwsdSYjjMq2F1WKZw_TD_fEFVC";

function addMessage(text, sender) {
  const message = document.createElement("div");

  message.className = `chat-message ${sender}`;

  if (sender === "ai") {
    message.innerHTML = `
      <div class="chat-avatar">🤖</div>
      <div class="chat-bubble"></div>
    `;

    message.querySelector(".chat-bubble").textContent = text;
  } else {
    message.innerHTML = `
      <div class="chat-bubble"></div>
    `;

    message.querySelector(".chat-bubble").textContent = text;
  }

  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return message;
}


async function askFarmPath(question) {

  // Try to get farm information saved by the FarmPath app
  let farm = {};

  try {
    const savedFarm = localStorage.getItem("farmpathFarm");

    if (savedFarm) {
      farm = JSON.parse(savedFarm);
    }
  } catch (error) {
    console.log("Could not load farm information");
  }


  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/quick-service`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        "Authorization":
          `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,

        "apikey":
          SUPABASE_PUBLISHABLE_KEY
      },

      body: JSON.stringify({
        question: question,
        farm: farm
      })
    }
  );


  const data = await response.json();

  if (!response.ok) {
    console.error("FarmPath AI error:", data);

    throw new Error(
      data.details ||
      data.error ||
      "FarmPath AI could not answer right now."
    );
  }

  return data.answer;
}


chatForm.addEventListener("submit", async function (event) {

  event.preventDefault();

  const question = userQuestion.value.trim();

  if (!question) return;


  // Show farmer's message
  addMessage(question, "user");

  userQuestion.value = "";


  // Disable button while AI is thinking
  const submitButton =
    chatForm.querySelector('button[type="submit"]');

  submitButton.disabled = true;

  submitButton.textContent = "Thinking...";


  // Show temporary AI message
  const thinkingMessage = addMessage(
    "🌾 FarmPath AI is thinking...",
    "ai"
  );


  try {

    const answer =
      await askFarmPath(question);


    thinkingMessage.remove();

    addMessage(answer, "ai");

  } catch (error) {

    console.error(error);

    thinkingMessage.remove();

    addMessage(
      "⚠️ I couldn't connect to FarmPath AI right now. " +
      "Please check your internet connection and try again.",
      "ai"
    );

  }


  submitButton.disabled = false;

  submitButton.textContent = "Ask AI →";

});


document
  .querySelectorAll(".suggestion")
  .forEach((button) => {

    button.addEventListener("click", () => {

      userQuestion.value =
        button.textContent.trim();

      chatForm.requestSubmit();

    });

  });
