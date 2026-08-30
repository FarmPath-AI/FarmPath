const chatForm = document.getElementById("chatForm");
const userQuestion = document.getElementById("userQuestion");
const chatMessages = document.getElementById("chatMessages");

const SUPABASE_FUNCTION_URL =
  "https://gqdclkxaxukvswiozgun.supabase.co/functions/v1/quick-service";

// Use your Supabase Publishable Key
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

  // Line breaks
  formatted = formatted.replace(
    /\n/g,
    "<br>"
  );

  return formatted;
}


function addMessage(text, sender) {

  const message = document.createElement("div");

  message.className =
    `chat-message ${sender}`;


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

  const message =
    document.createElement("div");

  message.className =
    "chat-message ai";

  message.id =
    "thinkingMessage";


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
    document.getElementById(
      "thinkingMessage"
    );

  if (thinkingMessage) {

    thinkingMessage.remove();

  }

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


    // Show user question
    addMessage(
      question,
      "user"
    );


    userQuestion.value = "";


    // Show loading message
    addThinkingMessage();


    try {

      const response =
        await fetch(
          SUPABASE_FUNCTION_URL,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              "apikey":
                SUPABASE_PUBLISHABLE_KEY,

              "Authorization":
                `Bearer ${SUPABASE_PUBLISHABLE_KEY}`

            },

            body:
              JSON.stringify({

                question: question,

                farm: {}

              })

          }
        );


      const data =
        await response.json();


      console.log(
        "FarmPath AI response:",
        data
      );


      removeThinkingMessage();


      if (!response.ok) {

        console.error(
          "FarmPath AI error:",
          data
        );


        addMessage(
          `⚠️ FarmPath AI connection error

${data.details ||
data.error ||
"Please try again."}`,
          "ai"
        );


        return;

      }


      if (!data.answer) {

        addMessage(
          `⚠️ FarmPath AI connection error

Gemini returned no answer.`,
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
        `⚠️ I couldn't connect to FarmPath AI.

Please check your internet connection and try again.`,
        "ai"
      );

    }

  }
);


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
