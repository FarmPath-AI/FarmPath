```js
document.addEventListener("DOMContentLoaded", () => {
  const plantImage = document.getElementById("plantImage");
  const preview = document.getElementById("preview");
  const symptoms = document.getElementById("symptoms");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const doctorResult = document.getElementById("doctorResult");

  const SUPABASE_FUNCTION_URL =
    "https://gqdclkxaxukvswiozgun.supabase.co/functions/v1/quick-service";

  let selectedImage = null;

  // ------------------------------------------------------------
  // IMAGE SELECTION
  // ------------------------------------------------------------

  plantImage.addEventListener("change", () => {
    const file = plantImage.files[0];

    if (!file) {
      selectedImage = null;
      preview.classList.add("hidden");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please choose a valid plant image.");
      plantImage.value = "";
      return;
    }

    selectedImage = file;

    const imageURL = URL.createObjectURL(file);

    preview.src = imageURL;
    preview.classList.remove("hidden");
  });

  // ------------------------------------------------------------
  // COMPRESS IMAGE
  // ------------------------------------------------------------

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = () => {
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
            reject(new Error("Could not process image."));
            return;
          }

          ctx.drawImage(
            img,
            0,
            0,
            width,
            height
          );

          const compressedImage =
            canvas.toDataURL("image/jpeg", 0.82);

          resolve(compressedImage);
        };

        img.onerror = () => {
          reject(new Error("Could not read the image."));
        };

        img.src = reader.result;
      };

      reader.onerror = () => {
        reject(new Error("Could not load the image."));
      };

      reader.readAsDataURL(file);
    });
  }

  // ------------------------------------------------------------
  // FORMAT AI RESPONSE
  // ------------------------------------------------------------

  function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

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
  // ANALYZE
  // ------------------------------------------------------------

  analyzeBtn.addEventListener("click", async () => {
    const imageFile =
      selectedImage || plantImage.files[0];

    const symptomText =
      symptoms.value.trim();

    if (!imageFile && !symptomText) {
      alert(
        "Please upload a photo or describe what you are seeing."
      );

      return;
    }

    analyzeBtn.disabled = true;

    analyzeBtn.textContent =
      "Analyzing your crop...";

    doctorResult.classList.remove("hidden");

    doctorResult.innerHTML = `
      <span class="pill">CROP DOCTOR</span>

      <h2>Analyzing your crop...</h2>

      <p>
        FarmPath AI is examining the observation.
        This may take a few seconds.
      </p>

      <div class="result-grid">
        <div>
          <small>Status</small>
          <b>Analyzing</b>
        </div>

        <div>
          <small>Image</small>
          <b>${imageFile ? "Uploaded" : "Not provided"}</b>
        </div>

        <div>
          <small>Symptoms</small>
          <b>${symptomText ? "Provided" : "Not provided"}</b>
        </div>
      </div>
    `;

    doctorResult.scrollIntoView({
      behavior: "smooth"
    });

    try {
      let imageData = null;

      if (imageFile) {
        imageData =
          await compressImage(imageFile);
      }

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

      const data = await response.json();

      console.log(
        "Crop Doctor response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.details ||
          data.error ||
          "Crop Doctor could not analyze the observation."
        );
      }

      if (!data.answer) {
        throw new Error(
          "Crop Doctor returned no analysis."
        );
      }

      doctorResult.innerHTML = `
        <span class="pill">AI CROP ANALYSIS</span>

        <h2>FarmPath Crop Doctor</h2>

        <div class="ai-analysis">
          ${formatAIResponse(data.answer)}
        </div>

        <div class="doctor-disclaimer">
          <strong>Important:</strong>
          This is an AI-based crop observation, not a confirmed
          agricultural diagnosis. If the problem is serious,
          spreading quickly, or unclear, contact a qualified
          agricultural extension officer or agronomist before
          applying treatment.
        </div>
      `;

      doctorResult.scrollIntoView({
        behavior: "smooth"
      });

    } catch (error) {
      console.error(
        "Crop Doctor error:",
        error
      );

      doctorResult.innerHTML = `
        <span class="pill">CROP DOCTOR</span>

        <h2>We couldn't analyze the crop</h2>

        <p>
          ${escapeHTML(
            error.message ||
            "Something went wrong. Please try again."
          )}
        </p>

        <div class="doctor-disclaimer">
          Make sure your image is clear and try again.
          If the problem continues, check that the FarmPath
          AI service is available.
        </div>
      `;

    } finally {
      analyzeBtn.disabled = false;

      analyzeBtn.textContent =
        "Analyze Observation →";
    }
  });
});
```
