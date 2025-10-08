# Imagem base
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências do projeto e o nodemon globalmente
RUN npm install && npm install -g nodemon

# Copia o restante dos arquivos da aplicação
COPY . .

# Expõe a porta usada pela API
EXPOSE 3000

# Comando para iniciar o servidor em modo desenvolvimento
CMD ["npm", "run", "dev"]
