package com.circuitlearn.model;


import jakarta.persistence.*;

import java.time.LocalDateTime;



import java.util.Objects;

@Entity
@Table(name = "resposta_usuario") // Explicitando o nome da tabela
public class RespostaUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // LAZY é bom para performance
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercicio_id", nullable = false)
    private Exercicio exercicio;

    @Column(name = "resposta")
    private int resposta; // Índice da alternativa escolhida (0-based)

    @Column(name = "correta")
    private boolean correta;

    @Column(name = "data_resposta")
    private LocalDateTime dataResposta;

    // Construtor padrão
    public RespostaUsuario() {
    }

    // Construtor com campos
    public RespostaUsuario(Usuario usuario, Exercicio exercicio, int resposta, boolean correta) {
        this.usuario = usuario;
        this.exercicio = exercicio;
        this.resposta = resposta;
        this.correta = correta;
    }


    @PrePersist // Define dataResposta antes de persistir
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
