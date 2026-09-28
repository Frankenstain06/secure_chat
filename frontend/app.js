const API_URL = "http://localhost:8000";

const form = document.querySelector("#registration-form");
const passwordInput = document.querySelector("#password");
const passwordToggle = document.querySelector(".password-toggle");
const submitButton = document.querySelector(".submit-button");
const message = document.querySelector("#form-message");

function showMessage(text, type) {
  message.textContent = text;
  message.className = `form-message ${type}`;
}

passwordToggle.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  passwordToggle.textContent = isPassword ? "Hide" : "Show";
  passwordToggle.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
  passwordToggle.setAttribute("aria-pressed", String(isPassword));
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  submitButton.disabled = true;
  submitButton.querySelector(".button-label").textContent = "Creating account...";
  showMessage("", "");

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
      const detail = Array.isArray(result.detail)
        ? result.detail.map((error) => error.msg).join(" ")
        : result.detail || "Registration could not be completed.";
      throw new Error(detail);
    }

    showMessage(`Welcome, ${result.username}. Your account is ready.`, "success");
    form.reset();
  } catch (error) {
    const isConnectionError = error instanceof TypeError;
    showMessage(
      isConnectionError ? "Could not reach the server. Start the backend and try again." : error.message,
      "error",
    );
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector(".button-label").textContent = "Create account";
  }
});
