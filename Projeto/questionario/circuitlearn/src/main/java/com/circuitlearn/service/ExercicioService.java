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

@Service
public class ExercicioService {

    @Autowired
    private ExercicioRepository exercicioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RespostaUsuarioRepository respostaUsuarioRepository;

    public Page<ExercicioDTO> getExercicios(String topico, String nivel, Long usuarioId, Pageable pageable) {
        Page<Exercicio> exerciciosPage;
        NivelDificuldade nivelEnum = null;

        if (nivel != null && !nivel.equalsIgnoreCase("todos") && !nivel.isEmpty()) {
            try {
                nivelEnum = NivelDificuldade.valueOf(nivel.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Nível inválido, trata como "todos" (não faz nada aqui, pois nivelEnum continuará null)
            }
        }

        boolean hasTopico = topico != null && !topico.equalsIgnoreCase("todos") && !topico.isEmpty();
        boolean hasNivel = nivelEnum != null;
        boolean filterByUser = usuarioId != null;

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

    private ExercicioDTO convertToDTO(Exercicio exercicio) {
        if (exercicio == null) {
            // Retornar um DTO vazio ou lançar uma exceção, dependendo da política de erro.
            // Aqui, retornamos um DTO com campos nulos/vazios para evitar NullPointerExceptions no chamador,
            // assumindo que o chamador pode lidar com isso ou que a situação é rara.
            return new ExercicioDTO(null, null, null, Collections.emptyList(), null, null);
        }

        String dificuldadeStr = null;
        if (exercicio.getDificuldade() != null) {
            dificuldadeStr = exercicio.getDificuldade().getNomeAmigavel();
        }

        List<String> alternativas = exercicio.getAlternativas();
        if (alternativas == null) {
            alternativas = Collections.emptyList();
        }

        return new ExercicioDTO(
                exercicio.getId(), exercicio.getTitulo(), exercicio.getEnunciado(),
                alternativas, dificuldadeStr, exercicio.getCategoria()
        );
    }

    @Transactional
    public VerificacaoResponseDTO verificarResposta(Long exercicioId, int respostaSubmetida, Long usuarioId) {
        Optional<Exercicio> exercicioOpt = exercicioRepository.findById(exercicioId);
        if (exercicioOpt.isEmpty()) {
            throw new RuntimeException("Exercício não encontrado com ID: " + exercicioId);
        }

        Exercicio exercicio = exercicioOpt.get();
        boolean isCorreta = exercicio.getRespostaCorreta() == respostaSubmetida;
        String feedback = isCorreta ? exercicio.getFeedbackCorreto() : exercicio.getFeedbackIncorreto();

        if (feedback == null || feedback.trim().isEmpty()) {
            feedback = isCorreta ? "Correto!" : "Incorreto. Tente novamente!";
        }

        if (usuarioId != null) {
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);
            if (usuarioOpt.isPresent()) {
                RespostaUsuario respostaUsuario = new RespostaUsuario();
                respostaUsuario.setUsuario(usuarioOpt.get());
                respostaUsuario.setExercicio(exercicio);
                respostaUsuario.setResposta(respostaSubmetida);
                respostaUsuario.setCorreta(isCorreta);
                respostaUsuarioRepository.save(respostaUsuario);
            }
        }

        return new VerificacaoResponseDTO(isCorreta, feedback, exercicio.getRespostaCorreta());
    }

    public Optional<Exercicio> findById(Long id) {
        return exercicioRepository.findById(id);
    }
}