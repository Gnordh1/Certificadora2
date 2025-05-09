package com.circuitlearn.dto;




public class RespostaRequestDTO {
    private int resposta; // index of the chosen answer
    private Long usuarioId; // Optional, if you want to track answers per user

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
