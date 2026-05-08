package com.maya.rpg.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.maya.rpg.R;
import com.maya.rpg.database.DatabaseHelper;
import com.maya.rpg.utils.SessionManager;

public class LgpdActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lgpd);

        SessionManager session = new SessionManager(this);
        DatabaseHelper  db     = DatabaseHelper.getInstance(this);

        Button btnAccept  = findViewById(R.id.btn_accept);
        Button btnDecline = findViewById(R.id.btn_decline);

        btnAccept.setOnClickListener(v -> {
            db.acceptLgpd(session.getUserId());
            session.setLgpdAccepted(true);
            startActivity(new Intent(this, MainActivity.class));
            finish();
        });

        btnDecline.setOnClickListener(v -> {
            session.clearSession();
            Toast.makeText(this,
                    "É necessário aceitar os termos para usar o aplicativo.",
                    Toast.LENGTH_LONG).show();
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        });
    }
}
