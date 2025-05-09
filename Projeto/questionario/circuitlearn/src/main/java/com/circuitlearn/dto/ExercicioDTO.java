package com.circuitlearn.dto;



import java.util.List;

import java.util.List;
import java.util.Objects; // Para equals e hashCode, se necessário em DTOs


public class ExercicioDTO {
    private Long id;
    private String titulo;
    private String enunciado;
    private List<String> alternativas;
    private String dificuldade; // Será a string "facil", "medio", "dificil"
    private String categoria;

    // Construtor padrão (necessário para Jackson deserializar, se aplicável, e boas práticas)
    public ExercicioDTO() {
    }

    // Construtor com todos os campos (útil para o método convertToDTO)
    public ExercicioDTO(Long id, String titulo, String enunciado, List<String> alternativas, String dificuldade, String categoria) {
        this.id = id;
        this.titulo = titulo;
        this.enunciado = enunciado;
        this.alternativas = alternativas;
        this.dificuldade = dificuldade;
        this.categoria = categoria;
    }

    // Getters públicos (ABSOLUTAMENTE NECESSÁRIOS para serialização Jackson se não usar Lombok)
    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getEnunciado() {
        return enunciado;
    }

    public List<String> getAlternativas() {
        return alternativas;
    }

    public String getDificuldade() {
        return dificuldade;
    }

    public String getCategoria() {
        return categoria;
    }

    // Setters (geralmente não são estritamente necessários para DTOs de "leitura"
    // mas podem ser úteis e são gerados pelo @Data do Lombok)
    public void setId(Long id) {
        this.id = id;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setEnunciado(String enunciado) {
        this.enunciado = enunciado;
    }

    public void setAlternativas(List<String> alternativas) {
        this.alternativas = alternativas;
    }

    public void setDificuldade(String dificuldade) {
        this.dificuldade = dificuldade;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    // Opcional: equals, hashCode, toString para DTOs
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ExercicioDTO that = (ExercicioDTO) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(titulo, that.titulo) &&
                Objects.equals(enunciado, that.enunciado) &&
                Objects.equals(alternativas, that.alternativas) &&
                Objects.equals(dificuldade, that.dificuldade) &&
                Objects.equals(categoria, that.categoria);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, titulo, enunciado, alternativas, dificuldade, categoria);
    }

    @Override
    public String toString() {
        return "ExercicioDTO{" +
                "id=" + id +
                ", titulo='" + titulo + '\'' +
                ", enunciado='" + (enunciado != null ? enunciado.substring(0, Math.min(enunciado.length(), 20)) + "..." : "null") + '\'' +
                ", alternativas=" + (alternativas != null ? "size=" + alternativas.size() : "null") +
                ", dificuldade='" + dificuldade + '\'' +
                ", categoria='" + categoria + '\'' +
                '}';
    }
}