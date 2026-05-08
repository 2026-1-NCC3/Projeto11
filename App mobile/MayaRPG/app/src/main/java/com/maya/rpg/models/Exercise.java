package com.maya.rpg.models;

public class Exercise {
    private int id;
    private int planId;
    private String name;
    private String description;
    private int sets;
    private int reps;
    private int durationSeconds;
    private int restSeconds;
    private String videoUrl;
    private String imageUrl;
    private int orderIndex;

    public Exercise() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getPlanId() { return planId; }
    public void setPlanId(int planId) { this.planId = planId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getSets() { return sets; }
    public void setSets(int sets) { this.sets = sets; }
    public int getReps() { return reps; }
    public void setReps(int reps) { this.reps = reps; }
    public int getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(int durationSeconds) { this.durationSeconds = durationSeconds; }
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
}
