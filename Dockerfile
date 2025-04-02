# Use a imagem do Node.js do projeto
FROM node:18

# Definindo o diretório de trabalho dentro do container
WORKDIR /src

# Copiando apenas os arquivos necessários para instalar as dependências
COPY package*.json ./

# Instalando as dependências do projeto
RUN npm install

# Copie o restante dos arquivos do projeto para o container
COPY . .

# Exponha a porta usada pela aplicação
EXPOSE 6669

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]