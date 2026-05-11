package com.maya.rpg.models;

public class Plan {
    private int id;
    private int userId;
    private String title;
    private String description;
    private String frequency;
    private int durationWeeks;
    private boolean isActive;

    public Plan() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public int getDurationWeeks() { return durationWeeks; }
    public void setDurationWeeks(int durationWeeks) { this.durationWeeks = durationWeeks; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
