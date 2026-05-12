package com.maya.rpg.activities;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.maya.rpg.R;
import com.maya.rpg.network.ApiClient;
import com.maya.rpg.utils.SessionManager;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public class SplashActivity extends AppCompatActivity {

    private SessionManager sessionManager;
    private TextView tvStatus;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        sessionManager = new SessionManager(this);
        tvStatus = findViewById(R.id.tv_splash_status);
        checkApiAndProceed();
    }

    private void checkApiAndProceed() {
        tvStatus.setText("Conectando ao servidor...");
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Handler mainHandler = new Handler(Looper.getMainLooper());
        Future<Boolean> future = executor.submit(() -> ApiClient.isApiAvailable());
        executor.submit(() -> {
            boolean apiAvailable = false;
            try {
                apiAvailable = future.get(45, TimeUnit.SECONDS); // Render cold start até 45s
            } catch (TimeoutException e) {
                future.cancel(true);
            } catch (Exception e) {
                // sem conexão
            }
            final boolean isOnline = apiAvailable;
            mainHandler.post(() -> {
                sessionManager.setDemoMode(!isOnline);
                tvStatus.setText(isOnline ? "Conectado" : "Modo demonstração ativo");
                new Handler(Looper.getMainLooper()).postDelayed(
                        this::navigateToNextScreen, 1000);
            });
        });
        executor.shutdown();
    }

    private void navigateToNextScreen() {
        Intent intent = sessionManager.isLoggedIn()
                ? new Intent(this, MainActivity.class)
                : new Intent(this, LoginActivity.class);
        startActivity(intent);
        finish();
    }
}
