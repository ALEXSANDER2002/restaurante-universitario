const mercadopago = require('mercadopago');
const axios = require('axios'); // Para requisições HTTP no Node.js

// ✅ Configuração do Mercado Pago
const mpClient = new mercadopago.MercadoPagoConfig({
  accessToken: "APP_USR-8540766672404155-012611-18119369f6e3b8b42eeea53446a27387-2231764145",
  options: { timeout: 5000 }
});

const preference = new mercadopago.Preference(mpClient);

// ✅ Criar uma nova preferência de pagamento
async function criarPreferencia(user_id, tipo_comida, campus, valor) {
  try {
    if (![2, 13].includes(parseFloat(valor))) {
      throw new Error("Valor inválido. Apenas R$2,00 ou R$13,00 são permitidos.");
    }

    const result = await preference.create({
      body: {
        items: [
          {
            id: valor === 2 ? "2R" : "13R",
            title: `TICKET_RU - R$${valor}`,
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

    console.log(`\n✅ PREFERÊNCIA CRIADA PARA R$${valor}!`);
    console.log("URL:", result.init_point);
    console.log("ID:", result.id);

    return { id: result.id, url: result.init_point };
  } catch (error) {
    console.error("\n❌ ERRO AO CRIAR PREFERÊNCIA:", error.message);
    return null;
  }
}

// ✅ Adicionando a função `comprarTicket`
async function comprarTicket(user_id, tipo_comida, campus, valor) {
  try {
    const response = await axios.post("http://localhost:3000/salvar-compra", {
      user_id,
      tipo_comida,
      campus,
      valor
    });

    console.log("✅ Compra registrada com sucesso!", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao conectar ao servidor:", error);
    throw new Error("Erro ao registrar compra.");
  }
}

// ✅ Exportar corretamente
module.exports = {
  criarPreferencia,
  comprarTicket
};

// ✅ Executar automaticamente para testar R$2 e R$13
if (require.main === module) {
  const user_id = 1;
  const tipo_comida = "vegetariana";
  const campus = "Campus 1";

  // Criar preferências para ambos os valores
  Promise.all([
    criarPreferencia(user_id, tipo_comida, campus, 2),
    criarPreferencia(user_id, tipo_comida, campus, 13)
  ])
  .then((responses) => {
    console.log("\n🔗 URLs geradas para pagamento:");
    responses.forEach((res, index) => {
      if (res) {
        console.log(`✅ Pagamento ${index + 1}: ${res.url}`);
      } else {
        console.log(`❌ Erro ao criar pagamento ${index + 1}`);
      }
    });
  })
  .catch((err) => console.error("❌ Erro ao criar pagamentos:", err));
}
