package com.maya.rpg.models;

public class Checkin {
    public static final int NOT_DONE  = 0;
    public static final int PARTIAL   = 1;
    public static final int COMPLETED = 2;

    private int id;
    private int userId;
    private int planId;
    private int exerciseId;
    private String exerciseName;
    private int completed;
    private int painLevel;
    private String notes;
    private String checkinDate;
    private boolean synced;

    public Checkin() {}

    public Checkin(int userId, int planId, int exerciseId,
                   int completed, int painLevel, String notes) {
        this.userId = userId;
        this.planId = planId;
        this.exerciseId = exerciseId;
        this.completed = completed;
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

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public int getPlanId() { return planId; }
    public void setPlanId(int planId) { this.planId = planId; }
    public int getExerciseId() { return exerciseId; }
    public void setExerciseId(int exerciseId) { this.exerciseId = exerciseId; }
    public String getExerciseName() { return exerciseName; }
    public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }
    public int getCompleted() { return completed; }
    public void setCompleted(int completed) { this.completed = completed; }
    public int getPainLevel() { return painLevel; }
    public void setPainLevel(int painLevel) { this.painLevel = painLevel; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getCheckinDate() { return checkinDate; }
    public void setCheckinDate(String checkinDate) { this.checkinDate = checkinDate; }
    public boolean isSynced() { return synced; }
    public void setSynced(boolean synced) { this.synced = synced; }
}
