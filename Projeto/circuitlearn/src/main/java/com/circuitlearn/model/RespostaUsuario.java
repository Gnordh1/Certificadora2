package com.circuitlearn.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Modela a resposta de um usuário a um exercício específico.
 * Esta entidade serve como uma tabela de junção com dados adicionais.
 */
@Entity
@Table(name = "resposta_usuario")
public class RespostaUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // A busca LAZY é uma boa prática para performance, pois evita carregar
    // a entidade Usuario do banco de dados até que seja explicitamente acessada.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // A busca LAZY também é aplicada aqui pela mesma razão de performance.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercicio_id", nullable = false)
    private Exercicio exercicio;

    /** Armazena o índice (base 0) da alternativa que o usuário escolheu. */
    @Column(name = "resposta")
    private int resposta;

    /** Flag para indicar se a resposta do usuário estava correta. Facilita relatórios. */
    @Column(name = "correta")
    private boolean correta;

    @Column(name = "data_resposta")
    private LocalDateTime dataResposta;

    public RespostaUsuario() {
    }

    public RespostaUsuario(Usuario usuario, Exercicio exercicio, int resposta, boolean correta) {
        this.usuario = usuario;
        this.exercicio = exercicio;
        this.resposta = resposta;
        this.correta = correta;
    }

    /**
     * Método de callback do JPA. É executado automaticamente antes da entidade
     * ser persistida pela primeira vez, definindo a data e hora da resposta.
     */
    @PrePersist
    protected void onCreate() {
        dataResposta = LocalDateTime.now();
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Exercicio getExercicio() {
        return exercicio;
    }

    public void setExercicio(Exercicio exercicio) {
        this.exercicio = exercicio;
    }

    public int getResposta() {
        return resposta;
    }

    public void setResposta(int resposta) {
        this.resposta = resposta;
    }

    public boolean isCorreta() {
        return correta;
    }

    public void setCorreta(boolean correta) {
        this.correta = correta;
    }

    public LocalDateTime getDataResposta() {
        return dataResposta;
    }

    public void setDataResposta(LocalDateTime dataResposta) {
        this.dataResposta = dataResposta;
    }

    /**
     * A igualdade entre entidades é definida pelo seu ID.
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RespostaUsuario that = (RespostaUsuario) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    /**
     * toString implementado para exibir IDs em vez dos objetos completos,
     * evitando LazyInitializationException em logs e depuração.
     */
    @Override
    public String toString() {
        return "RespostaUsuario{" +
                "id=" + id +
                ", usuarioId=" + (usuario != null ? usuario.getId() : "null") +
                ", exercicioId=" + (exercicio != null ? exercicio.getId() : "null") +
                ", resposta=" + resposta +
                ", correta=" + correta +
                ", dataResposta=" + dataResposta +
                '}';
    }
}