
const { criarPreferencia } = require('./API/config.js');

// Uso em outro arquivo
async function main() {
  const preference = await criarPreferencia();
  console.log("Preferência criada:", preference);
}

main();
// Controle do menu lateral
const profileMenuToggle = document.getElementById('profile-menu-toggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

// // Abrir e fechar o menu lateral ao clicar em "Minha Conta"
// profileMenuToggle.addEventListener('click', () => {
//     sidebar.classList.toggle('open');
//     overlay.classList.toggle('show');
// });

// // Fechar o menu lateral ao clicar fora dele (no overlay)
// overlay.addEventListener('click', () => {
//     sidebar.classList.remove('open');
//     overlay.classList.remove('show');
// });

// Função para criar pagamento e redirecionar
document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", async (event) => {
        const tipoTicket = event.target.parentElement.querySelector("h3").innerText;
        const valor = tipoTicket === "Padrão" ? 13 : 2;

        const pagamentoDados = {
            transaction_amount: valor,
            description: `Compra de Ticket (${tipoTicket})`,
            payment_method_id: "pix",
            payer: {
                email: "comprador@exemplo.com",
            },
        };

        const linkPagamento = await criarPagamento(pagamentoDados);
        if (linkPagamento) {
            window.location.href = linkPagamento;
        } else {
            alert("Erro ao gerar o pagamento. Tente novamente.");
        }
    });
});

async function comprarTicket(user_id, tipo_comida, campus, valor) {
    try {
      const response = await fetch("http://fa42-2804-2084-404-4600-c0e-4c1-9a71-3ea7.ngrok-free.app/salvar-compra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, tipo_comida, campus, valor })
      });
  
      const data = await response.json();
  
      if (data.message) {
        alert("✅ Compra registrada com sucesso!");
        console.log("✅ Compra salva no banco:", data);
      } else {
        alert("❌ Erro ao salvar a compra.");
      }
    } catch (error) {
      console.error("❌ Erro ao conectar ao servidor:", error);
      alert("❌ Erro ao conectar ao servidor.");
    }
  }
  

