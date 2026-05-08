
package com.maya.rpg.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.maya.rpg.R;
import com.maya.rpg.models.Exercise;
import java.util.List;

public class ExerciseAdapter extends RecyclerView.Adapter<ExerciseAdapter.ViewHolder> {

    // Interface de callback para clique num exercício
    public interface OnExerciseClickListener {
        void onExerciseClick(Exercise exercise);
    }

    private final List<Exercise> exercises;
    private final OnExerciseClickListener listener;

    public ExerciseAdapter(List<Exercise> exercises, OnExerciseClickListener listener) {
        this.exercises = exercises;
        this.listener  = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_exercise, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Exercise ex = exercises.get(position);

        // Número do exercício (01, 02, ...)
        holder.tvNumber.setText(String.format("%02d", position + 1));
        holder.tvName.setText(ex.getName());
        holder.tvDuration.setText(ex.getFormattedDuration());

        // Descanso entre séries
        if (ex.getRestSeconds() > 0) {
            holder.tvRest.setVisibility(View.VISIBLE);
            holder.tvRest.setText("Descanso: " + ex.getRestSeconds() + "s");
        } else {
            holder.tvRest.setVisibility(View.GONE);
        }

        // Clique no card abre ExerciseDetailActivity
        holder.itemView.setOnClickListener(v -> listener.onExerciseClick(ex));
    }

    @Override
    public int getItemCount() { return exercises.size(); }

    // ViewHolder: referências às views de cada item da lista
    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvNumber, tvName, tvDuration, tvRest;

        ViewHolder(View itemView) {
            super(itemView);
            tvNumber   = itemView.findViewById(R.id.tv_exercise_number);
            tvName     = itemView.findViewById(R.id.tv_exercise_name);
            tvDuration = itemView.findViewById(R.id.tv_exercise_duration);
            tvRest     = itemView.findViewById(R.id.tv_exercise_rest);
        }
    }
}

