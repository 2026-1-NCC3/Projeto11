package com.maya.rpg.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.maya.rpg.R;
import com.maya.rpg.database.DatabaseHelper;
import com.maya.rpg.models.User;
import com.maya.rpg.network.ApiClient;
import com.maya.rpg.utils.HashUtils;
import com.maya.rpg.utils.SessionManager;

public class LoginActivity extends AppCompatActivity {

    private EditText etEmail, etPassword;
    private Button btnLogin;
    private ProgressBar progressBar;
    private SessionManager sessionManager;
    private DatabaseHelper dbHelper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        sessionManager = new SessionManager(this);
        dbHelper = DatabaseHelper.getInstance(this);

        etEmail    = findViewById(R.id.et_email);
        etPassword = findViewById(R.id.et_password);
        btnLogin   = findViewById(R.id.btn_login);
        progressBar = findViewById(R.id.progress_bar);

        TextView tvDemoWarning = findViewById(R.id.tv_demo_warning);
        if (sessionManager.isDemoMode()) {
            tvDemoWarning.setVisibility(View.VISIBLE);
        }

        TextView tvForgotPassword = findViewById(R.id.tv_forgot_password);
        TextView tvRegister = findViewById(R.id.tv_register);

        btnLogin.setOnClickListener(v -> attemptLogin());

        tvForgotPassword.setOnClickListener(v ->
                startActivity(new Intent(this, ForgotPasswordActivity.class)));

        tvRegister.setOnClickListener(v ->
                startActivity(new Intent(this, RegisterActivity.class)));
    }

    private void attemptLogin() {
        String email    = etEmail.getText().toString().trim().toLowerCase();
        String password = etPassword.getText().toString();

        if (email.isEmpty()) {
            etEmail.setError("Digite seu e-mail");
            return;
        }
        if (password.isEmpty()) {
            etPassword.setError("Digite sua senha");
            return;
        }

        setLoading(true);

        if (sessionManager.isDemoMode()) {
            loginLocal(email, password);
        } else {
            loginWithApi(email, password);
        }
    }

    private void loginWithApi(String email, String password) {
        ApiClient.login(email, password, new ApiClient.ApiCallback<User>() {
            @Override
            public void onSuccess(User apiUser) {
                User localUser = dbHelper.getUserByEmail(email);
                if (localUser == null) {
                    long id = dbHelper.createUser(
                            apiUser.getName(), email, HashUtils.sha256(password));
                    apiUser.setId((int) id);
                } else {
                    apiUser.setId(localUser.getId());
                    apiUser.setLgpdAccepted(localUser.isLgpdAccepted());
                }
                dbHelper.seedDemoData(apiUser.getId());
                proceedAfterLogin(apiUser);
            }

            @Override
            public void onError(String error) {
                loginLocal(email, password);
            }
        });
    }

    private void loginLocal(String email, String password) {
        new Thread(() -> {
            android.database.Cursor c = dbHelper.getReadableDatabase().rawQuery(
                    "SELECT * FROM users WHERE email = ? AND password_hash = ? LIMIT 1",
                    new String[]{email, HashUtils.sha256(password)});

            if (c.moveToFirst()) {
                User localUser = new User();
                localUser.setId(c.getInt(c.getColumnIndexOrThrow("id")));
                localUser.setName(c.getString(c.getColumnIndexOrThrow("name")));
                localUser.setEmail(c.getString(c.getColumnIndexOrThrow("email")));
                localUser.setLgpdAccepted(c.getInt(c.getColumnIndexOrThrow("lgpd_accepted")) == 1);
                c.close();
                dbHelper.seedDemoData(localUser.getId());
                proceedAfterLogin(localUser);
            } else {
                c.close();
                runOnUiThread(() -> {
                    setLoading(false);
                    Toast.makeText(this, "E-mail ou senha incorretos.", Toast.LENGTH_SHORT).show();
                });
            }
        }).start();
    }

    private void proceedAfterLogin(User user) {
        runOnUiThread(() -> {
            sessionManager.saveSession(user);
            if (!user.isLgpdAccepted()) {
                startActivity(new Intent(this, LgpdActivity.class));
            } else {
                startActivity(new Intent(this, MainActivity.class));
            }
            finish();
            setLoading(false);
        });
    }

    private void setLoading(boolean loading) {
        runOnUiThread(() -> {
            progressBar.setVisibility(loading ? View.VISIBLE : View.GONE);
            btnLogin.setEnabled(!loading);
        });
    }
}