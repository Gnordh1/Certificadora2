package com.circuitlearn.dto;



public class VerificacaoResponseDTO {
    private boolean correta;
    private String feedback;
    private Integer respostaCorreta; // Índice da resposta correta

    // Construtor padrão (útil para Jackson)
    public VerificacaoResponseDTO() {
    }

    // Construtor com todos os campos
    public VerificacaoResponseDTO(boolean correta, String feedback, Integer respostaCorreta) {
        this.correta = correta;
        this.feedback = feedback;
        this.respostaCorreta = respostaCorreta;
    }

    // Getters públicos (NECESSÁRIOS para Jackson serializar)
    public boolean isCorreta() { // Note: "is" para boolean
        return correta;
    }

    public String getFeedback() {
        return feedback;
    }

    public Integer getRespostaCorreta() {
        return respostaCorreta;
    }

    // Setters (opcionais, mas geralmente incluídos com @Data)
    public void setCorreta(boolean correta) {
        this.correta = correta;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public void setRespostaCorreta(Integer respostaCorreta) {
        this.respostaCorreta = respostaCorreta;
    }
}