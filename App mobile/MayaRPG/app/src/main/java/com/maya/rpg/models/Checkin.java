package com.maya.rpg.models;

public class Checkin {
    public static final int NOT_DONE  = 0;
    public static final int PARTIAL   = 1;
    public static final int COMPLETED = 2;

    private String id;
    private String pacienteId;
    private String prescricaoId;
    private String exerciseName;
    private int completed;       // 0=não feito, 1=parcial, 2=completo (usado local)
    private boolean executado;   // usado na API (true/false)
    private int painLevel;
    private String notes;
    private String checkinDate;
    private boolean synced;

    public Checkin() {}

    public Checkin(String pacienteId, String prescricaoId,
                   int completed, int painLevel, String notes) {
        this.pacienteId = pacienteId;
        this.prescricaoId = prescricaoId;
        this.completed = completed;
        this.executado = (completed == COMPLETED);
        this.painLevel = painLevel;
        this.notes = notes;
        this.synced = false;
    }

    public String getCompletedLabel() {
        switch (completed) {
            case COMPLETED: return "Completo";
            case PARTIAL:   return "Parcial";
            default:        return "Não realizado";
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPacienteId() { return pacienteId; }
    public void setPacienteId(String pacienteId) { this.pacienteId = pacienteId; }
    public String getPrescricaoId() { return prescricaoId; }
    public void setPrescricaoId(String prescricaoId) { this.prescricaoId = prescricaoId; }
    public String getExerciseName() { return exerciseName; }
    public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }
    public int getCompleted() { return completed; }
    public void setCompleted(int completed) {
        this.completed = completed;
        this.executado = (completed == COMPLETED);
    }
    public boolean isExecutado() { return executado; }
    public void setExecutado(boolean executado) {
        this.executado = executado;
        this.completed = executado ? COMPLETED : NOT_DONE;
    }
    public int getPainLevel() { return painLevel; }
    public void setPainLevel(int painLevel) { this.painLevel = painLevel; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getCheckinDate() { return checkinDate; }
    public void setCheckinDate(String checkinDate) { this.checkinDate = checkinDate; }
    public boolean isSynced() { return synced; }
    public void setSynced(boolean synced) { this.synced = synced; }
}
