package com.circuitlearn.dto;

/**
 * DTO que representa a requisição do cliente para verificar uma resposta de exercício.
 */
public class RespostaRequestDTO {
    /** Índice (base 0) da alternativa escolhida pelo usuário. */
    private int resposta;
    /** ID do usuário que está respondendo o exercício. */
    private Long usuarioId;

    public int getResposta() {
        return resposta;
    }
    public void setResposta(int resposta) {
        this.resposta = resposta;
    }
    public Long getUsuarioId() {
        return usuarioId;
    }
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}