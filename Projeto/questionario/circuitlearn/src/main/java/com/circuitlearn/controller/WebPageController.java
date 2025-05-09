package com.circuitlearn.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller // Use @Controller, NÃO @RestController para servir views/HTML
public class WebPageController {

    @GetMapping("/exercicios")
    public String mostrarPaginaExercicios() {
        // Se o arquivo HTML estiver em src/main/resources/static/exercicios.html:
        // Spring Boot, por padrão, não resolve "exercicios" para "static/exercicios.html" diretamente
        // sem um view resolver configurado para isso (como Thymeleaf faria para "templates/exercicios.html").
        // A maneira mais explícita e garantida de servir um arquivo de 'static'
        // através de um controller sem a extensão .html na URL é usar "forward:".
        return "forward:/exercicios.html";

        // Alternativa: Se você colocar exercicios.html em src/main/resources/templates/exercicios.html
        // E NÃO tiver Thymeleaf ou outro template engine configurado para processar .html,
        // Spring Boot ainda pode servir como estático.
        // E você poderia retornar apenas "exercicios".
        // Se tiver Thymeleaf, ele tentará processar.
        // Para HTML simples, o "forward:" para a pasta static é mais claro.
    }
}
