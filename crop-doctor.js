```js
document.addEventListener("DOMContentLoaded", function () {
  console.log("FarmPath Crop Doctor loaded");

  const plantImage = document.getElementById("plantImage");
  const preview = document.getElementById("preview");
  const symptoms = document.getElementById("symptoms");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const doctorResult = document.getElementById("doctorResult");

  const SUPABASE_FUNCTION_URL =
    "https://gqdclkxaxukvswiozgun.supabase.co/functions/v1/quick-service";

  // ------------------------------------------------------------
  // CHECK REQUIRED ELEMENTS
  // ------------------------------------------------------------

  if (!plantImage) {
    console.error("Crop Doctor: plantImage not found");
    return;
  }

  if (!preview) {
    console.error("Crop Doctor: preview not found");
    return;
  }

  if (!symptoms) {
    console.error("Crop Doctor: symptoms not found");
    return;
  }

  if (!analyzeBtn) {
    console.error("Crop Doctor: analyzeBtn not found");
    return;
  }

  if (!doctorResult) {
    console.error("Crop Doctor: doctorResult not found");
    return;
  }

  let selectedImage = null;

  // ------------------------------------------------------------
  // IMAGE SELECTION
  // ------------------------------------------------------------

  plantImage.addEventListener("change", function () {
    const file = plantImage.files && plantImage.files[0];

    if (!file) {
      selectedImage = null;
      preview.src = "";
      preview.classList.add("hidden");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      plantImage.value = "";
      selectedImage = null;
      return;
    }

    selectedImage = file;

    console.log("Image selected:", file.name, file.type, file.size);

    const imageURL = URL.createObjectURL(file);

    preview.src = imageURL;
    preview.classList.remove("hidden");
  });

  // ------------------------------------------------------------
  // IMAGE COMPRESSION
  // ------------------------------------------------------------

  function compressImage(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();

      reader.onload = function () {
        const img = new Image();

        img.onload = function () {
          const maxSize = 1200;

          let width = img.width;
          let height = img.height;

          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = Math.round(
                (height * maxSize) / width
              );
              width = maxSize;
            } else {
              width = Math.round(
                (width * maxSize) / height
              );
              height = maxSize;
            }
          }

          const canvas = document.createElement("canvas");

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(
              new Error("Your browser could not process the image.")
            );
            return;
          }

          ctx.drawImage(
            img,
            0,
            0,
            width,
            height
          );

          const result = canvas.toDataURL(
            "image/jpeg",
            0.82
          );

          console.log(
            "Image compressed successfully:",
            Math.round(result.length / 1024),
            "KB"
          );

          resolve(result);
        };

        img.onerror = function () {
          reject(
            new Error("The selected image could not be read.")
          );
        };

        img.src = reader.result;
      };

      reader.onerror = function () {
        reject(
          new Error("The image could not be loaded.")
        );
      };

      reader.readAsDataURL(file);
    });
  }

  // ------------------------------------------------------------
  // ESCAPE HTML
  // ------------------------------------------------------------

  function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = String(text || "");
    return div.innerHTML;
  }

  // ------------------------------------------------------------
  // FORMAT AI RESPONSE
  // ------------------------------------------------------------

  function formatAIResponse(text) {
    let formatted = escapeHTML(text);

    formatted = formatted.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    formatted = formatted.replace(
      /\*(.*?)\*/g,
      "<em>$1</em>"
    );

    formatted = formatted.replace(
      /^(\d+)\.\s/gm,
      "<strong>$1.</strong> "
    );

    formatted = formatted.replace(
      /\n/g,
      "<br>"
    );

    return formatted;
  }

  // ------------------------------------------------------------
  // SHOW RESULT
  // ------------------------------------------------------------

  function showResult(title, message, isError) {
    doctorResult.classList.remove("hidden");

    doctorResult.innerHTML = `
      <span class="pill">
        ${isError ? "CROP DOCTOR ERROR" : "CROP DOCTOR"}
      </span>

      <h2>${escapeHTML(title)}</h2>

      <div class="ai-analysis">
        ${message}
      </div>
    `;

    doctorResult.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  // ------------------------------------------------------------
  // ANALYZE BUTTON
  // ------------------------------------------------------------

  analyzeBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    console.log("Analyze button clicked");

    const imageFile =
      selectedImage ||
      (plantImage.files && plantImage.files[0]);

    const symptomText =
      symptoms.value.trim();

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!imageFile && !symptomText) {
      showResult(
        "Nothing to analyze",
        "Please upload a plant photo or describe what you are seeing.",
        true
      );

      return;
    }

    // ----------------------------------------------------------
    // BUTTON STATE
    // ----------------------------------------------------------

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Analyzing...";

    doctorResult.classList.remove("hidden");

    doctorResult.innerHTML = `
      <span class="pill">CROP DOCTOR</span>

      <h2>Analyzing your crop...</h2>

      <p>
        FarmPath AI is examining your observation.
        Please wait a moment.
      </p>

      <div class="result-grid">

        <div>
          <small>Image</small>
          <b>${imageFile ? "Uploaded ✓" : "Not provided"}</b>
        </div>

        <div>
          <small>Symptoms</small>
          <b>${symptomText ? "Provided ✓" : "Not provided"}</b>
        </div>

        <div>
          <small>AI</small>
          <b>Processing...</b>
        </div>

      </div>
    `;

    doctorResult.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    try {
      // --------------------------------------------------------
      // CONVERT IMAGE
      // --------------------------------------------------------

      let imageData = null;

      if (imageFile) {
        console.log("Compressing image...");

        imageData =
          await compressImage(imageFile);

        console.log("Image ready for upload");
      }

      // --------------------------------------------------------
      // SEND TO SUPABASE
      // --------------------------------------------------------

      console.log(
        "Sending request to FarmPath quick-service..."
      );

      const response = await fetch(
        SUPABASE_FUNCTION_URL,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            image: imageData,
            symptoms: symptomText,
            crop: "Not specified"
          })
        }
      );

      console.log(
        "Supabase response status:",
        response.status
      );

      // --------------------------------------------------------
      // READ RESPONSE SAFELY
      // --------------------------------------------------------

      const rawText = await response.text();

      console.log(
        "Supabase raw response:",
        rawText
      );

      let data;

      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        throw new Error(
          "The AI service returned an invalid response."
        );
      }

      console.log(
        "Crop Doctor data:",
        data
      );

      // --------------------------------------------------------
      // API ERROR
      // --------------------------------------------------------

      if (!response.ok) {
        throw new Error(
          data.details ||
          data.error ||
          `AI service returned HTTP ${response.status}.`
        );
      }

      // --------------------------------------------------------
      // NO ANSWER
      // --------------------------------------------------------

      if (!data.answer) {
        throw new Error(
          "The AI service returned no diagnosis."
        );
      }

      // --------------------------------------------------------
      // DISPLAY ANSWER
      // --------------------------------------------------------

      doctorResult.innerHTML = `
        <span class="pill">AI CROP ANALYSIS</span>

        <h2>FarmPath Crop Doctor</h2>

        <div class="ai-analysis">
          ${formatAIResponse(data.answer)}
        </div>

        <div class="doctor-disclaimer">

          <strong>Important:</strong>

          This is an AI-based crop observation,
          not a confirmed agricultural diagnosis.

          If the problem is serious, spreading quickly,
          or unclear, contact a qualified agricultural
          extension officer or agronomist before
          applying treatment.

        </div>
      `;

      doctorResult.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    } catch (error) {

      console.error(
        "FarmPath Crop Doctor error:",
        error
      );

      showResult(
        "We couldn't analyze the crop",
        `
          <p>
            ${escapeHTML(
              error && error.message
                ? error.message
                : "Something went wrong."
            )}
          </p>

          <div class="doctor-disclaimer">
            <strong>What to check:</strong><br><br>

            1. Make sure the image is a valid plant photo.<br>
            2. Make sure the FarmPath AI service is active.<br>
            3. Make sure the <code>quick-service</code>
               Edge Function has been deployed.<br>
            4. Try again in a moment.
          </div>
        `,
        true
      );

    } finally {

      analyzeBtn.disabled = false;

      analyzeBtn.textContent =
        "Analyze Observation →";
    }
  });

  console.log(
    "FarmPath Crop Doctor is ready."
  );
});
```
