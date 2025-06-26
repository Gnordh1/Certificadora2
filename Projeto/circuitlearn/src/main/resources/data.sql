-- =================================================================
-- Script de População do Banco de Dados para CircuitLearn
-- =================================================================

-- Define o banco de dados a ser usado
USE circuit_learn_db;

-- Permite a execução de DELETE sem a cláusula WHERE
SET SQL_SAFE_UPDATES = 0;

-- Limpeza dos dados em ordem de dependência para evitar erros de chave estrangeira
DELETE FROM resposta_usuario;
DELETE FROM exercicio_alternativas;
DELETE FROM exercicio;
DELETE FROM usuario;


-- =================================================================
-- Seção: Usuários
-- =================================================================
INSERT INTO usuario (id, nome, email, senha) VALUES
(1, 'Aluno Teste', 'aluno@teste.com', 'senha123'),
(2, 'Aluno Teste 2', 'aluno2@teste.com', 'senha123');


-- =================================================================
-- Seção: Exercícios e Alternativas
-- =================================================================

-- Tópico: Lei de Ohm
-- -----------------------------------------------------------------
INSERT INTO exercicio (id, titulo, enunciado, resposta_correta, dificuldade, categoria, feedback_correto, feedback_incorreto) VALUES
(1, 'Lei de Ohm: Cálculo de Corrente', 'Um resistor de 220Ω está conectado a uma fonte de 5V. Qual é a corrente que flui pelo resistor?', 0, 'FACIL', 'lei-ohm', 'Correto! A corrente é calculada usando I = V/R = 5V/220Ω = 22.7mA.', 'Incorreto. Lembre-se que a fórmula base é I = V/R.'),
(4, 'Lei de Ohm: Cálculo de Tensão', 'Uma lâmpada tem resistência de 10Ω. Se uma corrente de 2A passa por ela, qual a tensão nos seus terminais?', 1, 'MEDIO', 'lei-ohm', 'Correto! V = I * R = 2A * 10Ω = 20V.', 'Incorreto. Use a fórmula V = I * R para encontrar a tensão.'),
(10, 'Lei de Ohm: Cálculo de Potência (I²R)', 'Um resistor de 100Ω dissipa 4W de potência. Qual a corrente que flui através dele?', 1, 'MEDIO', 'lei-ohm', 'Correto! P = I²R => I = √(P/R) = √(4/100) = 0.2A.', 'Incorreto. Use uma das fórmulas de potência, como P = I²R.'),
(16, 'Lei de Ohm: Cálculo de Potência (V²/R)', 'Uma fonte de 12V é conectada a um resistor de 144Ω. Qual é a potência dissipada pelo resistor?', 1, 'MEDIO', 'lei-ohm', 'Correto! A potência pode ser calculada com a fórmula P = V²/R. Portanto, P = (12V)² / 144Ω = 1W.', 'Incorreto. Utilize a fórmula de potência que relaciona tensão e resistência: P = V²/R.');

INSERT INTO exercicio_alternativas (exercicio_id, alternativas_order, alternativas) VALUES
(1, 0, 'a) 22.7mA'), (1, 1, 'b) 27.7mA'), (1, 2, 'c) 0.0227V'), (1, 3, 'd) 2.27A'),
(4, 0, 'a) 5V'), (4, 1, 'b) 20V'), (4, 2, 'c) 0.2V'), (4, 3, 'd) 12V'),
(10, 0, 'a) 0.4A'), (10, 1, 'b) 0.2A'), (10, 2, 'c) 2A'), (10, 3, 'd) 0.04A'),
(16, 0, 'a) 12W'), (16, 1, 'b) 1W'), (16, 2, 'c) 0.083W'), (16, 3, 'd) 144W');


-- Tópico: Leis de Kirchhoff
-- -----------------------------------------------------------------
INSERT INTO exercicio (id, titulo, enunciado, resposta_correta, dificuldade, categoria, feedback_correto, feedback_incorreto) VALUES
(2, 'Leis de Kirchhoff: Conceito da Lei das Correntes (LCK)', 'A soma algébrica das correntes em qualquer nó de um circuito é sempre zero. Esta afirmação representa qual lei?', 0, 'FACIL', 'leis-kirchhoff', 'Correto! Esta é a definição fundamental da Lei das Correntes de Kirchhoff (LCK).', 'Incorreto. Reveja as definições das Leis de Kirchhoff.'),
(8, 'Leis de Kirchhoff: Conceito da Lei das Tensões (LKT)', 'De acordo com a Lei das Tensões de Kirchhoff (LKT), a soma algébrica das tensões em qualquer malha fechada de um circuito é igual a:', 2, 'FACIL', 'leis-kirchhoff', 'Correto! A LKT afirma que a soma das elevações de tensão é igual à soma das quedas de tensão em uma malha, resultando em uma soma algébrica de zero.', 'Incorreto. Relembre o princípio fundamental da Lei das Tensões de Kirchhoff.'),
(11, 'Leis de Kirchhoff: Cálculo com LCK', 'Em um nó, duas correntes de 2A e 3A entram, e uma corrente de 1A sai. Qual corrente adicional deve sair do nó para satisfazer a LCK?', 2, 'FACIL', 'leis-kirchhoff', 'Exato! Correntes que entram (2A + 3A = 5A) devem ser iguais às que saem (1A + 4A = 5A).', 'Incorreto. Lembre-se que a soma das correntes que entram em um nó deve ser igual à soma das correntes que saem.'),
(19, 'Leis de Kirchhoff: Cálculo com LKT', 'Em uma malha, uma fonte de 9V alimenta dois resistores em série. Se a queda de tensão no primeiro resistor é de 5V, qual é a queda de tensão no segundo?', 2, 'FACIL', 'leis-kirchhoff', 'Exato! Pela LKT, a soma das quedas de tensão deve ser igual à tensão da fonte. Portanto, V2 = 9V - 5V = 4V.', 'Incorreto. A soma das tensões fornecidas é igual à soma das quedas de tensão em uma malha.');

INSERT INTO exercicio_alternativas (exercicio_id, alternativas_order, alternativas) VALUES
(2, 0, 'a) Lei das Correntes de Kirchhoff (LCK)'), (2, 1, 'b) Lei das Tensões de Kirchhoff (LKT)'), (2, 2, 'c) Lei de Ohm'), (2, 3, 'd) Teorema de Thévenin'),
(8, 0, 'a) A corrente total que entra no circuito'), (8, 1, 'b) A maior tensão da fonte no circuito'), (8, 2, 'c) Zero'), (8, 3, 'd) Infinito'),
(11, 0, 'a) 2A'), (11, 1, 'b) 3A'), (11, 2, 'c) 4A'), (11, 3, 'd) 5A'),
(19, 0, 'a) 14V'), (19, 1, 'b) 9V'), (19, 2, 'c) 4V'), (19, 3, 'd) 5V');


-- Tópico: Componentes Básicos
-- -----------------------------------------------------------------
INSERT INTO exercicio (id, titulo, enunciado, resposta_correta, dificuldade, categoria, feedback_correto, feedback_incorreto) VALUES
(3, 'Componentes: Unidade de Capacitância', 'Qual é a unidade de medida padrão da capacitância no Sistema Internacional (SI)?', 2, 'FACIL', 'componentes', 'Correto! A unidade de medida da capacitância é o Farad (F).', 'Incorreto. Pense na definição fundamental de um capacitor.'),
(6, 'Componentes: Função do Indutor', 'Qual é a principal propriedade de um indutor em um circuito elétrico?', 2, 'MEDIO', 'componentes', 'Correto! Indutores se opõem a variações na corrente elétrica, armazenando energia em um campo magnético.', 'Incorreto. Pense sobre como um indutor reage a mudanças na corrente.'),
(14, 'Componentes: Função do Diodo', 'Qual é a principal função de um diodo semicondutor ideal em um circuito?', 2, 'FACIL', 'componentes', 'Exato! Um diodo funciona como uma "válvula" para a corrente elétrica, permitindo sua passagem em um único sentido.', 'Incorreto. Pense na característica fundamental que distingue um diodo de um resistor.'),
(17, 'Componentes: Código de Cores de Resistores', 'Um resistor possui as faixas: Marrom, Preto, Vermelho e Dourado. Qual seu valor e tolerância?', 0, 'MEDIO', 'componentes', 'Correto! Marrom(1), Preto(0), Vermelho(x100) => 1000Ω ou 1kΩ. Dourado indica tolerância de ±5%.', 'Incorreto. Lembre-se da ordem: 1º dígito, 2º dígito, multiplicador e tolerância.'),
(20, 'Componentes: Função do Transistor', 'Qual é uma das funções primárias de um transistor de junção bipolar (TJB)?', 0, 'MEDIO', 'componentes', 'Correto! Transistores são a base de amplificadores e também operam como chaves eletrônicas controladas.', 'Incorreto. Pense no transistor como um componente ativo capaz de controlar um fluxo de corrente.'),
(21, 'Componentes: Capacitor em Regime DC', 'Após um longo tempo conectado a uma fonte de tensão contínua (DC), um capacitor ideal se comporta como:', 1, 'MEDIO', 'componentes', 'Correto! Totalmente carregado, não há mais fluxo de corrente, e ele age como um circuito aberto.', 'Incorreto. O que acontece com a corrente de um capacitor quando ele atinge sua carga máxima?'),
(29, 'Componentes: Definição de Potenciômetro', 'Um potenciômetro, comumente usado em controles de volume, é um tipo de:', 3, 'FACIL', 'componentes', 'Correto! Um potenciômetro é um resistor de três terminais que atua como um divisor de tensão ajustável.', 'Incorreto. Pense em como um controle de volume analógico funciona. Ele varia qual propriedade elétrica?');

INSERT INTO exercicio_alternativas (exercicio_id, alternativas_order, alternativas) VALUES
(3, 0, 'a) Ohm (Ω)'), (3, 1, 'b) Ampere (A)'), (3, 2, 'c) Farad (F)'), (3, 3, 'd) Volt (V)'),
(6, 0, 'a) Amplificar a tensão'), (6, 1, 'b) Opor-se a variações na tensão'), (6, 2, 'c) Opor-se a variações na corrente'), (6, 3, 'd) Gerar corrente contínua'),
(14, 0, 'a) Amplificar o sinal de corrente'), (14, 1, 'b) Armazenar carga elétrica'), (14, 2, 'c) Permitir a passagem de corrente em apenas um sentido'), (14, 3, 'd) Opor-se a variações de corrente'),
(17, 0, 'a) 1kΩ ±5%'), (17, 1, 'b) 100Ω ±10%'), (17, 2, 'c) 10kΩ ±5%'), (17, 3, 'd) 12Ω ±2%'),
(20, 0, 'a) Amplificar corrente ou atuar como chave'), (20, 1, 'b) Armazenar energia em um campo elétrico'), (20, 2, 'c) Gerar luz quando polarizado'), (20, 3, 'd) Retificar a corrente alternada'),
(21, 0, 'a) Um curto-circuito'), (21, 1, 'b) Um circuito aberto'), (21, 2, 'c) Uma fonte de tensão'), (21, 3, 'd) Um resistor de valor muito baixo'),
(29, 0, 'a) Capacitor variável'), (29, 1, 'b) Indutor variável'), (29, 2, 'c) Diodo de alta potência'), (29, 3, 'd) Resistor variável');


-- Tópico: Teoremas de Circuitos
-- -----------------------------------------------------------------
INSERT INTO exercicio (id, titulo, enunciado, resposta_correta, dificuldade, categoria, feedback_correto, feedback_incorreto) VALUES
(5, 'Teoremas: Conceito de Thévenin', 'O Teorema de Thévenin simplifica um circuito linear em uma única fonte de tensão em série com uma única resistência. Verdadeiro ou Falso?', 0, 'MEDIO', 'teoremas', 'Correto! Essa é a essência do Teorema de Thévenin.', 'Incorreto. Reveja a definição do Teorema de Thévenin.'),
(15, 'Teoremas: Conceito de Norton', 'O Teorema de Norton, dual do Teorema de Thévenin, simplifica um circuito linear em:', 1, 'MEDIO', 'teoremas', 'Correto! O Teorema de Norton reduz um circuito a uma fonte de corrente em paralelo com uma resistência.', 'Incorreto. O Teorema de Norton envolve uma fonte de corrente, não de tensão.'),
(24, 'Teoremas: Máxima Transferência de Potência', 'Para que uma carga (RL) receba a máxima potência de uma fonte com resistência interna (Rs), qual deve ser a relação entre elas?', 0, 'DIFICIL', 'teoremas', 'Exato! A máxima potência é transferida quando a resistência da carga é igual à resistência interna da fonte (RL = Rs).', 'Incorreto. Este teorema define a condição ideal para transferir energia de uma fonte para uma carga.');

INSERT INTO exercicio_alternativas (exercicio_id, alternativas_order, alternativas) VALUES
(5, 0, 'a) Verdadeiro'), (5, 1, 'b) Falso'),
(15, 0, 'a) Uma fonte de tensão em série com um capacitor'), (15, 1, 'b) Uma fonte de corrente em paralelo com uma resistência'), (15, 2, 'c) Uma fonte de tensão em paralelo com uma resistência'), (15, 3, 'd) Uma fonte de corrente em série com uma resistência'),
(24, 0, 'a) RL = Rs'), (24, 1, 'b) RL = 2 * Rs'), (24, 2, 'c) RL = 0'), (24, 3, 'd) RL deve ser o maior possível');


-- Tópico: Análise de Circuitos AC/DC
-- -----------------------------------------------------------------
INSERT INTO exercicio (id, titulo, enunciado, resposta_correta, dificuldade, categoria, feedback_correto, feedback_incorreto) VALUES
(7, 'Análise AC: Reatância Capacitiva vs. Frequência', 'Em um circuito AC, como a reatância capacitiva (Xc) varia com o aumento da frequência (f)?', 1, 'DIFICIL', 'analise-ac-dc', 'Correto! Xc = 1/(2πfC). Portanto, se a frequência (f) aumenta, a reatância (Xc) diminui.', 'Incorreto. Lembre-se da fórmula da reatância capacitiva: Xc = 1/(2πfC).'),
(13, 'Análise AC: Reatância Indutiva vs. Frequência', 'Em um circuito AC, como a reatância indutiva (XL) varia com o aumento da frequência (f)?', 2, 'DIFICIL', 'analise-ac-dc', 'Correto! A fórmula é XL = 2πfL. A reatância indutiva é diretamente proporcional à frequência.', 'Incorreto. Reveja a fórmula da reatância indutiva (XL = 2πfL).'),
(22, 'Análise AC: Cálculo de Valor RMS', 'Uma tensão senoidal possui um valor de pico de 14.14V. Qual é o seu valor eficaz (RMS)? (Use √2 ≈ 1.414)', 2, 'MEDIO', 'analise-ac-dc', 'Correto! V_RMS = V_pico / √2. Portanto, V_RMS = 14.14V / 1.414 ≈ 10V.', 'Incorreto. A fórmula para o valor RMS de uma senoide é V_RMS = V_pico / √2.'),
(28, 'Análise AC: Impedância em Ressonância', 'Em um circuito RLC série na frequência de ressonância, a impedância total (Z) do circuito é:', 2, 'DIFICIL', 'analise-ac-dc', 'Correto! Na ressonância, XL e Xc se cancelam. A impedância se torna mínima e igual apenas à resistência (Z = R).', 'Incorreto. Lembre-se que na ressonância, X_L = X_C. Como elas se opõem na fórmula da impedância?');

INSERT INTO exercicio_alternativas (exercicio_id, alternativas_order, alternativas) VALUES
(7, 0, 'a) Aumenta linearmente'), (7, 1, 'b) Diminui inversamente'), (7, 2, 'c) Permanece constante'), (7, 3, 'd) Aumenta quadraticamente'),
(13, 0, 'a) Diminui inversamente'), (13, 1, 'b) Permanece constante'), (13, 2, 'c) Aumenta linearmente'), (13, 3, 'd) Aumenta quadraticamente'),
(22, 0, 'a) 14.14V'), (22, 1, 'b) 20V'), (22, 2, 'c) 10V'), (22, 3, 'd) 7.07V'),
(28, 0, 'a) Máxima e infinita'), (28, 1, 'b) Zero'), (28, 2, 'c) Mínima e igual a R'), (28, 3, 'd) Média entre XL e Xc');


-- Tópico: Circuitos Série e Paralelo
-- -----------------------------------------------------------------
INSERT INTO exercicio (id, titulo, enunciado, resposta_correta, dificuldade, categoria, feedback_correto, feedback_incorreto) VALUES
(12, 'Circuitos: Resistência Equivalente em Paralelo', 'Qual é a resistência equivalente de dois resistores de 10Ω conectados em paralelo?', 2, 'MEDIO', 'circuitos-serie-paralelo', 'Correto! Req = (R1*R2)/(R1+R2) = (10*10)/(10+10) = 5Ω.', 'Incorreto. A fórmula para dois resistores em paralelo é Req = (R1*R2)/(R1+R2).'),
(18, 'Circuitos: Associação Mista de Resistores', 'Um resistor R1 de 10Ω está em série com o paralelo de dois resistores (R2 e R3) de 20Ω cada. Qual a resistência total?', 3, 'DIFICIL', 'circuitos-serie-paralelo', 'Correto! Paralelo de R2 e R3 = 10Ω. Em série com R1: 10Ω + 10Ω = 20Ω.', 'Incorreto. Resolva primeiro a associação em paralelo e depois some com o resistor em série.');

INSERT INTO exercicio_alternativas (exercicio_id, alternativas_order, alternativas) VALUES
(12, 0, 'a) 20Ω'), (12, 1, 'b) 10Ω'), (12, 2, 'c) 5Ω'), (12, 3, 'd) 0Ω'),
(18, 0, 'a) 50Ω'), (18, 1, 'b) 30Ω'), (18, 2, 'c) 10Ω'), (18, 3, 'd) 20Ω');


-- Tópico: Filtros
-- -----------------------------------------------------------------
INSERT INTO exercicio (id, titulo, enunciado, resposta_correta, dificuldade, categoria, feedback_correto, feedback_incorreto) VALUES
(9, 'Filtros: Configuração de um Passa-Baixa RC', 'Em um filtro passa-baixa RC, qual componente fica em série com a entrada e qual fica em paralelo com a saída?', 0, 'MEDIO', 'filtros', 'Correto! O resistor (R) fica em série e o capacitor (C) em paralelo com a saída.', 'Incorreto. Considere como as impedâncias de R e C variam com a frequência para atenuar sinais altos.'),
(23, 'Filtros: Definição de Frequência de Corte', 'A frequência de corte de um filtro (-3dB) é a frequência na qual a potência do sinal de saída cai para:', 3, 'DIFICIL', 'filtros', 'Correto! O ponto de -3dB é definido como o ponto em que a potência do sinal cai para a metade do seu valor na banda passante.', 'Incorreto. A frequência de corte é também chamada de frequência de meia potência.'),
(27, 'Filtros: Configuração de um Passa-Alta RC', 'Na configuração de um filtro passa-alta RC, qual componente fica em série e qual em paralelo?', 1, 'MEDIO', 'filtros', 'Correto! No passa-alta, o capacitor fica em série para bloquear baixas frequências e o resistor em paralelo.', 'Incorreto. É a configuração oposta ao filtro passa-baixa.');

INSERT INTO exercicio_alternativas (exercicio_id, alternativas_order, alternativas) VALUES
(9, 0, 'a) Resistor em série, Capacitor em paralelo'), (9, 1, 'b) Capacitor em série, Resistor em paralelo'), (9, 2, 'c) Ambos em série'), (9, 3, 'd) Ambos em paralelo'),
(23, 0, 'a) Zero'), (23, 1, 'b) 70.7% do seu valor máximo'), (23, 2, 'c) Um terço do seu valor máximo'), (23, 3, 'd) Metade do seu valor na banda passante'),
(27, 0, 'a) Resistor em série, Capacitor em paralelo'), (27, 1, 'b) Capacitor em série, Resistor em paralelo'), (27, 2, 'c) Ambos em série'), (27, 3, 'd) Ambos em paralelo');


-- Tópico: Lógica Digital
-- -----------------------------------------------------------------
INSERT INTO exercicio (id, titulo, enunciado, resposta_correta, dificuldade, categoria, feedback_correto, feedback_incorreto) VALUES
(25, 'Lógica Digital: Operação da Porta AND', 'Qual a saída de uma porta AND de duas entradas, se as entradas forem 1 (ALTO) e 0 (BAIXO)?', 1, 'FACIL', 'logica-digital', 'Correto! A porta AND só produz saída 1 se TODAS as suas entradas forem 1.', 'Incorreto. Pense na porta AND como uma multiplicação lógica: 1 * 0 = ?'),
(26, 'Lógica Digital: Operação da Porta OR', 'Qual a saída de uma porta OR de duas entradas, se as entradas forem 1 (ALTO) e 0 (BAIXO)?', 0, 'FACIL', 'logica-digital', 'Correto! A porta OR produz saída 1 se PELO MENOS UMA de suas entradas for 1.', 'Incorreto. Pense na porta OR como uma soma lógica: 1 + 0 = ?'),
(30, 'Lógica Digital: Operação da Porta NOT', 'Uma porta lógica NOT (Inversor) tem uma entrada com nível lógico 1. Qual será sua saída?', 1, 'FACIL', 'logica-digital', 'Correto! A porta NOT sempre produz na saída o oposto lógico da sua entrada.', 'Incorreto. O próprio nome "Inversor" descreve o funcionamento desta porta.');

INSERT INTO exercicio_alternativas (exercicio_id, alternativas_order, alternativas) VALUES
(25, 0, 'a) 1 (ALTO)'), (25, 1, 'b) 0 (BAIXO)'), (25, 2, 'c) Indefinido'), (25, 3, 'd) Oscilando'),
(26, 0, 'a) 1 (ALTO)'), (26, 1, 'b) 0 (BAIXO)'), (26, 2, 'c) Indefinido'), (26, 3, 'd) Oscilando'),
(30, 0, 'a) 1'), (30, 1, 'b) 0'), (30, 2, 'c) A mesma da entrada'), (30, 3, 'd) Alta impedância');