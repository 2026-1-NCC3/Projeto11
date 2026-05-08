package com.maya.rpg.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.maya.rpg.R;
import com.maya.rpg.activities.ExerciseDetailActivity;
import com.maya.rpg.adapters.ExerciseAdapter;
import com.maya.rpg.database.DatabaseHelper;
import com.maya.rpg.models.Exercise;
import com.maya.rpg.network.ApiClient;
import com.maya.rpg.utils.SessionManager;
import java.util.List;

/**
 * Fragment que exibe a lista de exercícios prescritos ao paciente.
 * Busca da API (GET /prescricoes/paciente/:pacienteId) quando online,
 * e do SQLite local quando offline.
 */
public class PlanFragment extends Fragment implements ExerciseAdapter.OnExerciseClickListener {

    private RecyclerView recyclerView;
    private TextView tvEmpty;
    private SessionManager session;
    private DatabaseHelper db;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_plan, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        session = new SessionManager(requireContext());
        db = DatabaseHelper.getInstance(requireContext());
        recyclerView = view.findViewById(R.id.rv_exercises);
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        // Tenta encontrar um TextView de "lista vazia" no layout (pode não existir)
        tvEmpty = view.findViewById(R.id.tv_empty_plan);

        loadExercises();
    }

    private void loadExercises() {
        String pacienteId = session.getPacienteId();
        if (pacienteId == null || pacienteId.isEmpty()) {
            pacienteId = session.getUserId();
        }

        if (!session.isDemoMode() && pacienteId != null && !pacienteId.isEmpty()) {
            final String pid = pacienteId;
            ApiClient.getExercises(pacienteId, session.getToken(),
                    new ApiClient.ApiCallback<List<Exercise>>() {
                        @Override
                        public void onSuccess(List<Exercise> exercises) {
                            // Salva no cache local
                            db.saveExercisesForUser(pid, exercises);
                            if (isAdded()) {
                                requireActivity().runOnUiThread(() -> showExercises(exercises));
                            }
                        }
                        @Override
                        public void onError(String error) {
                            loadLocalExercises(pid);
                        }
                    });
        } else {
            loadLocalExercises(pacienteId != null ? pacienteId : session.getUserId());
        }
    }

    private void loadLocalExercises(String userId) {
        List<Exercise> exercises = db.getExercisesByUser(userId);
        if (isAdded()) {
            requireActivity().runOnUiThread(() -> showExercises(exercises));
        }
    }

    private void showExercises(List<Exercise> exercises) {
        if (exercises.isEmpty()) {
            recyclerView.setVisibility(View.GONE);
            if (tvEmpty != null) tvEmpty.setVisibility(View.VISIBLE);
        } else {
            recyclerView.setVisibility(View.VISIBLE);
            if (tvEmpty != null) tvEmpty.setVisibility(View.GONE);
            ExerciseAdapter adapter = new ExerciseAdapter(exercises, this);
            recyclerView.setAdapter(adapter);
        }
    }

    @Override
    public void onExerciseClick(Exercise exercise) {
        Intent intent = new Intent(requireContext(), ExerciseDetailActivity.class);
        intent.putExtra(ExerciseDetailActivity.EXTRA_EXERCISE_NAME, exercise.getName());
        intent.putExtra(ExerciseDetailActivity.EXTRA_EXERCISE_DESCRIPTION,
                exercise.getDescription());
        intent.putExtra(ExerciseDetailActivity.EXTRA_EXERCISE_DURATION,
                exercise.getFormattedDuration());
        intent.putExtra(ExerciseDetailActivity.EXTRA_EXERCISE_REST,
                String.valueOf(exercise.getRestSeconds()));
        intent.putExtra(ExerciseDetailActivity.EXTRA_EXERCISE_VIDEO_URL,
                exercise.getVideoUrl());
        startActivity(intent);
    }
}
