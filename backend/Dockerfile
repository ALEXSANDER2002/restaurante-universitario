# Usar uma imagem base oficial do Node.js
FROM node:14

# Criar um diretório de trabalho dentro do container
WORKDIR /app

# Copiar o package.json para o diretório de trabalho
COPY package.json ./

# Instalar as dependências definidas no package.json
RUN npm install

# Copiar todos os arquivos da pasta src para o diretório de trabalho dentro do container
COPY ./src /app/src

# Expor a porta 3000 (onde o backend estará rodando)
EXPOSE 3000

# Definir o comando para iniciar o servidor Node.js quando o container for iniciado
CMD ["node", "src/index.js"]
