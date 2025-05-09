package com.circuitlearn.model;

import com.circuitlearn.model.NivelDificuldade;
import jakarta.persistence.*;


import java.util.List;

import jakarta.persistence.*;
import java.util.List;
import java.util.Objects; // Para equals e hashCode

@Entity
@Table(name = "exercicio")
@NamedEntityGraph( // Para otimizar o carregamento das alternativas (N+1)
        name = "Exercicio.withAlternativas",
        attributeNodes = @NamedAttributeNode("alternativas")
)
public class Exercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titulo") // Mapeia para a coluna 'titulo'
    private String titulo;

    @Column(name = "enunciado", columnDefinition = "TEXT") // Mapeia para a coluna 'enunciado'
    private String enunciado;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "exercicio_alternativas",
            joinColumns = @JoinColumn(name = "exercicio_id"))
    @OrderColumn(name = "alternativas_order")
    @Column(name = "alternativas")
    private List<String> alternativas;

    @Column(name = "resposta_correta")
    private int respostaCorreta;

    @Enumerated(EnumType.STRING)
    @Column(name = "dificuldade")
    private NivelDificuldade dificuldade;

    @Column(name = "categoria")
    private String categoria;

    @Column(name = "feedback_correto", columnDefinition = "TEXT")
    private String feedbackCorreto;

    @Column(name = "feedback_incorreto", columnDefinition = "TEXT")
    private String feedbackIncorreto;

    // Construtor padrão (necessário para JPA)
    public Exercicio() {
    }

    // Construtor com todos os campos (opcional, mas útil)
    public Exercicio(String titulo, String enunciado, List<String> alternativas, int respostaCorreta, NivelDificuldade dificuldade, String categoria, String feedbackCorreto, String feedbackIncorreto) {
        this.titulo = titulo;
        this.enunciado = enunciado;
        this.alternativas = alternativas;
        this.respostaCorreta = respostaCorreta;
        this.dificuldade = dificuldade;
        this.categoria = categoria;
        this.feedbackCorreto = feedbackCorreto;
        this.feedbackIncorreto = feedbackIncorreto;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getEnunciado() {
        return enunciado;
    }

    public void setEnunciado(String enunciado) {
        this.enunciado = enunciado;
    }

    public List<String> getAlternativas() {
        return alternativas;
    }

    public void setAlternativas(List<String> alternativas) {
        this.alternativas = alternativas;
    }

    public int getRespostaCorreta() {
        return respostaCorreta;
    }

    public void setRespostaCorreta(int respostaCorreta) {
        this.respostaCorreta = respostaCorreta;
    }

    public NivelDificuldade getDificuldade() {
        return dificuldade;
    }

    public void setDificuldade(NivelDificuldade dificuldade) {
        this.dificuldade = dificuldade;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getFeedbackCorreto() {
        return feedbackCorreto;
    }

    public void setFeedbackCorreto(String feedbackCorreto) {
        this.feedbackCorreto = feedbackCorreto;
    }

    public String getFeedbackIncorreto() {
        return feedbackIncorreto;
    }

    public void setFeedbackIncorreto(String feedbackIncorreto) {
        this.feedbackIncorreto = feedbackIncorreto;
    }

    // equals, hashCode e toString (baseados no ID para simplicidade se for uma entidade gerenciada)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Exercicio exercicio = (Exercicio) o;
        return Objects.equals(id, exercicio.id); // Entidades são iguais se seus IDs são iguais e não nulos
    }

    @Override
    public int hashCode() {
        return Objects.hash(id); // Basear o hashCode no ID
    }

    @Override
    public String toString() {
        return "Exercicio{" +
                "id=" + id +
                ", titulo='" + titulo + '\'' +
                ", dificuldade=" + dificuldade +
                ", categoria='" + categoria + '\'' +
                '}'; // toString simplificado para evitar logs muito longos
    }
}