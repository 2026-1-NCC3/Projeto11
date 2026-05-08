package com.maya.rpg.models;

public class User {
    private int id;
    private String name;
    private String email;
    private String token;
    private boolean lgpdAccepted;
    private String lgpdDate;

    public User() {}

    public User(int id, String name, String email, String token, boolean lgpdAccepted) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.token = token;
        this.lgpdAccepted = lgpdAccepted;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public boolean isLgpdAccepted() { return lgpdAccepted; }
    public void setLgpdAccepted(boolean lgpdAccepted) { this.lgpdAccepted = lgpdAccepted; }
    public String getLgpdDate() { return lgpdDate; }
    public void setLgpdDate(String lgpdDate) { this.lgpdDate = lgpdDate; }

    public String getFirstName() {
        if (name == null || name.isEmpty()) return "Paciente";
        return name.split(" ")[0];
    }
}
