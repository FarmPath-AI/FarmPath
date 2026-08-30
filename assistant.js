const chatForm = document.getElementById("chatForm");
const userQuestion = document.getElementById("userQuestion");
const chatMessages = document.getElementById("chatMessages");

const SUPABASE_FUNCTION_URL =
  "https://gqdclkxaxukvswiozgun.supabase.co/functions/v1/quick-service";


function formatAIResponse(text) {

  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Bullet points
    .replace(/^\* (.*)$/gm, "<li>$1</li>")

    // Numbered lists
    .replace(/^(\d+)\. \*\*(.*?)\*\*:?\s*/gm, "<p><strong>$1. $2</strong></p>")

    // Line breaks
    .replace(/\n/g, "<br>");
}


function addMessage(text, sender) {

  const message = document.createElement("div");

  message.className = `chat-message ${sender}`;

  if (sender === "ai") {

    message.innerHTML = `
      <div class="chat-avatar">🤖</div>

      <div class="chat-bubble">
        ${formatAIResponse(text)}
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

  chatMessages.scrollTop =
    chatMessages.scrollHeight;
}


function addThinkingMessage() {

  const message = document.createElement("div");

  message.className = "chat-message ai thinking-message";

  message.id = "thinkingMessage";

  message.innerHTML = `
    <div class="chat-avatar">🤖</div>

    <div class="chat-bubble">
      🌾 FarmPath AI is thinking...
    </div>
  `;

  chatMessages.appendChild(message);

  chatMessages.scrollTop =
    chatMessages.scrollHeight;
}


function removeThinkingMessage() {

  const thinkingMessage =
    document.getElementById("thinkingMessage");

  if (thinkingMessage) {
    thinkingMessage.remove();
  }

}


chatForm.addEventListener("submit", async function (event) {

  event.preventDefault();

  const question =
    userQuestion.value.trim();

  if (!question) {
    return;
  }


  // Show farmer's question
  addMessage(question, "user");

  // Clear input
  userQuestion.value = "";

  // Show thinking message
  addThinkingMessage();


  try {

    const response = await fetch(
      SUPABASE_FUNCTION_URL,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          question: question,

          farm: {}
        }),

      }
    );


    const data =
      await response.json();


    removeThinkingMessage();


    if (!response.ok) {

      addMessage(
        `
        <strong>⚠️ FarmPath AI connection error</strong>

        <br><br>

        ${data.details || data.error || "Please try again."}
        `,
        "ai"
      );

      return;
    }


    if (!data.answer) {

      addMessage(
        `
        <strong>⚠️ FarmPath AI connection error</strong>

        <br><br>

        Gemini returned no answer.
        `,
        "ai"
      );

      return;
    }


    // Show AI answer
    addMessage(
      data.answer,
      "ai"
    );


  } catch (error) {

    console.error(
      "FarmPath AI error:",
      error
    );


    removeThinkingMessage();


    addMessage(
      `
      <strong>⚠️ I couldn't connect to FarmPath AI right now.</strong>

      <br><br>

      Please check your internet connection and try again.
      `,
      "ai"
    );

  }

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
