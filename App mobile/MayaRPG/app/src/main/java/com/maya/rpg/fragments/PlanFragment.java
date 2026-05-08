package com.maya.rpg.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
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
import com.maya.rpg.models.Plan;
import com.maya.rpg.network.ApiClient;
import com.maya.rpg.utils.SessionManager;
import java.util.List;

public class PlanFragment extends Fragment implements ExerciseAdapter.OnExerciseClickListener {

    private RecyclerView recyclerView;
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
        loadExercises();
    }

    private void loadExercises() {
        Plan plan = db.getActivePlan(session.getUserId());
        if (plan == null) return;
        if (!session.isDemoMode()) {
            ApiClient.getExercises(plan.getId(), session.getToken(),
                    new ApiClient.ApiCallback<List<Exercise>>() {
                        @Override
                        public void onSuccess(List<Exercise> exercises) {
                            requireActivity().runOnUiThread(() -> showExercises(exercises));
                        }
                        @Override
                        public void onError(String error) {
                            loadLocalExercises(plan.getId());
                        }
                    });
        } else {
            loadLocalExercises(plan.getId());
        }
    }

    private void loadLocalExercises(int planId) {
        List<Exercise> exercises = db.getExercisesByPlan(planId);
        requireActivity().runOnUiThread(() -> showExercises(exercises));
    }

    private void showExercises(List<Exercise> exercises) {
        ExerciseAdapter adapter = new ExerciseAdapter(exercises, this);
        recyclerView.setAdapter(adapter);
    }

    @Override
    public void onExerciseClick(Exercise exercise) {
        Intent intent = new Intent(requireContext(), ExerciseDetailActivity.class);
        intent.putExtra(ExerciseDetailActivity.EXTRA_EXERCISE_NAME, exercise.getName());
        intent.putExtra(ExerciseDetailActivity.EXTRA_EXERCISE_DESCRIPTION, exercise.getDescription());
        intent.putExtra(ExerciseDetailActivity.EXTRA_EXERCISE_DURATION, exercise.getFormattedDuration());
        intent.putExtra(ExerciseDetailActivity.EXTRA_EXERCISE_REST, String.valueOf(exercise.getRestSeconds()));
        intent.putExtra(ExerciseDetailActivity.EXTRA_EXERCISE_VIDEO_URL, exercise.getVideoUrl());
        startActivity(intent);
    }
}
