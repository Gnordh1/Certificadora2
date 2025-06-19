package com.circuitlearn.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configurações globais da aplicação web, como a política de CORS.
 */
@Configuration
public class WebConfig {

    /**
     * Configura o CORS (Cross-Origin Resource Sharing) para a aplicação.
     * Isso é essencial para permitir que o frontend (rodando em uma origem diferente, ex: localhost:5500)
     * se comunique com a API backend.
     *
     * @return um WebMvcConfigurer com as regras de CORS.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Aplica a regra a todos os endpoints da API.
                        // Permite requisições das origens especificadas (seu frontend).
                        .allowedOrigins("http://localhost:5500", "http://127.0.0.1:5500")
                        // Libera os métodos HTTP padrão.
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        // Permite todos os cabeçalhos na requisição.
                        .allowedHeaders("*")
                        // Permite que o navegador envie credenciais (cookies, headers de autenticação).
                        .allowCredentials(true);
            }
        };
    }
}