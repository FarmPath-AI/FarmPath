document.addEventListener("DOMContentLoaded", () => {
console.log("FarmPath Crop Doctor loaded");

const plantImage = document.getElementById("plantImage");
const preview = document.getElementById("preview");
const symptoms = document.getElementById("symptoms");
const analyzeBtn = document.getElementById("analyzeBtn");
const doctorResult = document.getElementById("doctorResult");

const SUPABASE_FUNCTION_URL =
"https://gqdclkxaxukvswiozgun.supabase.co/functions/v1/quick-service";

let selectedImage = null;

if (!plantImage || !preview || !symptoms || !analyzeBtn || !doctorResult) {
console.error("Crop Doctor: Required HTML elements are missing.");
return;
}

// -----------------------------
// IMAGE SELECTION
// -----------------------------

plantImage.addEventListener("change", () => {
const file = plantImage.files && plantImage.files[0];

```
console.log("Selected image:", file ? file.name : "None");

if (!file) {
  selectedImage = null;
  preview.src = "";
  preview.classList.add("hidden");
  return;
}

if (!file.type.startsWith("image/")) {
  alert("Please choose a valid plant image.");
  plantImage.value = "";
  selectedImage = null;
  return;
}

selectedImage = file;

const imageURL = URL.createObjectURL(file);

preview.src = imageURL;
preview.classList.remove("hidden");
```

});

// -----------------------------
// COMPRESS IMAGE
// -----------------------------

function compressImage(file) {
return new Promise((resolve, reject) => {
const reader = new FileReader();

```
  reader.onload = () => {
    const img = new Image();

    img.onload = () => {
      const maxSize = 1200;

      let width = img.width;
      let height = img.height;

      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not process the image."));
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
      reject(new Error("Could not read the selected image."));
    };

    img.src = reader.result;
  };

  reader.onerror = () => {
    reject(new Error("Could not load the image."));
  };

  reader.readAsDataURL(file);
});
```

}

// -----------------------------
// SECURITY
// -----------------------------

function escapeHTML(text) {
const div = document.createElement("div");
div.textContent = String(text);
return div.innerHTML;
}

// -----------------------------
// FORMAT AI RESPONSE
// -----------------------------

function formatAIResponse(text) {
let formatted = escapeHTML(text);

```
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
```

}

// -----------------------------
// ANALYZE BUTTON
// -----------------------------

analyzeBtn.addEventListener("click", async (event) => {
event.preventDefault();

```
console.log("Analyze button clicked");

const imageFile =
  selectedImage ||
  (plantImage.files && plantImage.files[0]);

const symptomText =
  symptoms.value.trim();

console.log("Image:", imageFile ? imageFile.name : "None");
console.log("Symptoms:", symptomText);

if (!imageFile && !symptomText) {
  alert(
    "Please upload a photo or describe what you are seeing."
  );
  return;
}

analyzeBtn.disabled = true;
analyzeBtn.textContent = "Analyzing your crop...";

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
  behavior: "smooth",
  block: "start"
});

try {
  let imageData = null;

  // Convert the image to a smaller base64 JPEG.
  if (imageFile) {
    console.log("Compressing image...");
    imageData = await compressImage(imageFile);
    console.log("Image compressed successfully.");
  }

  console.log("Sending request to FarmPath AI...");

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

  const rawText = await response.text();

  console.log(
    "Raw Supabase response:",
    rawText
  );

  let data;

  try {
    data = JSON.parse(rawText);
  } catch (jsonError) {
    throw new Error(
      "The AI service returned an invalid response."
    );
  }

  console.log(
    "Crop Doctor response:",
    data
  );

  if (!response.ok) {
    throw new Error(
      data.details ||
      data.error ||
      `AI service returned HTTP ${response.status}.`
    );
  }

  if (!data.answer) {
    throw new Error(
      "Crop Doctor returned no analysis."
    );
  }

  // -----------------------------
  // SUCCESS
  // -----------------------------

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
    behavior: "smooth",
    block: "start"
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
      If the problem continues, the FarmPath AI service
      may need attention.
    </div>
  `;

} finally {
  analyzeBtn.disabled = false;
  analyzeBtn.textContent = "Analyze Observation →";
}
```

});

console.log("FarmPath Crop Doctor is ready.");
});
