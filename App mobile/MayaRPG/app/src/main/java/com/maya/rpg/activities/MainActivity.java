package com.maya.rpg.activities;

import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.maya.rpg.R;
import com.maya.rpg.fragments.CheckinFragment;
import com.maya.rpg.fragments.HistoryFragment;
import com.maya.rpg.fragments.HomeFragment;
import com.maya.rpg.fragments.PlanFragment;
import com.maya.rpg.utils.SessionManager;

public class MainActivity extends AppCompatActivity {

    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        sessionManager = new SessionManager(this);

        // Exibe banner de modo demonstração se aplicável
        TextView tvDemoBanner = findViewById(R.id.tv_demo_banner);
        if (sessionManager.isDemoMode()) {
            tvDemoBanner.setVisibility(View.VISIBLE);
        } else {
            tvDemoBanner.setVisibility(View.GONE);
        }

        // Configura a bottom navigation
        BottomNavigationView bottomNav = findViewById(R.id.bottom_navigation);
        bottomNav.setOnItemSelectedListener(item -> {
            Fragment selected = null;
            int id = item.getItemId();

            if (id == R.id.nav_home) {
                selected = new HomeFragment();
            } else if (id == R.id.nav_plan) {
                selected = new PlanFragment();
            } else if (id == R.id.nav_checkin) {
                selected = new CheckinFragment();
            } else if (id == R.id.nav_history) {
                selected = new HistoryFragment();
            }

            if (selected != null) {
                getSupportFragmentManager()
                        .beginTransaction()
                        .replace(R.id.fragment_container, selected)
                        .commit();
                return true;
            }
            return false;
        });

        // Fragment inicial: Home
        if (savedInstanceState == null) {
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragment_container, new HomeFragment())
                    .commit();
            bottomNav.setSelectedItemId(R.id.nav_home);
        }

        // Tenta sincronizar check-ins pendentes e agenda lembrete
        if (!sessionManager.isDemoMode()) {
            syncPendingCheckins();
        }
        scheduleDailyReminder();
    }

    private void syncPendingCheckins() {
        com.maya.rpg.database.DatabaseHelper db = com.maya.rpg.database.DatabaseHelper.getInstance(this);
        java.util.List<com.maya.rpg.models.Checkin> unsynced = db.getUnsyncedCheckins();
        
        for (com.maya.rpg.models.Checkin c : unsynced) {
            boolean executado = (c.getCompleted() == com.maya.rpg.models.Checkin.COMPLETED);
            com.maya.rpg.network.ApiClient.postCheckin(
                c.getPacienteId(), 
                c.getPrescricaoId(), 
                executado, 
                c.getPainLevel(), 
                c.getNotes(), 
                sessionManager.getToken(),
                new com.maya.rpg.network.ApiClient.ApiCallback<Boolean>() {
                    @Override
                    public void onSuccess(Boolean result) {
                        if (result) {
                            db.markCheckinAsSynced(c.getId());
                        }
                    }
                    @Override
                    public void onError(String error) {}
                }
            );
        }
    }

    private void scheduleDailyReminder() {
        android.app.AlarmManager alarmManager = (android.app.AlarmManager) getSystemService(ALARM_SERVICE);
        android.content.Intent intent = new android.content.Intent(this, ReminderReceiver.class);
        android.app.PendingIntent pendingIntent = android.app.PendingIntent.getBroadcast(this, 0, intent,
                android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE);

        java.util.Calendar calendar = java.util.Calendar.getInstance();
        calendar.set(java.util.Calendar.HOUR_OF_DAY, 18); // 18:00
        calendar.set(java.util.Calendar.MINUTE, 0);
        calendar.set(java.util.Calendar.SECOND, 0);

        if (java.util.Calendar.getInstance().after(calendar)) {
            calendar.add(java.util.Calendar.DAY_OF_MONTH, 1);
        }

        if (alarmManager != null) {
            alarmManager.setRepeating(android.app.AlarmManager.RTC_WAKEUP,
                    calendar.getTimeInMillis(), android.app.AlarmManager.INTERVAL_DAY, pendingIntent);
        }
    }
}