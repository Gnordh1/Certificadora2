package com.circuitlearn.model;

/**
 * Define os níveis de dificuldade para os exercícios.
 */
public enum NivelDificuldade {
    FACIL,
    MEDIO,
    DIFICIL;

    /**
     * Retorna o nome do enum em minúsculas, ideal para exibição na interface.
     * @return O nome amigável (e.g., "facil").
     */
    public String getNomeAmigavel() {
        return this.name().toLowerCase();
    }

    /**
     * Converte um valor numérico para o enum correspondente.
     * Útil para interoperabilidade com sistemas que usam números para dificuldade.
     * @param valor O valor inteiro (1=FACIL, 2=MEDIO, 3=DIFICIL).
     * @return O enum NivelDificuldade.
     * @throws IllegalArgumentException se o valor for inválido.
     */
    public static NivelDificuldade fromValor(int valor) {
        switch (valor) {
            case 1: return FACIL;
            case 2: return MEDIO;
            case 3: return DIFICIL;
            default: throw new IllegalArgumentException("Valor de dificuldade inválido: " + valor);
        }
    }

    /**
     * Retorna a representação numérica do nível de dificuldade.
     * @return O valor inteiro correspondente.
     */
    public int getValor() {
        if (this == FACIL) return 1;
        if (this == MEDIO) return 2;
        if (this == DIFICIL) return 3;
        return 0; // Ou lançar uma exceção, dependendo da regra de negócio.
    }
}