const mercadopago = require('mercadopago');

// Configuração correta para v2.x+ do SDK
const client = new mercadopago.MercadoPagoConfig({
  accessToken: 'APP_USR-8540766672404155-012611-18119369f6e3b8b42eeea53446a27387-2231764145',
  options: { timeout: 5000 }
});

const preference = new mercadopago.Preference(client);

async function criarPreferencia() {
  try {
    const result = await preference.create({
      body: {
        items: [
          {
            id: "1",
            title: "TICKET_RU",
            quantity: 1,
            currency_id: "BRL",
            unit_price: 2.0
          }
        ],
        back_urls: {
          success: "http://localhost:5000/compracerta",
          failure: "http://localhost:5000/compraerrada",
          pending: "http://localhost:5000/compraerrada"
        },
        auto_return: "approved",
        payment_methods: {
          excluded_payment_types: [{ id: "atm" }],
          installments: 1
        }
      }
    });

    console.log("\n✅ PREFERÊNCIA CRIADA!");
    console.log("URL:", result.init_point);
    console.log("ID:", result.id);
    return result;

  } catch (error) {
    console.error("\n❌ ERRO:", error.message);
    console.log("Detalhes:", error);
    return null;
  }
}

// Executar somente se chamado diretamente
if (require.main === module) {
  criarPreferencia();
}