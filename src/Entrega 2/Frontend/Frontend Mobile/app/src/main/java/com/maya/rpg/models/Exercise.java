package com.maya.rpg.models;

public class Exercise {
    // IDs do backend (UUIDs)
    private String id;              // id da prescrição
    private String exercicioId;     // id do exercício no banco de exercícios

    // Dados do exercício (vêm do JOIN na resposta de prescrições)
    private String name;
    private String description;
    private String instrucoes;
    private String musculoAlvo;
    private String tipo;            // alongamento, fortalecimento, mobilidade, etc.
    private String dificuldade;     // facil, moderado, dificil
    private String midiaUrl;

    // Dados da prescrição
    private int sets;               // series
    private int reps;               // repeticoes
    private int durationSeconds;    // duracao_seg
    private String frequencia;
    private String observacoes;

    // Para compatibilidade com modo offline
    private int restSeconds;
    private String videoUrl;
    private String imageUrl;
    private int orderIndex;

    public Exercise() {}

    // ── Getters e Setters ──────────────────────────────────────

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getExercicioId() { return exercicioId; }
    public void setExercicioId(String exercicioId) { this.exercicioId = exercicioId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getInstrucoes() { return instrucoes; }
    public void setInstrucoes(String instrucoes) { this.instrucoes = instrucoes; }
    public String getMusculoAlvo() { return musculoAlvo; }
    public void setMusculoAlvo(String musculoAlvo) { this.musculoAlvo = musculoAlvo; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getDificuldade() { return dificuldade; }
    public void setDificuldade(String dificuldade) { this.dificuldade = dificuldade; }
    public String getMidiaUrl() { return midiaUrl; }
    public void setMidiaUrl(String midiaUrl) { this.midiaUrl = midiaUrl; }
    public int getSets() { return sets; }
    public void setSets(int sets) { this.sets = sets; }
    public int getReps() { return reps; }
    public void setReps(int reps) { this.reps = reps; }
    public int getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(int durationSeconds) { this.durationSeconds = durationSeconds; }
    public String getFrequencia() { return frequencia; }
    public void setFrequencia(String frequencia) { this.frequencia = frequencia; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public int getRestSeconds() { return restSeconds; }
    public void setRestSeconds(int restSeconds) { this.restSeconds = restSeconds; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }

    public String getFormattedDuration() {
        if (reps > 0) {
            return sets + " séries × " + reps + " repetições";
        } else if (durationSeconds > 0) {
            int min = durationSeconds / 60;
            int sec = durationSeconds % 60;
            if (min > 0 && sec > 0) return sets + " série × " + min + "min " + sec + "s";
            if (min > 0) return sets + " série × " + min + " minuto" + (min > 1 ? "s" : "");
            return sets + " série × " + sec + " segundos";
        }
        return "Ver orientações";
    }

    /** Retorna label legível do tipo de exercício */
    public String getTipoLabel() {
        if (tipo == null) return "";
        switch (tipo) {
            case "alongamento":     return "Alongamento";
            case "fortalecimento":  return "Fortalecimento";
            case "mobilidade":      return "Mobilidade";
            case "respiratorio":    return "Respiratório";
            case "postural":        return "Postural";
            default:                return "Outro";
        }
    }
}
