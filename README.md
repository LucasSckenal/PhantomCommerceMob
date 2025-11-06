# PhantomCommerce

## 📚 Índice

<div align="center">

<table>
  <tr>
    <td><a href="#visão-geral">🔹 Visão Geral</a></td>
    <td><a href="#funcionalidades">🎮 Funcionalidades</a></td>
    <td><a href="#tecnologias-utilizadas">⚙️ Tecnologias</a></td>
  </tr>
  <tr>
    <td><a href="#arquitetura--estrutura-do-projeto">🏗️ Estrutura</a></td>
    <td><a href="#instalação--setup">💻 Instalação</a></td>
    <td><a href="#configurações--variáveis-de-ambiente">🔐 Variáveis</a></td>
  </tr>
  <tr>
    <td><a href="#executando-o-projeto">🚀 Execução</a></td>
    <td><a href="#contribuição">🤝 Contribuição</a></td>
    <td><a href="#autores--membros-do-grupo">👥 Autores</a></td>
  </tr>
  <tr>
    <td><a href="#licença">📄 Licença</a></td>
    <td></td>
    <td></td>
  </tr>
</table>

</div>



---

## Visão Geral

O **PhantomCommerce** é uma plataforma de e‑commerce especializada em jogos, agora refatorada como um aplicativo móvel híbrido usando o framework Ionic. Permite aos usuários navegar por catálogos de jogos, visualizar detalhes, adicionar ao carrinho e autenticar-se, tudo uma experiência otimizada para mobile.

![Exemplo da página de produto](phantomcommercemob/public/example_productpage.png)

---

## Funcionalidades

- Listagem de jogos com busca e filtros;
- Página de detalhes do produto (descrição, imagens, preço);
- Carrinho de compras persistente (Firebase para usuários logados e Preferences para convidados);
- Autenticação de usuários (Login, Registro) com Firebase Auth;
- Design responsivo e "mobile-first";
- Carrosel de destaques e seções de "Mais Vendidos" e "Gêneros".

---

## Tecnologias Utilizadas

- **Frontend**: Ionic Framework, React, TypeScript, SCSS;
- **Banco de Dados**: FireBase (Firestore, Authentication, Storage);
- **Frameworks / Bibliotecas**: React, Ionic Framework, ionicons/icons, Swiper.js e Capacitor (@capacitor/preferences);
- **Ferramentas de build / bundlers**: Vite.

---

## Arquitetura & Estrutura do Projeto

Uma visão de alto nível da estrutura de pastas:
```plaintext
myapp/
├── public/ # Ícones e assets estáticos
├── src/
│ ├── components/ # Componentes React reutilizáveis (GameCard, Header, etc.)
│ ├── contexts/ # Contextos React (AuthContext, CartContext, etc.)
│ ├── lib/ # Configuração do Firebase
│ ├── pages/ # As páginas da aplicação (HomePage, LoginPage, etc.)
│ ├── theme/ # CSS global (variables.css)
│ ├── App.tsx # Definição principal das rotas (React Router)
│ └── main.tsx # Ponto de entrada da aplicação
├── .env.local # Chaves de API (NÃO versionada)
├── capacitor.config.ts # Configuração do Capacitor (para build nativo)
├── ionic.config.json # Configuração do Ionic
├── package.json
└── tsconfig.json
```
---

## Instalação & Setup

Siga os passos abaixo para rodar o projeto localmente:

```bash
# Clone o repositório
git clone https://github.com/LucasSckenal/PhantomCommerceMob.git

# Entre na pasta do projeto
cd myapp

# Instale as dependências
npm install

# Instale as bibliotecas necessárias que não são padrão
npm install firebase swiper @capacitor/preferences
```

---

## Configurações & Variáveis de Ambiente

Crie um arquivo `.env.local` com as seguintes variáveis (exemplos):

```
# Exemplo
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

---

## Executando o Projeto

Depois de instalar e configurar:

```bash
ionic serve
```

Abra no navegador:

```
http://localhost:8100
```
---

## Executando o Projeto no Android Studio

```bash
ionic build
ionic cap sync android //ou ionic cap add android se foi a primeira vez
ionic cap open android
```

E aí é só clicar em "Run" e desfrutar!

OBS.: Se quiser usar IOS, é só modificar os comandos para usar "ios"
---

## Contribuição

Seja bem-vindo a colaborar!  

1. Faça um fork deste repositório  
2. Crie uma branch com sua feature ou correção: `git checkout -b minha-feature`  
3. Faça commits das suas alterações: `git commit -m "Descrição da feature"`  
4. Envie para seu fork: `git push origin minha-feature`  
5. Abra um Pull Request explicando a mudança  

Por favor siga o padrão de código, mantenha testes atualizados, etc.

---

## Autores / Membros do Grupo

| Nome              | Links | E-Mail |
| ----------------- | ---------------------- | ---------------------- |
| Henrique Luan F.  | [LinkedIn](https://www.linkedin.com/in/henrique-luan-fritz-70412635a/)        | [Henrique.fritz@sou.unijui.edu.br](mailto:Henrique.fritz@sou.unijui.edu.br) |
| Luan Vitor C. D. | [LinkedIn](https://www.linkedin.com/in/luan-vitor-casali-dallabrida-20a60a342/)        | [luanvitorcd@gmail.com](mailto:luanvitorcd@gmail.com) |
| Lucas P. Sckenal   | [LinkedIn](https://www.linkedin.com/in/lucassckenal/)        | [lucaspsckenal@gmail.com](mailto:lucaspsckenal@gmail.com) |

---

## Licença

Este projeto está licenciado sob os termos da licença [MIT](./LICENSE).

