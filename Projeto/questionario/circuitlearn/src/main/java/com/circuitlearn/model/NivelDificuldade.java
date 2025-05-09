package com.circuitlearn.model;


public enum NivelDificuldade {
    FACIL,
    MEDIO,
    DIFICIL;

    public String getNomeAmigavel() {
        return this.name().toLowerCase();
    }

    // Se você precisar de um método para converter o valor int (1,2,3) de volta para o Enum
    // (não usado diretamente pelo JPA com EnumType.STRING, mas pode ser útil em outros lugares)
    public static NivelDificuldade fromValor(int valor) {
        switch (valor) {
            case 1: return FACIL;
            case 2: return MEDIO;
            case 3: return DIFICIL;
            default: throw new IllegalArgumentException("Valor de dificuldade inválido: " + valor);
        }
    }

    public int getValor() {
        if (this == FACIL) return 1;
        if (this == MEDIO) return 2;
        if (this == DIFICIL) return 3;
        return 0; // Ou lançar exceção
    }
}
