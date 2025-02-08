# Usando uma imagem base do Node.js
FROM node:18

# Definindo o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiando o package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Instalando as dependências
RUN npm install

# Copiando o código da aplicação
COPY . .

# Expondo a porta onde a aplicação vai rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "server.js"]
