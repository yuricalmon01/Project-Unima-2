FROM node:18

# diretório de trabalho
WORKDIR /app

# copiar arquivos de dependências
COPY package*.json ./

# instalar dependências
RUN npm install

# copiar o restante do código
COPY . .

# expor porta da API
EXPOSE 3000

# rodar app
CMD ["npm", "start"]
