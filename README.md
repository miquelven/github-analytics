# GitHub Analytics 📊

> Uma plataforma moderna e poderosa para análise detalhada de perfis e repositórios do GitHub.

![GitHub Analytics Banner](https://img.shields.io/badge/GitHub-Analytics-blue?style=for-the-badge&logo=github)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)

## 📖 Sobre o Projeto

O **GitHub Analytics** é uma aplicação web desenvolvida para fornecer insights profundos sobre usuários e repositórios do GitHub. Com uma interface moderna e responsiva, o projeto permite que desenvolvedores e recrutadores visualizem métricas, hábitos de commit, tecnologias mais utilizadas e muito mais.

O projeto utiliza a **GitHub API** para buscar dados em tempo real e apresenta as informações através de gráficos interativos e componentes visuais intuitivos.

## ✨ Funcionalidades Principais

- **🔍 Análise de Perfil de Usuário**:

  - Visão geral do perfil com estatísticas principais.
  - **Heatmap de Contribuições** interativo.
  - Gráficos de distribuição de linguagens.
  - Lista de repositórios e organizações.

- **📦 Detalhes de Repositórios**:

  - Visualização detalhada de qualquer repositório público.
  - Renderização do `README.md` diretamente na aplicação.
  - Análise de contribuidores e linguagens utilizadas.

- **🆚 Comparação (Versus)**:

  - Compare dois perfis lado a lado para ver quem tem mais contribuições, seguidores, etc.
  - Ideal para benchmarks e análises competitivas.

- **📈 Trending**:

  - Descubra o que está em alta no GitHub no momento.

- **🎨 UI/UX Moderna**:
  - **Dark Mode** e Light Mode totalmente suportados.
  - **Internacionalização (i18n)**: Suporte para Português (BR) e Inglês (US).
  - Design responsivo e acessível com Shadcn UI e Tailwind CSS.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as tecnologias mais recentes do ecossistema React:

- **[Next.js 16](https://nextjs.org/)**: Framework React com App Router para performance e SEO.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática para maior segurança e manutenibilidade.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Estilização utilitária e moderna.
- **[Shadcn UI](https://ui.shadcn.com/)** & **[Radix UI](https://www.radix-ui.com/)**: Componentes de interface acessíveis e customizáveis.
- **[Recharts](https://recharts.org/)**: Biblioteca para construção de gráficos de dados.
- **[Octokit](https://github.com/octokit/octokit.js)**: SDK oficial para interagir com a API do GitHub.
- **[React Activity Calendar](https://grubersjoe.github.io/react-activity-calendar/)**: Componente estilo GitHub para visualização de contribuições.

## 🚀 Como Executar

Siga os passos abaixo para rodar o projeto em sua máquina local.

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn** ou **pnpm**

### Passo a Passo

1.  **Clone o repositório**:

    ```bash
    git clone https://github.com/seu-usuario/github-analytics.git
    cd github-analytics
    ```

2.  **Instale as dependências**:

    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    ```

3.  **Configure as Variáveis de Ambiente**:
    Crie um arquivo `.env.local` na raiz do projeto e adicione seu token do GitHub (necessário para aumentar o limite de requisições da API):

    ```env
    NEXT_PUBLIC_GITHUB_TOKEN=seu_token_github_aqui
    ```

    > **Nota**: Você pode gerar um token (Personal Access Token) nas configurações de desenvolvedor do seu perfil no GitHub.

4.  **Execute o servidor de desenvolvimento**:

    ```bash
    npm run dev
    ```

5.  **Acesse a aplicação**:
    Abra seu navegador e vá para `http://localhost:3000`.

## 📂 Estrutura do Projeto

```
src/
├── app/                 # Rotas e páginas (App Router)
│   ├── compare/         # Página de comparação
│   ├── repo/            # Páginas de detalhes de repositório
│   ├── trending/        # Página de tendências
│   ├── user/            # Páginas de perfil de usuário
│   └── ...
├── components/          # Componentes React
│   ├── ui/              # Componentes base (Shadcn UI)
│   ├── user/            # Componentes específicos de usuário
│   ├── repo/            # Componentes específicos de repositório
│   └── ...
├── lib/                 # Utilitários e configurações (API Client)
└── ...
```

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um Pull Request.

1.  Faça um Fork do projeto
2.  Crie uma Branch para sua Feature (`git checkout -b feature/MinhaFeature`)
3.  Faça o Commit de suas mudanças (`git commit -m 'Adiciona: MinhaFeature'`)
4.  Faça o Push para a Branch (`git push origin feature/MinhaFeature`)
5.  Abra um Pull Request

---

Feito com 💜 por [Miquelven](https://github.com/miquelven)
