const mercadopago = require('mercadopago');
const axios = require('axios'); // Para requisições HTTP no Node.js

// ✅ Configuração correta para Mercado Pago SDK 2.x+
const mpClient = new mercadopago.MercadoPagoConfig({
  accessToken: "APP_USR-8540766672404155-012611-18119369f6e3b8b42eeea53446a27387-2231764145",
  options: { timeout: 5000 }
});

const preference = new mercadopago.Preference(mpClient);

// Criar uma nova preferência de pagamento
async function criarPreferencia(user_id, tipo_comida, campus, valor) {
  try {
    const result = await preference.create({
      body: {
        items: [
          {
            id: "1",
            title: "TICKET_RU",
            quantity: 1,
            currency_id: "BRL",
            unit_price: parseFloat(valor)
          }
        ],
        back_urls: {
          success: "http://localhost:3000/compracerta",
          failure: "http://localhost:3000/compraerrada",
          pending: "http://localhost:3000/compraerrada"
        },
        auto_return: "approved",
        payment_methods: {
          excluded_payment_types: [{ id: "atm" }],
          installments: 1
        }
      }
    });

    // ✅ Correção: Acessando diretamente `init_point` e `id`
    console.log("\n✅ RESPOSTA COMPLETA DO MERCADO PAGO:");
    console.log(result);

    if (!result || !result.init_point) {
      throw new Error("A resposta do Mercado Pago não contém 'init_point'. Verifique o erro.");
    }

    console.log("\n✅ PREFERÊNCIA CRIADA!");
    console.log("URL:", result.init_point);
    console.log("ID:", result.id);

    return { id: result.id, url: result.init_point };
  } catch (error) {
    console.error("\n❌ ERRO AO CRIAR PREFERÊNCIA:", error.message);
    return null;
  }
}





// Exportar funções para reutilização no `server.js`
module.exports = {
  criarPreferencia,
  comprarTicket
};

// Executar somente se chamado diretamente (para testes)
if (require.main === module) {
  criarPreferencia(1, "vegetariana", "Campus 1", 2.0)
    .then((res) => console.log("Pagamento gerado:", res))
    .catch((err) => console.error("Erro ao criar pagamento:", err));
}
