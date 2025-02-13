// Importando o Model de Compra para interagir com o banco de dados
const Compra = require('../models/Compra');  // O Model de Compra é responsável pelas operações no banco de dados

// Função para listar compras do usuário
const listarCompras = async (user_id) => {
    try {
        // Chama o método do Model para listar as compras do usuário, passando o 'user_id'
        const compras = await Compra.listarCompras(user_id);  // Método assíncrono que retorna as compras
        return compras;  // Retorna a lista de compras do usuário
    } catch (error) {
        console.error('Erro ao listar compras:', error);  // Registra erro no console caso haja falha
        throw error;  // Lança o erro para ser tratado em outro lugar
    }
};

// Função para deletar uma compra
const deletarCompra = async (id) => {
    try {
        // Chama o método do Model para deletar a compra pelo ID
        const resultado = await Compra.deletarCompra(id); // Método assíncrono que retorna o resultado da exclusão
        return resultado;  // Retorna o resultado da exclusão (sucesso ou falha)
    } catch (error) {
        console.error("Erro ao deletar compra:", error);  // Registra erro no console caso haja falha
        throw error;  // Lança o erro para ser tratado em outro lugar
    }
};

// Função para criar uma nova compra
const criarCompra = async (user_id, tipo_comida, campus, valor) => {
    try {
        // Chama o método do Model para criar uma nova compra com as informações fornecidas
        const compraId = await Compra.criarCompra(user_id, tipo_comida, campus, valor);  // Método assíncrono que retorna o ID da compra criada
        return compraId;  // Retorna o ID da nova compra
    } catch (error) {
        console.error('Erro ao criar compra:', error);  // Registra erro no console caso haja falha
        throw error;  // Lança o erro para ser tratado em outro lugar
    }
};

// Exportando as funções para serem utilizadas em outros arquivos
module.exports = {
    listarCompras,
    deletarCompra,
    criarCompra
};
