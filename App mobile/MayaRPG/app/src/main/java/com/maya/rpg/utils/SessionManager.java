package com.maya.rpg.utils;

import android.content.Context;
import android.content.SharedPreferences;
import com.maya.rpg.models.User;

public class SessionManager {

    private static final String PREF_NAME       = "maya_session";
    private static final String KEY_USER_ID     = "user_id";
    private static final String KEY_PACIENTE_ID = "paciente_id";
    private static final String KEY_NAME        = "name";
    private static final String KEY_EMAIL       = "email";
    private static final String KEY_TOKEN       = "token";
    private static final String KEY_ROLE        = "role";
    private static final String KEY_LGPD        = "lgpd_accepted";
    private static final String KEY_LOGGED_IN   = "is_logged_in";
    private static final String KEY_DEMO_MODE   = "demo_mode";

    private final SharedPreferences prefs;
    private final SharedPreferences.Editor editor;

    public SessionManager(Context context) {
        prefs  = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = prefs.edit();
    }

    public void saveSession(User user) {
        editor.putBoolean(KEY_LOGGED_IN, true);
        editor.putString(KEY_USER_ID,     user.getId() != null ? user.getId() : "");
        editor.putString(KEY_PACIENTE_ID, user.getPacienteId() != null ? user.getPacienteId() : "");
        editor.putString(KEY_NAME,        user.getName());
        editor.putString(KEY_EMAIL,       user.getEmail());
        editor.putString(KEY_TOKEN,       user.getToken() != null ? user.getToken() : "");
        editor.putString(KEY_ROLE,        user.getRole() != null ? user.getRole() : "paciente");
        editor.putBoolean(KEY_LGPD,       user.isLgpdAccepted());
        editor.apply();
    }

    public void setLgpdAccepted(boolean accepted) {
        editor.putBoolean(KEY_LGPD, accepted);
        editor.apply();
    }

    public void setDemoMode(boolean demoMode) {
        editor.putBoolean(KEY_DEMO_MODE, demoMode);
        editor.apply();
    }

    public boolean isDemoMode() {
        return prefs.getBoolean(KEY_DEMO_MODE, false);
    }

    public boolean isLoggedIn() {
        return prefs.getBoolean(KEY_LOGGED_IN, false);
    }

    public User getLoggedUser() {
        if (!isLoggedIn()) return null;
        User user = new User();
        user.setId(prefs.getString(KEY_USER_ID, ""));
        user.setPacienteId(prefs.getString(KEY_PACIENTE_ID, ""));
        user.setName(prefs.getString(KEY_NAME, ""));
        user.setEmail(prefs.getString(KEY_EMAIL, ""));
        user.setToken(prefs.getString(KEY_TOKEN, ""));
        user.setRole(prefs.getString(KEY_ROLE, "paciente"));
        user.setLgpdAccepted(prefs.getBoolean(KEY_LGPD, false));
        return user;
    }

    public String getUserId()     { return prefs.getString(KEY_USER_ID, ""); }
    public String getPacienteId() { return prefs.getString(KEY_PACIENTE_ID, ""); }
    public String getToken()      { return prefs.getString(KEY_TOKEN, ""); }
    public String getRole()       { return prefs.getString(KEY_ROLE, "paciente"); }
    public boolean isLgpdAccepted() { return prefs.getBoolean(KEY_LGPD, false); }

    public void clearSession() {
        editor.clear();
        editor.apply();
    }
}
