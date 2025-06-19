package com.circuitlearn.dto;

import java.util.List;
import java.util.Objects;

/**
 * DTO para transferir dados de um exercício para o cliente.
 * Oculta informações internas, como o índice da resposta correta.
 */
public class ExercicioDTO {
    private Long id;
    private String titulo;
    private String enunciado;
    private List<String> alternativas;
    /** Representação textual da dificuldade (ex: "facil"). */
    private String dificuldade;
    private String categoria;

    public ExercicioDTO() {
    }

    public ExercicioDTO(Long id, String titulo, String enunciado, List<String> alternativas, String dificuldade, String categoria) {
        this.id = id;
        this.titulo = titulo;
        this.enunciado = enunciado;
        this.alternativas = alternativas;
        this.dificuldade = dificuldade;
        this.categoria = categoria;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getEnunciado() { return enunciado; }
    public void setEnunciado(String enunciado) { this.enunciado = enunciado; }
    public List<String> getAlternativas() { return alternativas; }
    public void setAlternativas(List<String> alternativas) { this.alternativas = alternativas; }
    public String getDificuldade() { return dificuldade; }
    public void setDificuldade(String dificuldade) { this.dificuldade = dificuldade; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ExercicioDTO that = (ExercicioDTO) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "ExercicioDTO{" + "id=" + id + ", titulo='" + titulo + '\'' + '}';
    }
}