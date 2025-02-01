
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

// Abrir e fechar o menu lateral ao clicar em "Minha Conta"
profileMenuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
});

// Fechar o menu lateral ao clicar fora dele (no overlay)
overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
});

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

    async function comprarTicket(plano, preco) {
        const id_usuario = localStorage.getItem("id_usuario"); // Pegando o ID do usuário logado
    
        if (!id_usuario) {
            alert("Usuário não autenticado. Faça login primeiro.");
            return;
        }
    
        const campus = prompt("Digite o número do campus (1, 2 ou 3):");
        const tipo_comida = prompt("Escolha o tipo de comida: Vegetariana ou Não Vegetariana:");
    
        if (!campus || !tipo_comida) {
            alert("Todos os campos são obrigatórios.");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/comprar-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario,
                    campus,
                    tipo_comida,
                    plano,
                    preco
                })
            });
    
            const result = await response.json();
    
            alert(result.message);
    
            if (result.success) {
                window.location.href = "tickets_user.html"; // Redirecionar para a página de tickets
            }
    
        } catch (error) {
            console.error("Erro ao registrar a compra:", error);
            alert("Erro ao registrar a compra.");
        }
    }
    
});
