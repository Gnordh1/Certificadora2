package com.circuitlearn.dto;

/**
 * DTO que contém um resumo geral do progresso do usuário em toda a plataforma.
 */
public class ResumoProgressoDTO {
    private int exerciciosConcluidos;
    private int totalExercicios;
    /** Percentual de acerto global (0-100) em todos os exercícios respondidos. */
    private int taxaAcertoGlobal;
    private int topicosIniciados;
    private int totalTopicos;

    public int getExerciciosConcluidos() { return exerciciosConcluidos; }
    public void setExerciciosConcluidos(int exerciciosConcluidos) { this.exerciciosConcluidos = exerciciosConcluidos; }
    public int getTotalExercicios() { return totalExercicios; }
    public void setTotalExercicios(int totalExercicios) { this.totalExercicios = totalExercicios; }
    public int getTaxaAcertoGlobal() { return taxaAcertoGlobal; }
    public void setTaxaAcertoGlobal(int taxaAcertoGlobal) { this.taxaAcertoGlobal = taxaAcertoGlobal; }
    public int getTopicosIniciados() { return topicosIniciados; }
    public void setTopicosIniciados(int topicosIniciados) { this.topicosIniciados = topicosIniciados; }
    public int getTotalTopicos() { return totalTopicos; }
    public void setTotalTopicos(int totalTopicos) { this.totalTopicos = totalTopicos; }
}