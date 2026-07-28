/* Mundo Buinho — dados dos motores Reta numérica, Crivo e Fusão para alvo
   GERADO por testes/gerar-motores.js — NÃO editar à mão. Correr o gerador.
   205 verificações, 0 falhas. Posições, múltiplos, primos e somas recomputados.
   SEM cronómetro e SEM despromoção: motores tácteis, o tempo não é a mecânica
   (gate pedagógico do handoff das mecânicas + maker-neurodiversidade v3). */
window.MB_MOTORES_JOGOS = [
  {
    "id": "r1",
    "nome": "Coloca a Fração",
    "icone": "🍕",
    "motor": "reta",
    "cat": "fracoes",
    "sub": "arrasta para o sítio certo",
    "niveis": [
      [
        {
          "pergunta": "Onde fica 1/2?",
          "etiqueta": "1/2",
          "min": 0,
          "max": 1,
          "passo": 0.5,
          "valor": 0.5,
          "tolerancia": 0.041666666666666664,
          "dica": "1/2 quer dizer: parte a reta em 2 pedaços iguais e conta 1."
        },
        {
          "pergunta": "Onde fica 1/4?",
          "etiqueta": "1/4",
          "min": 0,
          "max": 1,
          "passo": 0.25,
          "valor": 0.25,
          "tolerancia": 0.041666666666666664,
          "dica": "1/4 quer dizer: parte a reta em 4 pedaços iguais e conta 1."
        },
        {
          "pergunta": "Onde fica 3/4?",
          "etiqueta": "3/4",
          "min": 0,
          "max": 1,
          "passo": 0.25,
          "valor": 0.75,
          "tolerancia": 0.041666666666666664,
          "dica": "3/4 quer dizer: parte a reta em 4 pedaços iguais e conta 3."
        }
      ],
      [
        {
          "pergunta": "Onde fica 1/3?",
          "etiqueta": "1/3",
          "min": 0,
          "max": 1,
          "passo": 0.3333333333333333,
          "valor": 0.3333333333333333,
          "tolerancia": 0.041666666666666664,
          "dica": "1/3 quer dizer: parte a reta em 3 pedaços iguais e conta 1."
        },
        {
          "pergunta": "Onde fica 2/3?",
          "etiqueta": "2/3",
          "min": 0,
          "max": 1,
          "passo": 0.3333333333333333,
          "valor": 0.6666666666666666,
          "tolerancia": 0.041666666666666664,
          "dica": "2/3 quer dizer: parte a reta em 3 pedaços iguais e conta 2."
        },
        {
          "pergunta": "Onde fica 3/8?",
          "etiqueta": "3/8",
          "min": 0,
          "max": 1,
          "passo": 0.125,
          "valor": 0.375,
          "tolerancia": 0.041666666666666664,
          "dica": "3/8 quer dizer: parte a reta em 8 pedaços iguais e conta 3."
        },
        {
          "pergunta": "Onde fica 5/8?",
          "etiqueta": "5/8",
          "min": 0,
          "max": 1,
          "passo": 0.125,
          "valor": 0.625,
          "tolerancia": 0.041666666666666664,
          "dica": "5/8 quer dizer: parte a reta em 8 pedaços iguais e conta 5."
        }
      ],
      [
        {
          "pergunta": "Onde fica 3/2?",
          "etiqueta": "3/2",
          "min": 0,
          "max": 2,
          "passo": 0.5,
          "valor": 1.5,
          "tolerancia": 0.08333333333333333,
          "dica": "3/2 quer dizer: parte a reta em 2 pedaços iguais e conta 3."
        },
        {
          "pergunta": "Onde fica 5/4?",
          "etiqueta": "5/4",
          "min": 0,
          "max": 2,
          "passo": 0.5,
          "valor": 1.25,
          "tolerancia": 0.08333333333333333,
          "dica": "5/4 quer dizer: parte a reta em 4 pedaços iguais e conta 5."
        },
        {
          "pergunta": "Onde fica 7/4?",
          "etiqueta": "7/4",
          "min": 0,
          "max": 2,
          "passo": 0.5,
          "valor": 1.75,
          "tolerancia": 0.08333333333333333,
          "dica": "7/4 quer dizer: parte a reta em 4 pedaços iguais e conta 7."
        },
        {
          "pergunta": "Onde fica 4/3?",
          "etiqueta": "4/3",
          "min": 0,
          "max": 2,
          "passo": 0.5,
          "valor": 1.3333333333333333,
          "tolerancia": 0.08333333333333333,
          "dica": "4/3 quer dizer: parte a reta em 3 pedaços iguais e conta 4."
        }
      ]
    ]
  },
  {
    "id": "r2",
    "nome": "Coloca o Decimal",
    "icone": "🔢",
    "motor": "reta",
    "cat": "decimais",
    "sub": "a vírgula na reta",
    "niveis": [
      [
        {
          "pergunta": "Onde fica 2,5?",
          "etiqueta": "2,5",
          "min": 0,
          "max": 5,
          "passo": 1,
          "valor": 2.5,
          "tolerancia": 0.20833333333333334,
          "dica": "Procura primeiro o número inteiro e só depois a parte decimal."
        },
        {
          "pergunta": "Onde fica 1,5?",
          "etiqueta": "1,5",
          "min": 0,
          "max": 5,
          "passo": 1,
          "valor": 1.5,
          "tolerancia": 0.20833333333333334,
          "dica": "Procura primeiro o número inteiro e só depois a parte decimal."
        },
        {
          "pergunta": "Onde fica 3,5?",
          "etiqueta": "3,5",
          "min": 0,
          "max": 5,
          "passo": 1,
          "valor": 3.5,
          "tolerancia": 0.20833333333333334,
          "dica": "Procura primeiro o número inteiro e só depois a parte decimal."
        }
      ],
      [
        {
          "pergunta": "Onde fica 2,4?",
          "etiqueta": "2,4",
          "min": 0,
          "max": 5,
          "passo": 1,
          "valor": 2.4,
          "tolerancia": 0.20833333333333334,
          "dica": "Procura primeiro o número inteiro e só depois a parte decimal."
        },
        {
          "pergunta": "Onde fica 0,7?",
          "etiqueta": "0,7",
          "min": 0,
          "max": 5,
          "passo": 1,
          "valor": 0.7,
          "tolerancia": 0.20833333333333334,
          "dica": "Procura primeiro o número inteiro e só depois a parte decimal."
        },
        {
          "pergunta": "Onde fica 4,2?",
          "etiqueta": "4,2",
          "min": 0,
          "max": 5,
          "passo": 1,
          "valor": 4.2,
          "tolerancia": 0.20833333333333334,
          "dica": "Procura primeiro o número inteiro e só depois a parte decimal."
        },
        {
          "pergunta": "Onde fica 1,8?",
          "etiqueta": "1,8",
          "min": 0,
          "max": 5,
          "passo": 1,
          "valor": 1.8,
          "tolerancia": 0.20833333333333334,
          "dica": "Procura primeiro o número inteiro e só depois a parte decimal."
        }
      ],
      [
        {
          "pergunta": "Onde fica 2,35?",
          "etiqueta": "2,35",
          "min": 2,
          "max": 3,
          "passo": 0.1,
          "valor": 2.35,
          "tolerancia": 0.041666666666666664,
          "dica": "Cada marca pequena vale um décimo (0,1)."
        },
        {
          "pergunta": "Onde fica 0,85?",
          "etiqueta": "0,85",
          "min": 0,
          "max": 1,
          "passo": 0.1,
          "valor": 0.85,
          "tolerancia": 0.041666666666666664,
          "dica": "Cada marca pequena vale um décimo (0,1)."
        },
        {
          "pergunta": "Onde fica 1,15?",
          "etiqueta": "1,15",
          "min": 1,
          "max": 2,
          "passo": 0.1,
          "valor": 1.15,
          "tolerancia": 0.041666666666666664,
          "dica": "Cada marca pequena vale um décimo (0,1)."
        },
        {
          "pergunta": "Onde fica 3,6?",
          "etiqueta": "3,6",
          "min": 3,
          "max": 4,
          "passo": 0.1,
          "valor": 3.6,
          "tolerancia": 0.041666666666666664,
          "dica": "Cada marca pequena vale um décimo (0,1)."
        }
      ]
    ]
  },
  {
    "id": "r3",
    "nome": "Perto ou Longe?",
    "icone": "📏",
    "motor": "reta",
    "cat": "sequencias",
    "sub": "arredondar à dezena/centena",
    "niveis": [
      [
        {
          "pergunta": "47 está mais perto de quem? Arrasta 47 para o seu lugar.",
          "etiqueta": "47",
          "min": 40,
          "max": 50,
          "passo": 1,
          "valor": 47,
          "tolerancia": 0.8333333333333334,
          "alvoArredondado": 50,
          "dica": "Passa do meio (45)? Se sim, vai para 50. Se não, fica em 40."
        },
        {
          "pergunta": "83 está mais perto de quem? Arrasta 83 para o seu lugar.",
          "etiqueta": "83",
          "min": 80,
          "max": 90,
          "passo": 1,
          "valor": 83,
          "tolerancia": 0.8333333333333334,
          "alvoArredondado": 80,
          "dica": "Passa do meio (85)? Se sim, vai para 90. Se não, fica em 80."
        },
        {
          "pergunta": "25 está mais perto de quem? Arrasta 25 para o seu lugar.",
          "etiqueta": "25",
          "min": 20,
          "max": 30,
          "passo": 1,
          "valor": 25,
          "tolerancia": 0.8333333333333334,
          "alvoArredondado": 30,
          "dica": "Está mesmo no meio — nesse caso arredonda-se para cima."
        }
      ],
      [
        {
          "pergunta": "126 está mais perto de quem? Arrasta 126 para o seu lugar.",
          "etiqueta": "126",
          "min": 100,
          "max": 200,
          "passo": 10,
          "valor": 126,
          "tolerancia": 8.333333333333334,
          "alvoArredondado": 100,
          "dica": "Passa do meio (150)? Se sim, vai para 200. Se não, fica em 100."
        },
        {
          "pergunta": "178 está mais perto de quem? Arrasta 178 para o seu lugar.",
          "etiqueta": "178",
          "min": 100,
          "max": 200,
          "passo": 10,
          "valor": 178,
          "tolerancia": 8.333333333333334,
          "alvoArredondado": 200,
          "dica": "Passa do meio (150)? Se sim, vai para 200. Se não, fica em 100."
        },
        {
          "pergunta": "349 está mais perto de quem? Arrasta 349 para o seu lugar.",
          "etiqueta": "349",
          "min": 300,
          "max": 400,
          "passo": 10,
          "valor": 349,
          "tolerancia": 8.333333333333334,
          "alvoArredondado": 300,
          "dica": "Passa do meio (350)? Se sim, vai para 400. Se não, fica em 300."
        },
        {
          "pergunta": "251 está mais perto de quem? Arrasta 251 para o seu lugar.",
          "etiqueta": "251",
          "min": 200,
          "max": 300,
          "passo": 10,
          "valor": 251,
          "tolerancia": 8.333333333333334,
          "alvoArredondado": 300,
          "dica": "Passa do meio (250)? Se sim, vai para 300. Se não, fica em 200."
        }
      ],
      [
        {
          "pergunta": "1480 está mais perto de quem? Arrasta 1480 para o seu lugar.",
          "etiqueta": "1480",
          "min": 1000,
          "max": 2000,
          "passo": 100,
          "valor": 1480,
          "tolerancia": 83.33333333333333,
          "alvoArredondado": 1000,
          "dica": "Passa do meio (1500)? Se sim, vai para 2000. Se não, fica em 1000."
        },
        {
          "pergunta": "2620 está mais perto de quem? Arrasta 2620 para o seu lugar.",
          "etiqueta": "2620",
          "min": 2000,
          "max": 3000,
          "passo": 100,
          "valor": 2620,
          "tolerancia": 83.33333333333333,
          "alvoArredondado": 3000,
          "dica": "Passa do meio (2500)? Se sim, vai para 3000. Se não, fica em 2000."
        },
        {
          "pergunta": "3510 está mais perto de quem? Arrasta 3510 para o seu lugar.",
          "etiqueta": "3510",
          "min": 3000,
          "max": 4000,
          "passo": 100,
          "valor": 3510,
          "tolerancia": 83.33333333333333,
          "alvoArredondado": 4000,
          "dica": "Passa do meio (3500)? Se sim, vai para 4000. Se não, fica em 3000."
        },
        {
          "pergunta": "849 está mais perto de quem? Arrasta 849 para o seu lugar.",
          "etiqueta": "849",
          "min": 800,
          "max": 900,
          "passo": 10,
          "valor": 849,
          "tolerancia": 8.333333333333334,
          "alvoArredondado": 800,
          "dica": "Passa do meio (850)? Se sim, vai para 900. Se não, fica em 800."
        }
      ]
    ]
  },
  {
    "id": "c1",
    "nome": "Caça aos Múltiplos",
    "icone": "🎯",
    "motor": "crivo",
    "cat": "mult",
    "sub": "todos os múltiplos na grelha",
    "niveis": [
      [
        {
          "pergunta": "Toca em TODOS os múltiplos de 2 até 30.",
          "de": 1,
          "ate": 30,
          "certos": [
            2,
            4,
            6,
            8,
            10,
            12,
            14,
            16,
            18,
            20,
            22,
            24,
            26,
            28,
            30
          ],
          "dica": "Um múltiplo de 2 é o que se obtém contando de 2 em 2: 2, 4, 6, 8…"
        }
      ],
      [
        {
          "pergunta": "Toca em TODOS os múltiplos de 4 até 50.",
          "de": 1,
          "ate": 50,
          "certos": [
            4,
            8,
            12,
            16,
            20,
            24,
            28,
            32,
            36,
            40,
            44,
            48
          ],
          "dica": "Um múltiplo de 4 é o que se obtém contando de 4 em 4: 4, 8, 12, 16…"
        }
      ],
      [
        {
          "pergunta": "Toca em TODOS os múltiplos de 7 até 100.",
          "de": 1,
          "ate": 100,
          "certos": [
            7,
            14,
            21,
            28,
            35,
            42,
            49,
            56,
            63,
            70,
            77,
            84,
            91,
            98
          ],
          "dica": "Um múltiplo de 7 é o que se obtém contando de 7 em 7: 7, 14, 21, 28…"
        }
      ]
    ]
  },
  {
    "id": "c2",
    "nome": "O Crivo",
    "icone": "🔎",
    "motor": "crivo",
    "cat": "logica",
    "sub": "os primos até 100",
    "niveis": [
      [
        {
          "pergunta": "Toca em todos os números PRIMOS até 30.",
          "de": 2,
          "ate": 30,
          "certos": [
            2,
            3,
            5,
            7,
            11,
            13,
            17,
            19,
            23,
            29
          ],
          "dica": "Um primo só se pode dividir por 1 e por ele próprio. O 1 não conta. Começa por riscar os pares depois do 2."
        }
      ],
      [
        {
          "pergunta": "Toca em todos os números PRIMOS até 50.",
          "de": 2,
          "ate": 50,
          "certos": [
            2,
            3,
            5,
            7,
            11,
            13,
            17,
            19,
            23,
            29,
            31,
            37,
            41,
            43,
            47
          ],
          "dica": "Um primo só se pode dividir por 1 e por ele próprio. O 1 não conta. Começa por riscar os pares depois do 2."
        }
      ],
      [
        {
          "pergunta": "Toca em todos os números PRIMOS até 100.",
          "de": 2,
          "ate": 100,
          "certos": [
            2,
            3,
            5,
            7,
            11,
            13,
            17,
            19,
            23,
            29,
            31,
            37,
            41,
            43,
            47,
            53,
            59,
            61,
            67,
            71,
            73,
            79,
            83,
            89,
            97
          ],
          "dica": "Um primo só se pode dividir por 1 e por ele próprio. O 1 não conta. Começa por riscar os pares depois do 2."
        }
      ]
    ]
  },
  {
    "id": "f1",
    "nome": "Chega ao 24",
    "icone": "🎲",
    "motor": "fusao",
    "cat": "problemas",
    "sub": "combina até dar 24",
    "niveis": [
      [
        {
          "pergunta": "Junta parcelas até dar exactamente 24.",
          "alvo": 24,
          "numeros": [
            10,
            8,
            6,
            3
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 24."
        },
        {
          "pergunta": "Junta parcelas até dar exactamente 24.",
          "alvo": 24,
          "numeros": [
            12,
            7,
            5,
            4
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 24."
        },
        {
          "pergunta": "Junta parcelas até dar exactamente 24.",
          "alvo": 24,
          "numeros": [
            20,
            4,
            9,
            2
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 24."
        }
      ],
      [
        {
          "pergunta": "Junta parcelas até dar exactamente 24.",
          "alvo": 24,
          "numeros": [
            7,
            9,
            8,
            5,
            3
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 24."
        },
        {
          "pergunta": "Junta parcelas até dar exactamente 24.",
          "alvo": 24,
          "numeros": [
            11,
            6,
            7,
            4,
            2
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 24."
        },
        {
          "pergunta": "Junta parcelas até dar exactamente 24.",
          "alvo": 24,
          "numeros": [
            13,
            5,
            6,
            9,
            3
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 24."
        }
      ],
      [
        {
          "pergunta": "Junta parcelas até dar exactamente 24.",
          "alvo": 24,
          "numeros": [
            15,
            6,
            3,
            9,
            8,
            2
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 24."
        },
        {
          "pergunta": "Junta parcelas até dar exactamente 24.",
          "alvo": 24,
          "numeros": [
            17,
            4,
            3,
            11,
            5,
            6
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 24."
        },
        {
          "pergunta": "Junta parcelas até dar exactamente 24.",
          "alvo": 24,
          "numeros": [
            19,
            5,
            7,
            2,
            13,
            3
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 24."
        }
      ]
    ]
  },
  {
    "id": "f2",
    "nome": "Faz 100",
    "icone": "💯",
    "motor": "fusao",
    "cat": "problemas",
    "sub": "parcelas até 100 exacto",
    "niveis": [
      [
        {
          "pergunta": "Junta parcelas até dar exactamente 100.",
          "alvo": 100,
          "numeros": [
            50,
            30,
            20,
            15
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 100."
        },
        {
          "pergunta": "Junta parcelas até dar exactamente 100.",
          "alvo": 100,
          "numeros": [
            40,
            35,
            25,
            10
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 100."
        },
        {
          "pergunta": "Junta parcelas até dar exactamente 100.",
          "alvo": 100,
          "numeros": [
            60,
            25,
            15,
            5
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 100."
        }
      ],
      [
        {
          "pergunta": "Junta parcelas até dar exactamente 100.",
          "alvo": 100,
          "numeros": [
            45,
            30,
            25,
            12,
            8
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 100."
        },
        {
          "pergunta": "Junta parcelas até dar exactamente 100.",
          "alvo": 100,
          "numeros": [
            55,
            20,
            15,
            10,
            30
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 100."
        },
        {
          "pergunta": "Junta parcelas até dar exactamente 100.",
          "alvo": 100,
          "numeros": [
            35,
            28,
            22,
            15,
            25
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 100."
        }
      ],
      [
        {
          "pergunta": "Junta parcelas até dar exactamente 100.",
          "alvo": 100,
          "numeros": [
            47,
            33,
            20,
            18,
            12,
            9
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 100."
        },
        {
          "pergunta": "Junta parcelas até dar exactamente 100.",
          "alvo": 100,
          "numeros": [
            51,
            29,
            20,
            13,
            7,
            6
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 100."
        },
        {
          "pergunta": "Junta parcelas até dar exactamente 100.",
          "alvo": 100,
          "numeros": [
            38,
            27,
            35,
            14,
            11,
            5
          ],
          "dica": "Procura primeiro dois números que juntos fiquem perto de 100."
        }
      ]
    ]
  }
];
