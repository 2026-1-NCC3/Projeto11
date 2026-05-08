package com.maya.rpg.activities;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.maya.rpg.R;

public class ExerciseDetailActivity extends AppCompatActivity {

    public static final String EXTRA_EXERCISE_NAME        = "exercise_name";
    public static final String EXTRA_EXERCISE_DESCRIPTION = "exercise_description";
    public static final String EXTRA_EXERCISE_DURATION    = "exercise_duration";
    public static final String EXTRA_EXERCISE_REST        = "exercise_rest";
    public static final String EXTRA_EXERCISE_VIDEO_URL   = "exercise_video_url";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_exercise_detail);

        String name        = getIntent().getStringExtra(EXTRA_EXERCISE_NAME);
        String description = getIntent().getStringExtra(EXTRA_EXERCISE_DESCRIPTION);
        String duration    = getIntent().getStringExtra(EXTRA_EXERCISE_DURATION);
        String rest        = getIntent().getStringExtra(EXTRA_EXERCISE_REST);
        String videoUrl    = getIntent().getStringExtra(EXTRA_EXERCISE_VIDEO_URL);

        ((TextView) findViewById(R.id.tv_exercise_name)).setText(name);
        ((TextView) findViewById(R.id.tv_exercise_description)).setText(description);
        ((TextView) findViewById(R.id.tv_exercise_duration)).setText(duration);
        ((TextView) findViewById(R.id.tv_exercise_rest)).setText(
                rest != null && !rest.equals("0") ? rest + "s entre séries" : "Sem descanso");

        Button btnVideo = findViewById(R.id.btn_watch_video);
        if (videoUrl != null && !videoUrl.isEmpty()) {
            btnVideo.setOnClickListener(v -> {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(videoUrl));
                startActivity(intent);
            });
        } else {
            btnVideo.setEnabled(false);
            btnVideo.setText("Vídeo não disponível");
        }

        findViewById(R.id.btn_back).setOnClickListener(v -> finish());
    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
}