const SUPABASE_URL = "https://gqdclkxaxukvswiozgun.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
"sb_publishable_ZEBgVQwsdSYjjMq2F1WKZw_TD_fEFVC";

console.log("AUTH.JS LOADED");

if (!window.supabase) {
alert("ERROR: Supabase library did not load.");
} else {

const supabaseClient = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_PUBLISHABLE_KEY
);

console.log("Supabase client created successfully");

const googleLoginButton =
document.getElementById("googleLoginButton");

if (!googleLoginButton) {

```
alert("ERROR: Google button was not found.");
```

} else {

```
console.log("Google button found successfully");


googleLoginButton.addEventListener(
  "click",
  async function () {

    console.log("GOOGLE BUTTON CLICKED");

    alert("Google button is working. Connecting to Google...");


    try {

      const { data, error } =
        await supabaseClient.auth.signInWithOAuth({

          provider: "google",

          options: {

            redirectTo:
              "https://farmpath-ai.github.io/AgroGuide-AI/dashboard.html"

          }

        });


      console.log("OAuth response:", data);


      if (error) {

        console.error("OAuth error:", error);

        alert(
          "Google login error: " +
          error.message
        );

      }

    } catch (error) {

      console.error("Unexpected error:", error);

      alert(
        "Unexpected error: " +
        error.message
      );

    }

  }
);
```

}

}
