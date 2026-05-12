# Projeto Interdisciplinar: Clínica de RPG Maya Yoshiko Yamamoto
**Entrega 1: Análise Descritiva de Dados**

**Nome dos integrantes:** Luiz Henrique Zaim da Cruz, Lúcio Vecchio, Gustavo Diniz Froes, Gustavo Felizardo Pires

---

## 1. Base de Dados
A base de dados completa simulada com os registros dos pacientes está disponível na planilha abaixo: 
🔗 **[Acessar Planilha de Dados no Google Drive](https://docs.google.com/spreadsheets/d/1irdnGa0XCR5whZfa0Xb6prbEp4ETkMaMCcD1yVCKyzk/edit?usp=drive_link)**

### Dicionário de Variáveis
| Nome da Variável | Tipo | Subtipo | Descrição no Sistema |
| :--- | :--- | :--- | :--- |
| **Status do Paciente** | Qualitativa | Nominal | Indica se o paciente está "Ativo" ou "Inativo". |
| **Grau de Alteração Postural** | Qualitativa | Ordinal | Classifica o resultado da avaliação funcional (Leve, Moderado, Grave). |
| **Nível de Dor** | Quantitativa | Discreta | Nota de 0 a 10 registrada pelo paciente no aplicativo. |
| **Número de Faltas** | Quantitativa | Discreta | Contagem de sessões perdidas. |
| **Idade do Paciente** | Quantitativa | Discreta | Idade em anos para perfil demográfico. |
| **Sessões Realizadas** | Quantitativa | Discreta | Soma das sessões concluídas. |
| **Tempo de Execução (Min)** | Quantitativa | Contínua | Tempo (minutos) para concluir o plano em casa. |
| **Taxa de Adesão (%)** | Quantitativa | Contínua | Porcentagem do plano prescrito cumprido. |

---

## 2. Cálculos e Medidas Estatísticas (Software)

Os cálculos foram realizados utilizando software de planilhas eletrônicas (Google Sheets/Excel). 

### 2.1 Variáveis Qualitativas — Moda

> **📌 Nota Metodológica:** Para variáveis *Qualitativas* (Status do Paciente e Grau de Alteração Postural), não é aplicável o cálculo de Média ou Percentil. A medida de tendência central correta para esses casos é a **Moda**, que indica a categoria de maior frequência na amostra.

| Variável Qualitativa | Moda (Categoria mais frequente) | Interpretação |
| :--- | :--- | :--- |
| **Status do Paciente** | Ativo | A maioria dos pacientes registrados está em tratamento ativo na clínica. |
| **Grau de Alteração Postural** | Moderado | O grau de comprometimento postural mais comum entre os pacientes é o moderado, indicando que a clínica atende predominantemente casos intermediários. |

### 2.2 Variáveis Quantitativas — Média e 95º Percentil

> **📌 Nota sobre a escolha da Média:** Para todas as variáveis quantitativas foi utilizada a **Média Aritmética** como medida de tendência central. Essa escolha é adequada para uma análise exploratória inicial, pois permite uma leitura direta do valor central da distribuição. Ressalta-se que, em variáveis com possível assimetria — como **Nível de Dor** e **Número de Faltas** —, a **Mediana** poderia ser uma alternativa mais robusta a outliers; no entanto, a média aritmética foi mantida por ser suficiente ao objetivo descritivo desta entrega.

**Fórmulas Aplicadas:**
* **Média Aritmética:** `=MÉDIA(intervalo)`
* **95º Percentil:** `=PERCENTIL.INC(intervalo; 0,95)`

### Tabela de Resultados e Interpretações

| Variável Quantitativa | Média | 95º Percentil | Interpretação Clínica do Percentil |
| :--- | :--- | :--- | :--- |
| **Nível de Dor** | 5,0 | 8,0 | 95% dos pacientes registram dor ≤ 8 durante os exercícios. Apenas 5% relatam dor extrema (notas 9 ou 10). |
| **Número de Faltas** | 1,4 | 4,5 | 95% dos pacientes possuem até 4,5 faltas. Isso ajuda a clínica a identificar os 5% altamente faltosos. |
| **Idade do Paciente** | 39,2 | 60,5 | 95% do público atendido pela Dra. Maya tem até 60,5 anos de idade. |
| **Sessões Realizadas** | 9,8 | 19,5 | 95% completaram até 19,5 sessões, sugerindo que este é o "teto" comum de duração dos tratamentos. |
| **Tempo de Execução** | 15,2 | 24,5 | 95% levam até 24,5 min para concluir o plano, validando que o volume de exercícios não está excessivo. |
| **Taxa de Adesão** | 74,8% | 99,0% | 95% dos pacientes apresentam taxa de adesão de até 99%, indicando alto engajamento geral. Somente os 5% restantes ultrapassam essa marca, chegando próximos ou iguais a 100% de cumprimento do plano prescrito. |

🔗 **[Acessar Comprovação dos Cálculos (Print do Excel no Drive)](https://drive.google.com/file/d/1h8MsZ_2hse47DKZPne4WGyFeLWyLkglX/view?usp=drive_link)**

---

## 3. Visualização de Dados (Gráficos)

> **📌 Critério de seleção:** Foi elaborado um gráfico representativo para cada **tipo** de variável presente no sistema, evitando redundância visual. Os quatro tipos cobertos são: Qualitativa Nominal, Qualitativa Ordinal, Quantitativa Discreta e Quantitativa Contínua.

### A. Status do Paciente (Qualitativa Nominal)
*Gráfico mais adequado: Setores (Pizza)*
<img width="1652" height="993" alt="Imagem1" src="https://github.com/user-attachments/assets/58df5796-fe95-49dd-9ab9-f292bb55dea2" />


### B. Grau de Alteração Postural (Qualitativa Ordinal)
*Gráfico mais adequado: Colunas*
<img width="1653" height="993" alt="Imagem2" src="https://github.com/user-attachments/assets/84d33af9-98d9-4c3b-bfd3-00bfcb64c908" />


### C. Nível de Dor (Quantitativa Discreta)
*Gráfico mais adequado: Colunas*
<img width="1653" height="993" alt="Imagem3" src="https://github.com/user-attachments/assets/a5872914-549a-4ea6-9907-80d31e5ef602" />


### D. Tempo de Execução (Quantitativa Contínua)
*Gráfico mais adequado: Histograma (Agrupamento em faixas)*
<img width="1652" height="993" alt="Imagem4" src="https://github.com/user-attachments/assets/1049a34c-cd91-45d6-9d56-b33160bcb0c3" />

---

## 4. Objetivo e Conclusão
As informações mapeadas estruturarão o Banco de Dados relacional do Aplicativo Mobile e do Módulo Web para a gestão de pacientes de RPG. A partir da coleta desses dados no sistema, o uso de medidas de Tendência Central e de Posição (como o 95º Percentil para identificar o teto máximo de faltas ou nível de dor que abrange 95% do público) fornecerão à profissional Maya Yoshiko Yamamoto indicadores precisos. Em conjunto com as visualizações gráficas sugeridas, o painel de acompanhamento web (dashboard) permitirá uma leitura rápida da adesão ao tratamento e da evolução do quadro álgico e postural, baseando a conduta clínica em dados reais, descartando subjetividades.
