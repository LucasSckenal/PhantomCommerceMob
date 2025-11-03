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

O **PhantomCommerce** é uma plataforma de e‑commerce especializada em jogos.  
Permite aos usuários navegar por catálogos de jogos, visualizar detalhes, adicionar ao carrinho, etc.

![Exemplo da página de produto](phantomcommerce/public/example_productpage.png)

---

## Funcionalidades

- Listagem de jogos  
- Página de detalhe de jogo (descrição, imagens, preço)  
- Carrinho de compras  
- Gerenciamento administrativo (adicionar jogos)  
- Autenticação de usuários / login / logout  
- Filtros / busca de jogos  
- UI amigável  

---

## Tecnologias Utilizadas

- **Frontend**: NextJS, SCSS  
- **Backend / API**: NextJS  
- **Banco de Dados**: FireBase  
- **Frameworks / Bibliotecas**: React, Lucide-Icons, React-Icons, FireBase e Sass  
- **Ferramentas de build / bundlers**: Next

---

## Arquitetura & Estrutura do Projeto

Uma visão de alto nível da estrutura de pastas:

![Estrutura do projeto](phantomcommerce/public/project_structure.png)

---

## Instalação & Setup

Siga os passos abaixo para rodar o projeto localmente:

```bash
# Clone o repositório
git clone https://github.com/LucasSckenal/PhantomCommerce.git

# Entre na pasta do projeto
cd PhantomCommerce

# Instale as dependências
npm install
```

---

## Configurações & Variáveis de Ambiente

Crie um arquivo `.env.local` com as seguintes variáveis (exemplos):

```
# Exemplo
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

---

## Executando o Projeto

Depois de instalar e configurar:

```bash
npm run dev
```

Abra no navegador:

```
http://localhost:3000
```

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

