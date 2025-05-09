# CircuitLearn - Pagina de questionário



## Funcionalidades Principais

*   **Listagem de Exercícios:** Permite buscar exercícios com filtros por tópico (categoria) e nível de dificuldade.
*   **Paginação e Ordenação:** Suporte para paginação e ordenação dos resultados dos exercícios.
*   **Filtragem Personalizada:** Opção de filtrar exercícios para não exibir aqueles que um usuário específico já respondeu corretamente.
*   **Verificação de Respostas:** Endpoint para submeter a resposta de um usuário a um exercício e verificar se está correta.
*   **Registro de Tentativas:** Armazena as respostas dos usuários, indicando se foram corretas e a data da resposta.
*   **Servir Conteúdo Estático:** Capacidade de servir páginas HTML (ex: página de listagem de exercícios).
*   **CORS Configurado:** Permite requisições de frontends específicos (ex: `http://localhost:5500`).

## Tecnologias Utilizadas

*   **Java 21**
*   **Spring Boot 3.4.5**
    *   Spring Web (para APIs REST e controllers MVC)
    *   Spring Data JPA (para persistência de dados)
    *   Spring Boot Starter Test (para testes)
*   **Hibernate** (como implementação JPA)
*   **MySQL** (Banco de Dados Relacional)
*   **Maven** (Gerenciamento de dependências e build do projeto)

## Pré-requisitos

*   JDK 21 ou superior instalado.
*   Maven 3.6+ instalado.
*   Servidor MySQL instalado e em execução.

## Configuração do Banco de Dados

Antes de executar a aplicação, você precisa configurar a conexão com o seu banco de dados MySQL.

1.  **Configure o `application.properties`:**
    O arquivo de configuração principal é o `src/main/resources/application.properties`. Você precisará editar este arquivo com as suas credenciais de banco de dados.

    Exemplo de configuração:
    ```properties
    # Server Port
	server.port=8080

	#Database Configuration
	spring.datasource.url=jdbc:mysql://localhost:3306/circuit_learn_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
	spring.datasource.username=SEU-USER
	spring.datasource.password=SUA-SENHA
	spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

	#JPA/Hibernate Configuration
	spring.jpa.hibernate.ddl-auto=update 
	spring.jpa.show-sql=true
	spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

	#Logging
	logging.level.org.hibernate.SQL=DEBUG
	logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
    # Dialeto para MySQL
    ```
    **Observação:** Substitua `SEU-USER` e `SUA-SENHA` pelas suas credenciais do MySQL. 

2.  **Popule o banco de dados**
    O arquivo data.sql em `src/main/resources` possui dados iniciais para testar a aplicação, para isso, basta copiar o comando SQL do arquivo e colar e executar no seu MySQL Workbench.

## Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-seu-repositorio>
    cd circuitlearn
    ```

2.  **Configure o `application.properties`** conforme descrito na seção "Configuração do Banco de Dados", e popule o banco de dados com os comandos em `data.sql`

3.  **Compile e execute a aplicação usando Maven:**
    ```bash
    mvn spring-boot:run
    ```
    A aplicação estará disponível em `http://localhost:8080/exercicios`.

## Estrutura do Projeto (Principais Pacotes)

*   `com.circuitlearn.config`: Configurações da aplicação (ex: `WebConfig` para CORS).
*   `com.circuitlearn.controller`: Controladores REST (`ExercicioController`) e MVC (`WebPageController`).
*   `com.circuitlearn.dto`: Data Transfer Objects (DTOs) para comunicação entre camadas e API.
*   `com.circuitlearn.model`: Entidades JPA (`Usuario`, `Exercicio`, `RespostaUsuario`) e Enums (`NivelDificuldade`).
*   `com.circuitlearn.repository`: Interfaces Spring Data JPA para acesso ao banco de dados.
*   `com.circuitlearn.service`: Classes de serviço contendo a lógica de negócios (`ExercicioService`).
*   `src/main/resources/static`: Local para arquivos estáticos (HTML, CSS, JavaScript). O `WebPageController` serve `exercicios.html` a partir daqui.
*   `pom.xml`: Arquivo de configuração do Maven, define dependências e build.

## Endpoints da API

A base da API é `/api`.

*   **GET `/api/exercicios`**: Lista exercícios com filtros e paginção.
    *   Query Params:
        *   `topico` (String, opcional, default: "todos"): Filtra por categoria do exercício.
        *   `nivel` (String, opcional, default: "todos"): Filtra por nível de dificuldade (ex: "FACIL", "MEDIO", "DIFICIL").
        *   `usuarioId` (Long, opcional): Se fornecido, exclui exercícios que este usuário já respondeu corretamente.
        *   `page` (int, opcional, default: 0): Número da página.
        *   `size` (int, opcional, default: 10): Tamanho da página.
        *   `sort` (String[], opcional, default: "id,asc"): Campo e direção para ordenação (ex: "titulo,desc").
*   **GET `/api/exercicios/{id}`**: Retorna os detalhes de um exercício específico.
*   **POST `/api/exercicios/{exercicioId}/verificar`**: Submete uma resposta para um exercício e retorna o resultado da verificação.
    *   Corpo da Requisição (JSON):
        ```json
        {
          "resposta": 0, // Índice da alternativa escolhida pelo usuário
          "usuarioId": 1 // ID do usuário (opcional, para registrar a resposta)
        }
        ```
    *   Resposta (JSON):
        ```json
        {
          "correta": true, // ou false
          "feedback": "Parabéns, resposta correta!",
          "respostaCorreta": 0 // Índice da alternativa correta
        }
        ```

## Endpoints de Páginas Web

*   **GET `/exercicios`**: Serve a página `exercicios.html` localizada em `src/main/resources/static/`.

## Desenvolvimento Frontend

O `WebConfig.java` está configurado para permitir requisições CORS de:
*   `http://localhost:5500`
*   `http://127.0.0.1:5500`

Isso é útil se você estiver desenvolvendo um frontend separadamente, por exemplo, usando o Live Server do VS Code.

---

Sinta-se à vontade para contribuir ou sugerir melhorias!
