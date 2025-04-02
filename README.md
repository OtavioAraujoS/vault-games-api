<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" /></a>
</p>

# Vault Games API

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![NestJS](https://img.shields.io/badge/NestJS-v10-red)
![MongoDB](https://img.shields.io/badge/MongoDB-NoSQL-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Supported-blue)
![License](https://img.shields.io/badge/License-UNLICENSED-lightgrey)

Este projeto é uma API desenvolvida com NestJS para gerenciar dados de jogos.

## 🚀 Tecnologias Utilizadas

- **NestJS**: Framework para construção de aplicações escaláveis em Node.js.
- **MongoDB**: Banco de dados NoSQL utilizado para armazenamento dos dados.
- **Mongoose**: ODM (Object-Document Mapping) para integração com MongoDB.
- **Swagger**: Documentação da API.
- **RxJS**: Programação reativa para manipulação de fluxos de dados.
- **ESLint & Prettier**: Ferramentas para padronização e formatação de código.
- **Jest & Supertest**: Testes unitários e de integração.
- **Dotenv**: Gerenciamento de variáveis de ambiente.

## 📌 Requisitos

- **Node.js** (versão recomendada: 20.x)
- **NPM** ou **Yarn**
- **Docker** (caso queira rodar o projeto via container)

## 🔧 Instalação

1. Clone o repositório:

   ```sh
   git clone https://github.com/seu-usuario/vault-games-api.git
   ```

2. Acesse o diretório do projeto:

   ```sh
   cd vault-games-api
   ```

3. Instale as dependências:

   ```sh
   npm install
   ```

   ou

   ```sh
   yarn install
   ```

## 🚀 Execução do Projeto

### 🔥 Modo Desenvolvimento

```sh
npm run start:dev
```

### ⚡ Modo Produção

```sh
npm run build
npm run start:prod
```

## 🐳 Rodando com Docker

Para executar a API utilizando Docker, siga os passos abaixo:

1. Certifique-se de que o Docker está instalado na sua máquina.
2. Construa a imagem do Docker:
   ```sh
   docker build -t vault-games-api .
   ```
3. Rode o container:
   ```sh
   docker-compose up --build
   ```

A API estará disponível em `http://localhost:3000`.

## ✅ Testes

- Rodar os testes unitários:
  ```sh
  npm run test
  ```
- Rodar os testes com cobertura de código:
  ```sh
  npm run test:cov
  ```
- Rodar os testes end-to-end:
  ```sh
  npm run test:e2e
  ```

## 📄 Documentação da API

A documentação da API está disponível via Swagger. Após iniciar o projeto, acesse:

```
http://localhost:3000/api
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b minha-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adicionando nova feature'`)
4. Envie para o repositório (`git push origin minha-feature`)
5. Abra um Pull Request

## 📜 Licença

Este projeto está sob a licença **MIT**.
