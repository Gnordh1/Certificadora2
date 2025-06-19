package com.circuitlearn.model;

import com.circuitlearn.model.NivelDificuldade;
import jakarta.persistence.*;
import java.util.List;
import java.util.Objects;

/**
 * Representa um exercício na plataforma, com seu enunciado, alternativas, resposta e metadados.
 */
@Entity
@Table(name = "exercicio")
// Otimiza a consulta para carregar as alternativas juntamente com o exercício,
// evitando o problema de performance conhecido como "N+1 selects".
@NamedEntityGraph(
        name = "Exercicio.withAlternativas",
        attributeNodes = @NamedAttributeNode("alternativas")
)
public class Exercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titulo")
    private String titulo;

    /** Enunciado do exercício, pode conter textos longos. */
    @Column(name = "enunciado", columnDefinition = "TEXT")
    private String enunciado;

    /**
     * Lista de alternativas do exercício.
     * Mapeado como uma coleção de elementos em uma tabela separada (exercicio_alternativas)
     * para manter a ordem das alternativas.
     */
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "exercicio_alternativas", joinColumns = @JoinColumn(name = "exercicio_id"))
    @OrderColumn(name = "alternativas_order")
    @Column(name = "alternativas")
    private List<String> alternativas;

    /** Índice (base 0) da alternativa correta na lista 'alternativas'. */
    @Column(name = "resposta_correta")
    private int respostaCorreta;

    /**
     * Nível de dificuldade do exercício.
     * Armazenado como String (e.g., "FACIL") no banco de dados para maior clareza.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "dificuldade")
    private NivelDificuldade dificuldade;

    @Column(name = "categoria")
    private String categoria;

    /** Feedback exibido ao usuário quando a resposta está correta. */
    @Column(name = "feedback_correto", columnDefinition = "TEXT")
    private String feedbackCorreto;

    /** Feedback exibido ao usuário quando a resposta está incorreta. */
    @Column(name = "feedback_incorreto", columnDefinition = "TEXT")
    private String feedbackIncorreto;

    public Exercicio() {
    }

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

    /**
     * A igualdade entre entidades é definida pelo seu ID.
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Exercicio exercicio = (Exercicio) o;
        return Objects.equals(id, exercicio.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    /**
     * Representação em String simplificada para evitar logs extensos.
     */
    @Override
    public String toString() {
        return "Exercicio{" +
                "id=" + id +
                ", titulo='" + titulo + '\'' +
                ", dificuldade=" + dificuldade +
                ", categoria='" + categoria + '\'' +
                '}';
    }
}