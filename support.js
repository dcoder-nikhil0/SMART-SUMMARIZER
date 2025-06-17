document.addEventListener("DOMContentLoaded", () => {
  emailjs.init("0byJSFBD_R42TxWe_"); // ✅ Your actual public key

  const form = document.getElementById("supportForm");
  const messageBox = document.getElementById("statusMessage");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    messageBox.innerText = "";
    messageBox.style.display = "none";

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showMessage("❌ Please fill in all fields.", "error");
      return;
    }

    showMessage("⏳ Sending message...", "loading");

    emailjs
      .send("service_6mm175r", "template_pz1xrnj", {
        from_name: name,
        from_email: email,
        message: message,
      })
      .then(
        function () {
          showMessage("✅ Message sent successfully!", "success");
          form.reset();
        },
        function (error) {
          console.error("EmailJS Error:", error);
          showMessage(
            "❌ Failed to send message. Please try again later.",
            "error"
          );
        }
      );
  });

  function showMessage(msg, type) {
    messageBox.innerText = msg;
    messageBox.style.display = "block";
    messageBox.style.color =
      type === "success"
        ? "limegreen"
        : type === "error"
        ? "#ff4d4f"
        : "#facc15"; // yellow for loading
  }
});
