package com.circuitlearn.service;

import com.circuitlearn.dto.ExercicioDTO;
import com.circuitlearn.dto.VerificacaoResponseDTO;
import com.circuitlearn.model.Exercicio;
import com.circuitlearn.model.NivelDificuldade;
import com.circuitlearn.model.RespostaUsuario;
import com.circuitlearn.model.Usuario;
import com.circuitlearn.repository.ExercicioRepository;
import com.circuitlearn.repository.RespostaUsuarioRepository;
import com.circuitlearn.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;
import java.util.List;

/**
 * Service que encapsula a lógica de negócio para operações relacionadas a exercícios,
 * como busca, filtragem e verificação de respostas.
 */
@Service
public class ExercicioService {

    @Autowired
    private ExercicioRepository exercicioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RespostaUsuarioRepository respostaUsuarioRepository;

    /**
     * Busca uma página de exercícios aplicando filtros opcionais.
     * Os filtros podem incluir tópico, nível de dificuldade e um ID de usuário para
     * excluir exercícios já respondidos corretamente por ele.
     *
     * @param topico O slug da categoria para filtrar (ex: "lei-de-ohm").
     * @param nivel O nome do nível de dificuldade para filtrar (ex: "facil").
     * @param usuarioId O ID opcional do usuário para filtrar exercícios não concluídos.
     * @param pageable A informação de paginação.
     * @return Uma {@link Page} de {@link ExercicioDTO} de acordo com os filtros.
     */
    public Page<ExercicioDTO> getExercicios(String topico, String nivel, Long usuarioId, Pageable pageable) {
        Page<Exercicio> exerciciosPage;
        NivelDificuldade nivelEnum = null;

        if (nivel != null && !nivel.equalsIgnoreCase("todos") && !nivel.isEmpty()) {
            try {
                nivelEnum = NivelDificuldade.valueOf(nivel.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Nível inválido é ignorado, resultando em busca sem filtro de dificuldade.
            }
        }

        boolean hasTopico = topico != null && !topico.equalsIgnoreCase("todos") && !topico.isEmpty();
        boolean hasNivel = nivelEnum != null;
        boolean filterByUser = usuarioId != null;

        // Seleciona o método do repositório com base nos filtros fornecidos.
        if (filterByUser) {
            if (hasTopico && hasNivel) {
                exerciciosPage = exercicioRepository.findByCategoriaAndDificuldadeNotAnsweredCorrectlyByUser(topico, nivelEnum, usuarioId, pageable);
            } else if (hasTopico) {
                exerciciosPage = exercicioRepository.findByCategoriaNotAnsweredCorrectlyByUser(topico, usuarioId, pageable);
            } else if (hasNivel) {
                exerciciosPage = exercicioRepository.findByDificuldadeNotAnsweredCorrectlyByUser(nivelEnum, usuarioId, pageable);
            } else {
                exerciciosPage = exercicioRepository.findAllNotAnsweredCorrectlyByUser(usuarioId, pageable);
            }
        } else {
            if (hasTopico && hasNivel) {
                exerciciosPage = exercicioRepository.findByCategoriaAndDificuldade(topico, nivelEnum, pageable);
            } else if (hasTopico) {
                exerciciosPage = exercicioRepository.findByCategoria(topico, pageable);
            } else if (hasNivel) {
                exerciciosPage = exercicioRepository.findByDificuldade(nivelEnum, pageable);
            } else {
                exerciciosPage = exercicioRepository.findAll(pageable);
            }
        }

        return exerciciosPage.map(this::convertToDTO);
    }

    /**
     * Converte uma entidade {@link Exercicio} para seu respectivo DTO, {@link ExercicioDTO}.
     * Este método formata os dados para serem consumidos pelo cliente.
     *
     * @param exercicio A entidade a ser convertida.
     * @return O DTO correspondente.
     */
    private ExercicioDTO convertToDTO(Exercicio exercicio) {
        if (exercicio == null) {
            return new ExercicioDTO(null, null, null, Collections.emptyList(), null, null);
        }

        String dificuldadeStr = (exercicio.getDificuldade() != null)
                ? exercicio.getDificuldade().getNomeAmigavel() : null;

        List<String> alternativas = (exercicio.getAlternativas() != null)
                ? exercicio.getAlternativas() : Collections.emptyList();

        return new ExercicioDTO(
                exercicio.getId(), exercicio.getTitulo(), exercicio.getEnunciado(),
                alternativas, dificuldadeStr, exercicio.getCategoria()
        );
    }

    /**
     * Verifica se a resposta submetida para um exercício está correta.
     * Fornece feedback e, se um ID de usuário for fornecido, registra a tentativa.
     * Este método é transacional.
     *
     * @param exercicioId O ID do exercício sendo respondido.
     * @param respostaSubmetida O índice da alternativa escolhida pelo usuário.
     * @param usuarioId O ID opcional do usuário que está respondendo.
     * @return Um {@link VerificacaoResponseDTO} contendo o resultado da verificação.
     * @throws RuntimeException se o exercício com o ID fornecido não for encontrado.
     */
    @Transactional
    public VerificacaoResponseDTO verificarResposta(Long exercicioId, int respostaSubmetida, Long usuarioId) {
        Exercicio exercicio = exercicioRepository.findById(exercicioId)
                .orElseThrow(() -> new RuntimeException("Exercício não encontrado com ID: " + exercicioId));

        boolean isCorreta = exercicio.getRespostaCorreta() == respostaSubmetida;
        String feedback = isCorreta ? exercicio.getFeedbackCorreto() : exercicio.getFeedbackIncorreto();

        // Define um feedback padrão caso não esteja configurado no exercício.
        if (feedback == null || feedback.trim().isEmpty()) {
            feedback = isCorreta ? "Correto!" : "Incorreto. Tente novamente!";
        }

        // Se um usuário estiver logado, salva o registro da sua resposta.
        if (usuarioId != null) {
            usuarioRepository.findById(usuarioId).ifPresent(usuario -> {
                RespostaUsuario respostaUsuario = new RespostaUsuario();
                respostaUsuario.setUsuario(usuario);
                respostaUsuario.setExercicio(exercicio);
                respostaUsuario.setResposta(respostaSubmetida);
                respostaUsuario.setCorreta(isCorreta);
                respostaUsuarioRepository.save(respostaUsuario);
            });
        }

        return new VerificacaoResponseDTO(isCorreta, feedback, exercicio.getRespostaCorreta());
    }

    /**
     * Busca um exercício pelo seu identificador único.
     *
     * @param id O ID do exercício.
     * @return Um {@link Optional} contendo o exercício, se encontrado.
     */
    public Optional<Exercicio> findById(Long id) {
        return exercicioRepository.findById(id);
    }
}