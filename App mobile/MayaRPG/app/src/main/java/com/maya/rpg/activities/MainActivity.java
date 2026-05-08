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
    }
}