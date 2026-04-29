function sendMessage() {
  const input = document.getElementById("input");
  const chatbox = document.getElementById("chatbox");

  let message = input.value;
  if (!message) return;

  chatbox.innerHTML += `<div class="user"><b>You:</b> ${message}</div>`;

  let reply = getBotReply(message.toLowerCase());

  setTimeout(() => {
    chatbox.innerHTML += `<div class="bot"><b>Bot:</b> ${reply}</div>`;
    chatbox.scrollTop = chatbox.scrollHeight;
  }, 500);

  input.value = "";
}

function getBotReply(msg) {
  if (msg.includes("price")) {
    return "Our property packages start from $50,000.";
  }
  if (msg.includes("location")) {
    return "We offer properties in DHA, Bahria Town, and Lahore.";
  }
  if (msg.includes("contact")) {
    return "Please share your number, our agent will contact you.";
  }
  if (msg.includes("hello") || msg.includes("hi")) {
    return "Hello! Welcome to our real estate service 😊";
  }

  return "Thanks! Our team will guide you shortly.";
}