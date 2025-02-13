// Importando as bibliotecas necessárias
const mercadopago = require('mercadopago');  // SDK do Mercado Pago para integração com a API
const axios = require('axios');  // Para realizar requisições HTTP no Node.js

// ✅ Configuração do Mercado Pago
// Inicializa o cliente do Mercado Pago com o token de acesso
const mpClient = new mercadopago.MercadoPagoConfig({
  accessToken: "APP_USR-8540766672404155-012611-18119369f6e3b8b42eeea53446a27387-2231764145",  // Token de acesso para autenticação com a API
  options: { timeout: 5000 }  // Define um tempo de espera de 5 segundos para as requisições
});

// Inicializa a preferência de pagamento
const preference = new mercadopago.Preference(mpClient);

// ✅ Função para criar uma nova preferência de pagamento
async function criarPreferencia(user_id, tipo_comida, campus, valor) {
  try {
    // Verifica se o valor fornecido é válido (R$2,00 ou R$13,00)
    if (![2, 13].includes(parseFloat(valor))) {
      throw new Error("Valor inválido. Apenas R$2,00 ou R$13,00 são permitidos.");
    }

    // Cria a preferência de pagamento no Mercado Pago com os dados fornecidos
    const result = await preference.create({
      body: {
        items: [
          {
            id: valor === 2 ? "2R" : "13R",  // Define o ID do item dependendo do valor
            title: `TICKET_RU - R$${valor}`,  // Define o título do item, baseado no valor
            quantity: 1,  // Quantidade do item (sempre 1 neste caso)
            currency_id: "BRL",  // Define a moeda (Real Brasileiro)
            unit_price: parseFloat(valor)  // Define o preço do item
          }
        ],
        back_urls: {  // Define as URLs de retorno após o pagamento
          success: "http://localhost:3000/compracerta",  // URL quando o pagamento for bem-sucedido
          failure: "http://localhost:3000/compraerrada",  // URL quando o pagamento falhar
          pending: "http://localhost:3000/compraerrada"  // URL para quando o pagamento estiver pendente
        },
        auto_return: "approved",  // Configura para retornar automaticamente após a aprovação do pagamento
        payment_methods: {
          excluded_payment_types: [{ id: "atm" }],  // Exclui o pagamento por caixa eletrônico
          installments: 1  // Permite pagamento em uma única parcela
        }
      }
    });

    // Exibe o resultado da criação da preferência (URL para pagamento)
    console.log(`\n✅ PREFERÊNCIA CRIADA PARA R$${valor}!`);
    console.log("URL:", result.init_point);  // URL para iniciar o pagamento
    console.log("ID:", result.id);  // ID da preferência gerada

    // Retorna o ID e a URL da preferência para ser usado em outro lugar
    return { id: result.id, url: result.init_point };
  } catch (error) {
    // Exibe erro caso ocorra algum problema na criação da preferência
    console.error("\n❌ ERRO AO CRIAR PREFERÊNCIA:", error.message);
    return null;
  }
}

// ✅ Função para realizar a compra do ticket (chama o endpoint para salvar a compra no servidor)
async function comprarTicket(user_id, tipo_comida, campus, valor) {
  try {
    // Realiza uma requisição POST para registrar a compra no servidor
    const response = await axios.post("http://localhost:3000/salvar-compra", {
      user_id,
      tipo_comida,
      campus,
      valor
    });

    // Exibe sucesso ao registrar a compra
    console.log("✅ Compra registrada com sucesso!", response.data);
    return response.data;  // Retorna os dados da resposta
  } catch (error) {
    // Exibe erro caso falhe ao conectar com o servidor
    console.error("❌ Erro ao conectar ao servidor:", error);
    throw new Error("Erro ao registrar compra.");
  }
}

// ✅ Exporta as funções para uso externo (como em outros arquivos)
module.exports = {
  criarPreferencia,
  comprarTicket
};

// ✅ Executa automaticamente para testar R$2 e R$13
if (require.main === module) {
  const user_id = 1;  // ID do usuário de teste
  const tipo_comida = "vegetariana";  // Tipo de comida para o exemplo
  const campus = "Campus 1";  // Campus de exemplo

  // Cria preferências de pagamento para os valores R$2,00 e R$13,00
  Promise.all([
    criarPreferencia(user_id, tipo_comida, campus, 2),
    criarPreferencia(user_id, tipo_comida, campus, 13)
  ])
  .then((responses) => {
    console.log("\n🔗 URLs geradas para pagamento:");
    // Exibe as URLs de pagamento geradas para os dois valores
    responses.forEach((res, index) => {
      if (res) {
        console.log(`✅ Pagamento ${index + 1}: ${res.url}`);  // Exibe a URL se a criação foi bem-sucedida
      } else {
        console.log(`❌ Erro ao criar pagamento ${index + 1}`);  // Exibe erro se a criação falhou
      }
    });
  })
  .catch((err) => console.error("❌ Erro ao criar pagamentos:", err));  // Exibe erro geral se falhar
}
