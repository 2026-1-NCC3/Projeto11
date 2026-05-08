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

public class RegisterActivity extends AppCompatActivity {

    private EditText etName, etEmail, etPassword, etConfirmPassword;
    private Button btnRegister;
    private ProgressBar progressBar;
    private DatabaseHelper dbHelper;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        dbHelper       = DatabaseHelper.getInstance(this);
        sessionManager = new SessionManager(this);

        etName            = findViewById(R.id.et_name);
        etEmail           = findViewById(R.id.et_email);
        etPassword        = findViewById(R.id.et_password);
        etConfirmPassword = findViewById(R.id.et_confirm_password);
        btnRegister       = findViewById(R.id.btn_register);
        progressBar       = findViewById(R.id.progress_bar);
        TextView tvLogin  = findViewById(R.id.tv_login);

        btnRegister.setOnClickListener(v -> attemptRegister());
        tvLogin.setOnClickListener(v -> finish());
    }

    private void attemptRegister() {
        String name     = etName.getText().toString().trim();
        String email    = etEmail.getText().toString().trim().toLowerCase();
        String password = etPassword.getText().toString();
        String confirm  = etConfirmPassword.getText().toString();

        if (name.length() < 3) { etName.setError("Nome muito curto"); return; }
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            etEmail.setError("E-mail inválido"); return;
        }
        if (password.length() < 6) { etPassword.setError("Mínimo 6 caracteres"); return; }
        if (!password.equals(confirm)) { etConfirmPassword.setError("Senhas não coincidem"); return; }

        progressBar.setVisibility(View.VISIBLE);
        btnRegister.setEnabled(false);

        if (sessionManager.isDemoMode()) {
            // Sem API → registro apenas local
            registerLocal(name, email, password);
        } else {
            // Tenta registrar na API primeiro
            registerWithApi(name, email, password);
        }
    }

    private void registerWithApi(String name, String email, String password) {
        ApiClient.register(name, email, password, new ApiClient.ApiCallback<User>() {
            @Override
            public void onSuccess(User apiUser) {
                // Salva localmente também
                dbHelper.createUser(
                        apiUser.getId(), apiUser.getName(), email,
                        HashUtils.sha256(password), apiUser.getRole(),
                        apiUser.getPacienteId());

                // Auto-login após cadastro na API
                runOnUiThread(() -> {
                    progressBar.setVisibility(View.GONE);
                    btnRegister.setEnabled(true);

                    sessionManager.saveSession(apiUser);
                    Toast.makeText(RegisterActivity.this,
                            "Conta criada com sucesso!", Toast.LENGTH_SHORT).show();

                    // Vai direto para LGPD (primeiro acesso)
                    Intent intent = new Intent(RegisterActivity.this, LgpdActivity.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                    finish();
                });
            }

            @Override
            public void onError(String error) {
                runOnUiThread(() -> {
                    progressBar.setVisibility(View.GONE);
                    btnRegister.setEnabled(true);
                    Toast.makeText(RegisterActivity.this, error, Toast.LENGTH_LONG).show();
                });
            }
        });
    }

    private void registerLocal(String name, String email, String password) {
        new Thread(() -> {
            User existing = dbHelper.getUserByEmail(email);
            if (existing != null) {
                runOnUiThread(() -> {
                    progressBar.setVisibility(View.GONE);
                    btnRegister.setEnabled(true);
                    Toast.makeText(this, "E-mail já cadastrado.", Toast.LENGTH_SHORT).show();
                });
                return;
            }
            dbHelper.createUser(name, email, HashUtils.sha256(password));
            runOnUiThread(() -> {
                progressBar.setVisibility(View.GONE);
                btnRegister.setEnabled(true);
                Toast.makeText(this, "Conta criada! Faça login.", Toast.LENGTH_LONG).show();
                finish();
            });
        }).start();
    }
}
