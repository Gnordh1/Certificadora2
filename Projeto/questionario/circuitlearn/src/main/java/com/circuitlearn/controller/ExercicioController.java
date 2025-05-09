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

@RestController
@RequestMapping("/api/exercicios")
public class ExercicioController {

    @Autowired
    private ExercicioService exercicioService;

    // MÉTODO MODIFICADO: getExercicios
    @GetMapping
    public ResponseEntity<Page<ExercicioDTO>> getExercicios(
            @RequestParam(value = "topico", required = false, defaultValue = "todos") String topico,
            @RequestParam(value = "nivel", required = false, defaultValue = "todos") String nivel,
            @RequestParam(value = "usuarioId", required = false) Long usuarioId, // NOVO PARÂMETRO
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size, // Aumentado default size para ver mais exercícios
            @RequestParam(value = "sort", defaultValue = "id,asc") String[] sort) {

        String sortField = sort[0];
        Sort.Direction sortDirection = (sort.length > 1 && sort[1].equalsIgnoreCase("desc")) ?
                Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortField));
        Page<ExercicioDTO> exercicios = exercicioService.getExercicios(topico, nivel, usuarioId, pageable); // Passa usuarioId
        return ResponseEntity.ok(exercicios);
    }

    // getExercicioById (mantido como antes)
    @GetMapping("/{id}")
    public ResponseEntity<ExercicioDTO> getExercicioById(@PathVariable Long id) {
        return exercicioService.findById(id)
                .map(ex -> new ExercicioDTO( // Conversão para DTO aqui também
                        ex.getId(),
                        ex.getTitulo(),
                        ex.getEnunciado(),
                        ex.getAlternativas(),
                        ex.getDificuldade() != null ? ex.getDificuldade().getNomeAmigavel() : null,
                        ex.getCategoria()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // verificarResposta (mantido como antes)
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
            return ResponseEntity.badRequest().body(new VerificacaoResponseDTO(false, e.getMessage(), null));
        }
    }
}