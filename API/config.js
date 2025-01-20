// Configuração inicial para o Mercado Pago
const mercadoPagoConfig = {
    publicKey: "SUA_CHAVE_PUBLICA_AQUI", // Substitua pela sua chave pública
    accessToken: "SEU_ACCESS_TOKEN_AQUI", // Substitua pelo seu token de acesso
    endpoint: "https://api.mercadopago.com/v1/payments", // Endpoint da API de pagamento
};

// Função para criar o link de pagamento
async function criarPagamento(dados) {
    try {
        const resposta = await fetch(mercadoPagoConfig.endpoint, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${mercadoPagoConfig.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados),
        });

        if (!resposta.ok) {
            throw new Error("Erro ao criar o pagamento");
        }

        const dadosPagamento = await resposta.json();
        return dadosPagamento.init_point; // Retorna o link de pagamento
    } catch (erro) {
        console.error("Erro ao criar o pagamento:", erro);
    }
}

// Exportar as funções para uso em outros scripts
export { mercadoPagoConfig, criarPagamento };
