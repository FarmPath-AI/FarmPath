const chatForm = document.getElementById("chatForm");
const userQuestion = document.getElementById("userQuestion");
const chatMessages = document.getElementById("chatMessages");

const SUPABASE_FUNCTION_URL =
  "https://gqdclkxaxukvswiozgun.supabase.co/functions/v1/quick-service";

// Your Supabase Publishable Key
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_-p2KVgY-tSZSou03lrL_og_v5amaKp8";


function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}


function formatAIResponse(text) {

  let formatted = escapeHTML(text);

  // Bold Markdown: **text**
  formatted = formatted.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );

  // Italic Markdown: *text*
  formatted = formatted.replace(
    /\*(.*?)\*/g,
    "<em>$1</em>"
  );

  // Convert line breaks
  formatted = formatted.replace(
    /\n/g,
    "<br>"
  );

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

  chatMessages.scrollTop =
    chatMessages.scrollHeight;
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


  // Display the user's question
  addMessage(question, "user");


  // Clear the input
  userQuestion.value = "";


  // Display loading message
  addThinkingMessage();


  try {

    const response = await fetch(
      SUPABASE_FUNCTION_URL,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          "apikey":
            SUPABASE_PUBLISHABLE_KEY,

          "Authorization":
            `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
        },

        body: JSON.stringify({

          question: question,

          farm: {}

        })

      }
    );


    // Try to read the response safely
    const responseText =
      await response.text();


    let data = {};

    try {

      data = JSON.parse(responseText);

    } catch {

      data = {
        error: responseText
      };

    }


    console.log(
      "FarmPath Response Status:",
      response.status
    );

    console.log(
      "FarmPath Response:",
      data
    );


    // Remove loading message
    removeThinkingMessage();


    // Show the REAL error if something fails
    if (!response.ok) {

      let errorMessage =
        "FarmPath AI could not process your question.";

      if (data.details) {

        errorMessage =
          data.details;

      } else if (data.error) {

        errorMessage =
          data.error;

      }


      addMessage(
        `⚠️ <strong>FarmPath AI connection error</strong>

${errorMessage}

<small>Status code: ${response.status}</small>`,
        "ai"
      );


      return;

    }


    // Check for an AI answer
    if (!data.answer) {

      addMessage(
        `⚠️ <strong>FarmPath AI returned no answer.</strong>

Please try asking your question again.`,
        "ai"
      );


      return;

    }


    // Display Gemini's answer
    addMessage(
      data.answer,
      "ai"
    );


  } catch (error) {

    console.error(
      "FarmPath connection error:",
      error
    );


    removeThinkingMessage();


    addMessage(
      `⚠️ <strong>FarmPath AI connection error</strong>

${error.message || "Unable to connect to the AI service."}`,
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
