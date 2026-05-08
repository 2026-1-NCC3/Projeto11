package com.maya.rpg.models;

public class User {
    private String id;          // UUID do backend
    private String name;
    private String email;
    private String token;       // JWT access_token
    private String role;        // admin, profissional, paciente
    private String pacienteId;  // UUID da tabela pacientes (só p/ role=paciente)
    private boolean lgpdAccepted;
    private String lgpdDate;

    public User() {}

    public User(String id, String name, String email, String token,
                String role, String pacienteId, boolean lgpdAccepted) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.token = token;
        this.role = role;
        this.pacienteId = pacienteId;
        this.lgpdAccepted = lgpdAccepted;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getPacienteId() { return pacienteId; }
    public void setPacienteId(String pacienteId) { this.pacienteId = pacienteId; }
    public boolean isLgpdAccepted() { return lgpdAccepted; }
    public void setLgpdAccepted(boolean lgpdAccepted) { this.lgpdAccepted = lgpdAccepted; }
    public String getLgpdDate() { return lgpdDate; }
    public void setLgpdDate(String lgpdDate) { this.lgpdDate = lgpdDate; }

    public String getFirstName() {
        if (name == null || name.isEmpty()) return "Paciente";
        return name.split(" ")[0];
    }
}
