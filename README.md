# Plataforma de ensino de eletrônica

Projeto de uma plataforma de ensino online focado em fundamento de eletrônica e análise de circuitos, desenvolvido para a disciplina Certificadora Da Competência 2 - EC46H - 2025/1

## Equipe
- Bruno Garcia Baricelo
- Gabriel Marcondes Trigolo
- Mateus Bernardi Alves
- Pedro Coppo Silva
- Pedro Henrique Silva Oliveira

## Descrição
O projeto visa desenvolver uma plataforma de ensino online, interativa e acessível, focada nos fundamentos de eletrônica e análise de circuitos. A plataforma servirá como uma ferramenta de apoio ao aprendizado para estudantes de engenharia, cursos técnicos e entusiastas da área, complementando o ensino tradicional e facilitando o estudo autônomo.

### Objetivos
- Consolidar Conhecimento: Oferecer um ambiente estruturado onde os usuários possam revisar conceitos teóricos de análise de circuitos (Lei de Ohm, Leis de Kirchhoff, Teoremas de Thévenin/Norton, análise AC/DC, etc.) e eletrônica básica (componentes como resistores, capacitores, indutores, diodos, transistores).
- Aprendizagem Ativa: Implementar um banco de questões robusto com feedback imediato, incluindo perguntas de múltipla escolha e verdadeiro/falso, categorizadas por tópico e nível de dificuldade (Fácil, Médio, Difícil).
- Prática Virtual: Integrar ou referenciar simuladores de circuitos online (como Falstad Circuit Simulator ou similar) com guias e desafios específicos, permitindo aos usuários visualizar o comportamento dos circuitos e validar seus cálculos teóricos.
- Acompanhamento de Progresso: Permitir que os usuários acompanhem seu desempenho e progresso nos diferentes tópicos e níveis de dificuldade.
- Apoio a Projetos de Extensão: Servir como recurso didático para projetos de extensão que envolvam o ensino de eletrônica básica para comunidades específicas (ex: estudantes de escolas públicas, programas de inclusão digital, etc.), fornecendo material de estudo complementar e exercícios práticos.


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
