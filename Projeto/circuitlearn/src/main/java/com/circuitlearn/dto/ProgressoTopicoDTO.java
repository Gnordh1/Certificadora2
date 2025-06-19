package com.circuitlearn.dto;

/**
 * DTO que encapsula os dados de progresso de um usuário para um tópico específico.
 */
public class ProgressoTopicoDTO {
    private String nome;
    private int concluidos;
    private int total;
    /** Percentual de acerto (0-100) nos exercícios concluídos deste tópico. */
    private int acertos;
    private String link;

    public ProgressoTopicoDTO() {}

    public ProgressoTopicoDTO(String nome, int concluidos, int total, int acertos, String link) {
        this.nome = nome;
        this.concluidos = concluidos;
        this.total = total;
        this.acertos = acertos;
        this.link = link;
    }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public int getConcluidos() { return concluidos; }
    public void setConcluidos(int concluidos) { this.concluidos = concluidos; }
    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
    public int getAcertos() { return acertos; }
    public void setAcertos(int acertos) { this.acertos = acertos; }
    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
}