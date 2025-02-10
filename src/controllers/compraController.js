const Compra = require('../models/Compra');  // Importando o Model de Compra

// Função para listar compras do usuário
const listarCompras = async (user_id) => {
    try {
        const compras = await Compra.listarCompras(user_id);  // Chama o metodo assíncrono do Model
        return compras;
    } catch (error) {
        console.error('Erro ao listar compras:', error);
        throw error;
    }
};

// Função para deletar uma compra
const deletarCompra = async (id) => {
    try {
        const resultado = await Compra.deletarCompra(id); // Chama o metodo no Model
        return resultado;
    } catch (error) {
        console.error("Erro ao deletar compra:", error);
        throw error;
    }
};

// Função para criar uma compra
const criarCompra = async (user_id, tipo_comida, campus, valor) => {
    try {
        const compraId = await Compra.criarCompra(user_id, tipo_comida, campus, valor);  // Chama o metodo assíncrono do Model
        return compraId;
    } catch (error) {
        console.error('Erro ao criar compra:', error);
        throw error;
    }
};

module.exports = {
    listarCompras,
    deletarCompra,
    criarCompra
};
