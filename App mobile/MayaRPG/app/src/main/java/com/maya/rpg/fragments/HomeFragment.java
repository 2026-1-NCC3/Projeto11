package com.maya.rpg.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.maya.rpg.R;
import com.maya.rpg.database.DatabaseHelper;
import com.maya.rpg.models.Exercise;
import com.maya.rpg.utils.SessionManager;
import java.util.Calendar;
import java.util.List;
import android.content.Intent;
import android.widget.Button;

public class HomeFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_home, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        SessionManager session = new SessionManager(requireContext());
        DatabaseHelper db = DatabaseHelper.getInstance(requireContext());

        TextView tvGreeting = view.findViewById(R.id.tv_greeting);
        String firstName = session.getLoggedUser() != null
                ? session.getLoggedUser().getFirstName() : "Paciente";
        tvGreeting.setText(getGreeting() + ", " + firstName);

        // Progresso semanal usando pacienteId
        String pacienteId = session.getPacienteId();
        if (pacienteId == null || pacienteId.isEmpty()) {
            pacienteId = session.getUserId();
        }

        TextView tvProgress = view.findViewById(R.id.tv_weekly_progress);
        int progress = db.getWeeklyProgress(pacienteId);
        tvProgress.setText(progress + " / 3 sessões esta semana");

        ProgressBar pbWeekly = view.findViewById(R.id.pb_weekly);
        pbWeekly.setMax(3);
        pbWeekly.setProgress(Math.min(progress, 3));

        // Nome do plano — mostra quantidade de exercícios prescritos
        TextView tvPlan = view.findViewById(R.id.tv_plan_name);
        List<Exercise> exercises = db.getExercisesByUser(pacienteId);
        if (!exercises.isEmpty()) {
            tvPlan.setText(exercises.size() + " exercícios prescritos");
        } else {
            tvPlan.setText("Nenhum plano ativo");
        }

        TextView tvDemo = view.findViewById(R.id.tv_demo_banner_home);
        if (session.isDemoMode()) {
            tvDemo.setVisibility(View.VISIBLE);
        }

        Button btnLogout = view.findViewById(R.id.btn_logout);
        btnLogout.setOnClickListener(v -> {
            new android.app.AlertDialog.Builder(requireContext())
                    .setTitle("Sair")
                    .setMessage("Deseja realmente sair?")
                    .setPositiveButton("Sair", (dialog, which) -> {
                        session.clearSession();
                        Intent intent = new Intent(requireContext(),
                                com.maya.rpg.activities.LoginActivity.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK |
                                Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        startActivity(intent);
                    })
                    .setNegativeButton("Cancelar", null)
                    .show();
        });
    }

    private String getGreeting() {
        int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        if (hour < 12) return "Bom dia";
        if (hour < 18) return "Boa tarde";
        return "Boa noite";
    }
}
