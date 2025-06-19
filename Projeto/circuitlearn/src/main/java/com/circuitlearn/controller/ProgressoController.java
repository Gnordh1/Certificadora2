package com.circuitlearn.controller;

import com.circuitlearn.dto.ProgressoGeralDTO;
import com.circuitlearn.service.ProgressoService;
import jakarta.servlet.http.HttpSession;
import com.circuitlearn.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint da API REST para consultar o progresso do usuário.
 */
@RestController
@RequestMapping("/api/progresso")
public class ProgressoController {

    @Autowired
    private ProgressoService progressoService;

    /**
     * Calcula e retorna as estatísticas de progresso do usuário autenticado.
     *
     * @param session A sessão HTTP, usada para obter o usuário logado de forma segura.
     * @return Um DTO com o progresso ou uma resposta de erro (401 ou 404).
     */
    @GetMapping
    public ResponseEntity<?> getProgressoDoUsuario(HttpSession session) {
        // Recupera o usuário da sessão para garantir que um usuário só possa ver seu próprio progresso.
        Usuario usuarioLogado = (Usuario) session.getAttribute("currentUsuario");

        if (usuarioLogado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }

        try {
            ProgressoGeralDTO progresso = progressoService.calcularProgresso(usuarioLogado.getId());
            return ResponseEntity.ok(progresso);
        } catch (RuntimeException e) {
            // Captura erros do serviço, como "Usuário não encontrado".
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}