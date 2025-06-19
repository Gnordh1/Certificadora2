package com.circuitlearn.controller;

import com.circuitlearn.dto.ExercicioDTO;
import com.circuitlearn.dto.RespostaRequestDTO;
import com.circuitlearn.dto.VerificacaoResponseDTO;
import com.circuitlearn.service.ExercicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoint da API REST para todas as operações relacionadas a exercícios.
 */
@RestController
@RequestMapping("/api/exercicios")
public class ExercicioController {

    @Autowired
    private ExercicioService exercicioService;

    /**
     * Busca uma lista paginada de exercícios, com filtros opcionais.
     *
     * @param topico Categoria do exercício a ser filtrada.
     * @param nivel Nível de dificuldade a ser filtrado.
     * @param usuarioId ID do usuário para filtrar exercícios (ex: não resolvidos).
     * @param page Número da página (inicia em 0).
     * @param size Quantidade de itens por página.
     * @param sort Critério de ordenação (ex: "id,asc").
     * @return Uma página (Page) de ExercicioDTO.
     */
    @GetMapping
    public ResponseEntity<Page<ExercicioDTO>> getExercicios(
            @RequestParam(value = "topico", required = false, defaultValue = "todos") String topico,
            @RequestParam(value = "nivel", required = false, defaultValue = "todos") String nivel,
            @RequestParam(value = "usuarioId", required = false) Long usuarioId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "id,asc") String[] sort) {

        String sortField = sort[0];
        Sort.Direction sortDirection = (sort.length > 1 && sort[1].equalsIgnoreCase("desc")) ?
                Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortField));
        Page<ExercicioDTO> exercicios = exercicioService.getExercicios(topico, nivel, usuarioId, pageable);
        return ResponseEntity.ok(exercicios);
    }

    /**
     * Busca um único exercício pelo seu ID.
     *
     * @param id O ID do exercício.
     * @return O ExercicioDTO correspondente ou 404 Not Found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ExercicioDTO> getExercicioById(@PathVariable Long id) {
        return exercicioService.findById(id)
                // Converte a entidade Exercicio para DTO para controlar os dados expostos.
                .map(ex -> new ExercicioDTO(
                        ex.getId(),
                        ex.getTitulo(),
                        ex.getEnunciado(),
                        ex.getAlternativas(),
                        ex.getDificuldade() != null ? ex.getDificuldade().getNomeAmigavel() : null,
                        ex.getCategoria()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Verifica a resposta de um usuário para um determinado exercício.
     *
     * @param exercicioId O ID do exercício a ser verificado.
     * @param respostaRequest DTO contendo o ID do usuário e o índice da resposta.
     * @return Um DTO com o resultado da verificação (correta ou não) e o feedback.
     */
    @PostMapping("/{exercicioId}/verificar")
    public ResponseEntity<VerificacaoResponseDTO> verificarResposta(
            @PathVariable Long exercicioId,
            @RequestBody RespostaRequestDTO respostaRequest) {
        try {
            Long usuarioId = respostaRequest.getUsuarioId();
            VerificacaoResponseDTO verificacao = exercicioService.verificarResposta(
                    exercicioId,
                    respostaRequest.getResposta(),
                    usuarioId
            );
            return ResponseEntity.ok(verificacao);
        } catch (RuntimeException e) {
            // Em caso de erro (ex: exercício não encontrado), retorna uma resposta clara.
            return ResponseEntity.badRequest().body(new VerificacaoResponseDTO(false, e.getMessage(), null));
        }
    }
}