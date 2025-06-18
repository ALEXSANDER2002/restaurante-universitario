/*function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();

  if (!message) return;

  const chatBody = document.getElementById("chat-body");

  // Adiciona mensagem do usuário
  const userMsg = document.createElement("div");
  userMsg.className = "user-message";
  userMsg.innerText = message;
  chatBody.appendChild(userMsg);

  // Resposta simulada do assistente
  const botMsg = document.createElement("div");
  botMsg.className = "bot-message";
  botMsg.innerText = "Mensagem recebida! Em breve terei respostas automáticas.";
  chatBody.appendChild(botMsg);

  // Limpa o campo e rola para o final
  input.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;
}
*/