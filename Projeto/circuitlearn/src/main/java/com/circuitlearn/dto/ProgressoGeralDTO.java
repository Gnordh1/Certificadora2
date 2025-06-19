package com.circuitlearn.dto;

import java.util.List;

/**
 * DTO que agrega o resumo geral do progresso e o detalhamento por tópico.
 */
public class ProgressoGeralDTO {
    private ResumoProgressoDTO resumo;
    private List<ProgressoTopicoDTO> progressoPorTopico;

    public ResumoProgressoDTO getResumo() {
        return resumo;
    }
    public void setResumo(ResumoProgressoDTO resumo) {
        this.resumo = resumo;
    }
    public List<ProgressoTopicoDTO> getProgressoPorTopico() {
        return progressoPorTopico;
    }
    public void setProgressoPorTopico(List<ProgressoTopicoDTO> progressoPorTopico) {
        this.progressoPorTopico = progressoPorTopico;
    }
}