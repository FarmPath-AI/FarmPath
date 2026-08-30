const chatForm = document.getElementById("chatForm");
const userQuestion = document.getElementById("userQuestion");
const chatMessages = document.getElementById("chatMessages");

const SUPABASE_FUNCTION_URL =
  "https://gqdclkxaxukvswiozgun.supabase.co/functions/v1/quick-service";


function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}


function formatAIResponse(text) {
  let formatted = escapeHTML(text);

  // Bold Markdown
  formatted = formatted.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );

  // Italic Markdown
  formatted = formatted.replace(
    /\*(.*?)\*/g,
    "<em>$1</em>"
  );

  // Line breaks
  formatted = formatted.replace(/\n/g, "<br>");

  return formatted;
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
        ${escapeHTML(text)}
      </div>
    `;
  }

  chatMessages.appendChild(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}


function addThinkingMessage() {
  const message = document.createElement("div");

  message.className = "chat-message ai";
  message.id = "thinkingMessage";

  message.innerHTML = `
    <div class="chat-avatar">🤖</div>
    <div class="chat-bubble">
      🌾 FarmPath AI is thinking...
    </div>
  `;

  chatMessages.appendChild(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
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

  const question = userQuestion.value.trim();

  if (!question) return;

  addMessage(question, "user");

  userQuestion.value = "";

  addThinkingMessage();

  try {
    const response = await fetch(
      SUPABASE_FUNCTION_URL,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          question: question,
          farm: {}
        })
      }
    );

    const data = await response.json();

    removeThinkingMessage();

    if (!response.ok) {
      console.error("FarmPath error:", response.status, data);

      addMessage(
        `⚠️ FarmPath AI connection error

${data.details || data.error || "Please try again."}

Status code: ${response.status}`,
        "ai"
      );

      return;
    }

    if (!data.answer) {
      addMessage(
        "⚠️ FarmPath AI returned no answer. Please try again.",
        "ai"
      );

      return;
    }

    addMessage(data.answer, "ai");

  } catch (error) {
    console.error("FarmPath error:", error);

    removeThinkingMessage();

    addMessage(
      `⚠️ FarmPath AI connection error

${error.message || "Unable to connect to the service."}`,
      "ai"
    );
  }
});


document
  .querySelectorAll(".suggestion")
  .forEach((button) => {
    button.addEventListener("click", () => {
      userQuestion.value = button.textContent.trim();

      chatForm.requestSubmit();
    });
  });
