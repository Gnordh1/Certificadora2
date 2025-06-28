

# CircuitLearn - Plataforma Interativa de Ensino de Eletrônica

![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white) ![Spring](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

**CircuitLearn** é uma plataforma web educacional desenvolvida como parte do curso de Engenharia de Computação da **Universidade Tecnológica Federal do Paraná (UTFPR) - Campus Cornélio Procópio**, desenvolvido para a disciplina Certificadora Da Competência 2 - EC46H - 2025/1. O projeto visa preencher a lacuna entre o aprendizado teórico e a aplicação prática da eletrônica, oferecendo um ambiente interativo para estudantes e entusiastas.
Projeto de uma plataforma de ensino online focado em fundamento de eletrônica e análise de circuitos, 

---


## 📋 Tabela de Conteúdos

1.  Sobre o Projeto
2.  Equipe
3.  Principais Funcionalidades
4.  Tecnologias Utilizadas
5.  Arquitetura da Solução
6.  Rodando o Projeto Localmente
7.  Endpoints da API
8.  Estrutura do Frontend (Páginas)




---

## 🎯 Sobre o Projeto

O estudo de análise de circuitos é um pilar fundamental na formação em tecnologia. No entanto, o acesso a laboratórios físicos nem sempre é suficiente para consolidar o conhecimento de forma prática. O CircuitLearn nasce com o objetivo de criar uma plataforma online completa, oferecendo um ciclo de aprendizado contínuo:

-   📚 **Estudo Teórico:** Acesso a materiais de referência.
-   🧠 **Prática com Exercícios:** Um banco de questões interativas com feedback imediato.
-   🔬 **Validação no Simulador:** Um ambiente virtual para testar conceitos e circuitos.
-   📊 **Acompanhamento de Progresso:** Dashboards para monitorar o desempenho.

A plataforma também serve como um recurso didático para projetos de extensão da UTFPR, como o ELLP (Ensino de Lógica, Linguagens e Programação) e o grupo de robótica Overload.

## 👥 Equipe
- Bruno Garcia Baricelo
- Gabriel Marcondes Trigolo
- Mateus Bernardi Alves
- Pedro Coppo Silva
- Pedro Henrique Silva Oliveira

## ✨ Principais Funcionalidades

-   🧑‍🏫 **Autenticação Completa:** Sistema de registro, login e logout com gerenciamento de sessão, personalizando a experiência do usuário.
-   🧠 **Módulo de Exercícios Interativos:**
    -   Cards de exercícios carregados dinamicamente via API.
    -   Filtros por tópico (Lei de Ohm, Kirchhoff, etc.) e nível de dificuldade (Fácil, Médio, Difícil).
    -   Lista de exercícios personalizada que omite questões já resolvidas corretamente.
    -   Feedback visual e textual instantâneo após a submissão de uma resposta.
-   📈 **Dashboard de Progresso:**
    -   Resumo geral com estatísticas de conclusão, taxa de acerto e tópicos iniciados.
    -   Análise detalhada do desempenho em cada tópico, com barras de progresso.
    -   Recomendações de estudo geradas com base nos pontos de menor desempenho.
-   🔬 **Ambiente de Teoria e Simulação:**
    -   Página de teoria estruturada para receber conteúdo educacional detalhado.
    -   Simulador de circuitos **Falstad** integrado via `<iframe>`, com desafios guiados para prática livre.


## 🛠️ Tecnologias Utilizadas

#### **Backend**

-   **Linguagem:** Java 17+
-   **Framework:** Spring Boot 3.x
    -   **Spring MVC:** Para a construção da API RESTful.
    -   **Spring Data JPA:** Para a camada de persistência de dados.
    -   **Spring Web:** Para funcionalidades web essenciais.
-   **Persistência:** Hibernate (via Spring Data JPA)
-   **Autenticação:** Gerenciamento de sessão via `HttpSession` (protótipo).

#### **Frontend**

-   **Linguagem:** HTML5, CSS3 (com variáveis CSS para design system).
-   **Scripting:** JavaScript (ES6+) para manipulação do DOM, interatividade e chamadas assíncronas (Fetch API).

#### **Banco de Dados e Ferramentas**

-   **Banco de Dados:** MySQL (Relacional)
-   **Controle de Versão:** Git e GitHub
-   **IDEs:** IntelliJ IDEA, Visual Studio Code
-   **Comunicação:** Discord, WhatsApp

## 🏛️  Arquitetura da Solução

A aplicação foi projetada seguindo uma arquitetura multicamadas para garantir separação de responsabilidades, escalabilidade e manutenibilidade.

-   **Camada de Apresentação (Frontend):** Implementada com HTML, CSS e JavaScript, é responsável por toda a interação com o usuário. Consome a API do backend para renderizar páginas de forma dinâmica.
-   **Camada de Aplicação (Backend API):** Desenvolvida com Spring Boot, contém a lógica de negócio, endpoints RESTful, e orquestra as operações. Segue o padrão **Controller-Service-Repository**.
-   **Camada de Persistência (Banco de Dados):** Utiliza MySQL para armazenar de forma persistente os dados de usuários, exercícios e histórico de progresso. O schema é gerenciado pelo Hibernate com base nas entidades JPA.

---



## 🚀 Rodando o Projeto Localmente

Siga os passos abaixo para configurar e executar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados:

-   **JDK 17** ou superior.
-   **Maven** 3.8 ou superior.
-   **MySQL Server** 8.0 ou superior.
-   **Git** para controle de versão.

### Passo a Passo

#### 1. Clonar o Repositório

Primeiro, clone o projeto para a sua máquina local usando o Git.

```bash
git clone https://github.com/Gnordh1/Certificadora2.git
```

**Importante:** O projeto está dentro de uma subpasta. Navegue até o diretório correto:

```bash
cd Certificadora2/Projeto/circuitlearn
```

#### 2. Configurar o Banco de Dados

Agora que você tem o projeto, precisa configurar a conexão com o banco de dados.

1.  **Garanta que seu servidor MySQL esteja em execução.**

2.  **Abra o arquivo de configuração** localizado em `src/main/resources/application.properties`.

3.  **Atualize as credenciais do banco de dados.** A aplicação está configurada para criar o banco de dados chamado `circuitlearn_db` automaticamente. Você só precisa garantir que o usuário e a senha estejam corretos.

    ```properties
    # URL de Conexão com o Banco de Dados
    # O parâmetro createDatabaseIfNotExist=true garante que o banco seja criado.
    spring.datasource.url=jdbc:mysql://localhost:3306/circuitlearn_db?createDatabaseIfNotExist=true

    # Altere o usuário e a senha abaixo para corresponder à sua configuração do MySQL
    spring.datasource.username=root
    spring.datasource.password=utfpr

    # Configuração do Hibernate para criar/atualizar o schema automaticamente
    spring.jpa.hibernate.ddl-auto=update
    ```

#### 3. Popular o Banco de Dados (Passo Crítico)

Para que a plataforma funcione, é necessário carregar os exercícios e outros dados iniciais.

O projeto inclui um arquivo `data.sql` em `src/main/resources/` com todos os dados necessários. Execute o conteúdo do arquivo `src/main/resources/data.sql` diretamente no seu cliente MySQL (MySQL Workbench, DBeaver, etc.) após a aplicação ter criado o banco na primeira execução.

#### 4. Executar a Aplicação

Com tudo configurado, você pode iniciar o servidor.

*   **Via IDE (Recomendado):**
    Abra o projeto na sua IDE de preferência (IntelliJ IDEA ou Eclipse) e execute a classe principal `CircuitlearnApplication.java`. A IDE cuidará de baixar as dependências do Maven.

*   **Via Terminal (Maven):**
    No terminal, a partir da raiz do projeto (`circuitlearn`), execute o comando:
    ```bash
    mvn spring-boot:run
    ```

#### 5. Acessar a Plataforma

Após a inicialização, a aplicação estará disponível no seu navegador em:
**[http://localhost:8080/](http://localhost:8080/)**

Você será redirecionado para a página de login para começar a usar o CircuitLearn.


## 📡 Endpoints da API

Abaixo estão os principais endpoints da API RESTful.

| Método | Endpoint                             | Descrição                                         |
| :----- | :----------------------------------- | :-------------------------------------------------- |
| `POST` | `/api/auth/register`                 | Registra um novo usuário.                           |
| `POST` | `/api/auth/login`                    | Autentica um usuário e cria uma sessão.             |
| `POST` | `/api/auth/logout`                   | Invalida a sessão do usuário.                       |
| `GET`  | `/api/auth/user`                     | Retorna os dados do usuário logado na sessão.       |
| `GET`  | `/api/exercicios`                    | Lista exercícios com filtros e paginação.           |
| `GET`  | `/api/exercicios/{id}`               | Busca um exercício específico por ID.               |
| `POST` | `/api/exercicios/{id}/verificar`     | Verifica a resposta de um exercício.                |
| `GET`  | `/api/progresso`                     | Retorna o dashboard de progresso do usuário logado. |

## 📄 Estrutura do Frontend (Páginas)

O frontend da aplicação foi construído com HTML, CSS e JavaScript puro, focando em uma experiência de usuário clara e interativa. Cada página tem um propósito específico dentro do ecossistema de aprendizado.

#### login.html & cadastro.html

-   **Propósito:** Gestão de acesso dos usuários.
    
-   **Funcionalidades:**
    
    -   **Login:** Formulário para que usuários existentes acessem a plataforma com suas credenciais (email e senha). Fornece feedback em caso de erro.
        
    -   **Cadastro:** Permite que novos usuários criem uma conta. O formulário inclui validações em tempo real para nome, formato de email e complexidade/confirmação da senha, garantindo uma experiência de registro fluida e segura.
        

#### inicio.html

-   **Propósito:** Página de boas-vindas e hub central.
    
-   **Funcionalidades:**
    
    -   Serve como a página inicial após o login.
        
    -   Apresenta uma visão geral da plataforma, destacando suas principais seções: Teoria, Exercícios, Simulador e Progresso.
        
    -   Oferece atalhos rápidos para os principais tópicos de estudo, incentivando o engajamento imediato.
        

#### exercicios.html

-   **Propósito:** Núcleo de aprendizado prático da plataforma.
    
-   **Funcionalidades:**
    
    -   **Listagem Dinâmica:** Exibe exercícios em formato de "cards" interativos, carregados dinamicamente da API /api/exercicios.
        
    -   **Filtragem Avançada:** Permite ao usuário filtrar os exercícios por **Tópico** (Lei de Ohm, Leis de Kirchhoff, etc.) e **Nível** (Fácil, Médio, Difícil).
        
    -   **Personalização:** A lista de exercícios exclui automaticamente as questões que o usuário já respondeu corretamente, focando o estudo em novos desafios.
        
    -   **Interatividade:** O usuário seleciona uma alternativa e clica em "Verificar" para submeter sua resposta.
        
    -   **Feedback Imediato:** Após a verificação, a interface exibe se a resposta foi correta ou incorreta, juntamente com um texto de feedback e, opcionalmente, a resposta correta. As opções são desabilitadas para evitar novas tentativas.
        
    -   **Paginação:** Controles para navegar entre as diferentes páginas de exercícios.
        

#### progresso.html

-   **Propósito:** Dashboard pessoal para monitoramento de desempenho.
    
-   **Funcionalidades:**
    
    -   **Resumo Geral:** Exibe estatísticas consolidadas, como a quantidade de exercícios concluídos sobre o total, a taxa de acerto global e o número de tópicos iniciados.
        
    -   **Desempenho por Tópico:** Apresenta uma análise detalhada para cada categoria de exercício, com barras visuais que indicam o percentual de progresso.
        
    -   **Recomendações Inteligentes:** Gera sugestões de estudo com base nos tópicos de menor desempenho, oferecendo links diretos para a seção de teoria correspondente.
        

#### teoria.html

-   **Propósito:** Biblioteca de conhecimento teórico.
    
-   **Funcionalidades:**
    
    -   Organiza o conteúdo educacional em tópicos de fácil navegação (Lei de Ohm, Componentes, etc.).
        
    -   Cada artigo é estruturado com explicações, fórmulas, exemplos práticos e, em alguns casos, demonstrações interativas simples.
        
    -   Serve como material de referência para consulta antes ou depois de resolver os exercícios.
        

#### simulador.html

-   **Propósito:** Ambiente de prática livre e experimentação.
    
-   **Funcionalidades:**
    
    -   **Integração:** Embuti o simulador de circuitos **Falstad** através de um <iframe\>, proporcionando uma ferramenta poderosa diretamente na plataforma.
        
    -   **Desafios Guiados:** Apresenta uma lista de desafios práticos (ex: "Acenda o LED", "Monte um Divisor de Tensão") que incentivam o usuário a aplicar os conceitos teóricos no simulador.
