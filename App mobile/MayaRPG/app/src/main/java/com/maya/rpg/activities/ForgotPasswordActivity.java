package com.maya.rpg.activities;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.maya.rpg.R;

public class ForgotPasswordActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forgot_password);

        EditText etEmail       = findViewById(R.id.et_email);
        Button btnSend         = findViewById(R.id.btn_send);
        TextView tvBack        = findViewById(R.id.tv_back);
        LinearLayout llSuccess = findViewById(R.id.ll_success);
        LinearLayout llForm    = findViewById(R.id.ll_form);

        btnSend.setOnClickListener(v -> {
            String email = etEmail.getText().toString().trim();
            if (email.isEmpty()) {
                etEmail.setError("Digite seu e-mail");
                return;
            }
            llForm.setVisibility(View.GONE);
            llSuccess.setVisibility(View.VISIBLE);
        });

        tvBack.setOnClickListener(v -> finish());
    }
}
