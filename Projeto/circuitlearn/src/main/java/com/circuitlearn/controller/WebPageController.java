package com.circuitlearn.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller responsável por servir as páginas HTML estáticas da aplicação.
 * Utiliza @Controller em vez de @RestController para permitir o encaminhamento de views.
 */
@Controller
public class WebPageController {

    /**
     * Mapeia a URL raiz ("/") para a página de login.
     * Esta será a página inicial da aplicação.
     * @return O caminho para o arquivo HTML de login.
     */
    @GetMapping("/")
    public String mostrarPaginaInicial() {
        return "forward:/login.html";
    }

    /**
     * Serve a página principal de listagem de exercícios.
     * @return O caminho para o arquivo HTML estático.
     */
    @GetMapping("/exercicios")
    public String mostrarPaginaExercicios() {
        return "forward:/exercicios.html";
    }

    /**
     * Serve a página de login.
     * @return O caminho para o arquivo HTML de login.
     */
    @GetMapping("/login")
    public String mostrarPaginaLogin() {
        return "forward:/login.html";
    }
}