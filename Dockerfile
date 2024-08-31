# Use uma imagem base do Node.js 20
FROM node:20.17.0

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências da aplicação
RUN npm install

# Copia o restante do código da aplicação para o diretório de trabalho
COPY . .

# Exponha a porta em que a aplicação estará rodando (altere para a porta usada pela sua aplicação, se necessário)
EXPOSE 3333

# Comando para rodar a aplicação em modo de desenvolvimento
CMD ["npm", "run", "dev"]