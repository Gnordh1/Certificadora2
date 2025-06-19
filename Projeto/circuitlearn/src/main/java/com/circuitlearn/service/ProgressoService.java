package com.circuitlearn.service;

import com.circuitlearn.dto.ProgressoGeralDTO;
import com.circuitlearn.dto.ProgressoTopicoDTO;
import com.circuitlearn.dto.ResumoProgressoDTO;
import com.circuitlearn.model.Exercicio;
import com.circuitlearn.model.RespostaUsuario;
import com.circuitlearn.model.Usuario;
import com.circuitlearn.repository.ExercicioRepository;
import com.circuitlearn.repository.RespostaUsuarioRepository;
import com.circuitlearn.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service responsável por calcular e agregar o progresso de um usuário na plataforma.
 */
@Service
public class ProgressoService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ExercicioRepository exercicioRepository;

    @Autowired
    private RespostaUsuarioRepository respostaUsuarioRepository;

    /**
     * Formata um identificador de categoria (slug) para um nome de exibição legível.
     * Substitui hífens por espaços, capitaliza a primeira letra de cada palavra e trata casos especiais.
     *
     * @param slug O identificador da categoria, como "lei-de-ohm".
     * @return O nome formatado para exibição, como "Lei De Ohm".
     */
    private String formatarNomeCategoria(String slug) {
        if (slug == null || slug.isEmpty()) {
            return "Tópico Desconhecido";
        }
        // Trata o caso especial "analise-ac-dc" antes da formatação geral.
        String tempSlug = slug.toLowerCase().replace("analise-ac-dc", "Análise AC/DC");
        if(tempSlug.contains("AC/DC")) {
            return tempSlug;
        }

        String[] palavras = tempSlug.replace('-', ' ').split(" ");
        StringBuilder nomeFormatado = new StringBuilder();

        for (String palavra : palavras) {
            if (!palavra.isEmpty()) {
                nomeFormatado.append(Character.toUpperCase(palavra.charAt(0)))
                        .append(palavra.substring(1))
                        .append(" ");
            }
        }
        return nomeFormatado.toString().trim();
    }


    /**
     * Calcula o progresso geral de um usuário.
     * O método agrega todas as respostas do usuário e todos os exercícios disponíveis para gerar um
     * relatório detalhado, que inclui um resumo geral e o desempenho em cada tópico.
     *
     * @param usuarioId O ID do usuário para o qual o progresso será calculado.
     * @return Um objeto {@link ProgressoGeralDTO} com os dados de progresso consolidados.
     * @throws RuntimeException se o usuário com o ID fornecido não for encontrado.
     */
    public ProgressoGeralDTO calcularProgresso(Long usuarioId) {
        // Busca os dados primários dos repositórios.
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + usuarioId));

        List<Exercicio> todosExercicios = exercicioRepository.findAll();
        List<RespostaUsuario> todasRespostasDoUsuario = respostaUsuarioRepository.findByUsuario(usuario);

        // Organiza os exercícios por categoria para processamento.
        Map<String, List<Exercicio>> exerciciosPorCategoria = todosExercicios.stream()
                .collect(Collectors.groupingBy(Exercicio::getCategoria));

        // Cria um conjunto de IDs de exercícios respondidos corretamente para consulta eficiente.
        Set<Long> idsExerciciosCorretos = todasRespostasDoUsuario.stream()
                .filter(RespostaUsuario::isCorreta)
                .map(resposta -> resposta.getExercicio().getId())
                .collect(Collectors.toSet());

        // Calcula o progresso para cada tópico individualmente.
        List<ProgressoTopicoDTO> progressoPorTopicoList = new ArrayList<>();
        for (Map.Entry<String, List<Exercicio>> entry : exerciciosPorCategoria.entrySet()) {
            String categoriaSlug = entry.getKey();
            List<Exercicio> exerciciosDoTopico = entry.getValue();
            int totalNoTopico = exerciciosDoTopico.size();

            int concluidosCorretamenteNoTopico = (int) exerciciosDoTopico.stream()
                    .filter(ex -> idsExerciciosCorretos.contains(ex.getId()))
                    .count();

            int percentualConclusao = (totalNoTopico > 0)
                    ? (int) Math.round(((double) concluidosCorretamenteNoTopico / totalNoTopico) * 100)
                    : 0;

            String nomeFormatado = formatarNomeCategoria(categoriaSlug);
            String link = "teoria.html#" + categoriaSlug;

            progressoPorTopicoList.add(new ProgressoTopicoDTO(nomeFormatado, concluidosCorretamenteNoTopico, totalNoTopico, percentualConclusao, link));
        }

        // Calcula os dados do resumo geral.
        ResumoProgressoDTO resumo = new ResumoProgressoDTO();
        resumo.setTotalExercicios(todosExercicios.size());
        resumo.setTotalTopicos(exerciciosPorCategoria.size());
        resumo.setExerciciosConcluidos(idsExerciciosCorretos.size());

        int totalTentativas = todasRespostasDoUsuario.size();
        long totalAcertosGlobal = idsExerciciosCorretos.size();
        int taxaAcertoGlobal = (totalTentativas > 0)
                ? (int) Math.round(((double) totalAcertosGlobal / totalTentativas) * 100)
                : 0;
        resumo.setTaxaAcertoGlobal(taxaAcertoGlobal);

        int topicosIniciados = (int) progressoPorTopicoList.stream().filter(p -> p.getConcluidos() > 0).count();
        resumo.setTopicosIniciados(topicosIniciados);

        // Monta e retorna o DTO final.
        ProgressoGeralDTO progressoGeral = new ProgressoGeralDTO();
        progressoGeral.setResumo(resumo);
        progressoGeral.setProgressoPorTopico(progressoPorTopicoList);

        return progressoGeral;
    }
}