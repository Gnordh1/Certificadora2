package com.circuitlearn.dto;

/**
 * DTO que representa a resposta do servidor após a verificação de um exercício.
 */
public class VerificacaoResponseDTO {
    private boolean correta;
    private String feedback;
    /** Índice (base 0) da alternativa correta, para ser exibido ao usuário. */
    private Integer respostaCorreta;

    public VerificacaoResponseDTO() {
    }

    public VerificacaoResponseDTO(boolean correta, String feedback, Integer respostaCorreta) {
        this.correta = correta;
        this.feedback = feedback;
        this.respostaCorreta = respostaCorreta;
    }

    public boolean isCorreta() {
        return correta;
    }
    public void setCorreta(boolean correta) {
        this.correta = correta;
    }
    public String getFeedback() {
        return feedback;
    }
    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
    public Integer getRespostaCorreta() {
        return respostaCorreta;
    }
    public void setRespostaCorreta(Integer respostaCorreta) {
        this.respostaCorreta = respostaCorreta;
    }
}