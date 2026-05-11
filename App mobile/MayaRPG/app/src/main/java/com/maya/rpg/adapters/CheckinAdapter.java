
package com.maya.rpg.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.maya.rpg.R;
import com.maya.rpg.models.Checkin;
import java.util.List;

public class CheckinAdapter extends RecyclerView.Adapter<CheckinAdapter.ViewHolder> {

    // Interface para callbacks de editar e excluir
    public interface OnCheckinActionListener {
        void onEditCheckin(Checkin checkin);
        void onDeleteCheckin(Checkin checkin);
    }

    private final List<Checkin> checkins;
    private final OnCheckinActionListener listener;

    public CheckinAdapter(List<Checkin> checkins, OnCheckinActionListener listener) {
        this.checkins = checkins;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_checkin, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Checkin ch = checkins.get(position);

        // Data do check-in
        holder.tvDate.setText(ch.getCheckinDate() != null
                ? ch.getCheckinDate().substring(0, 16) : "");

        // Nome do exercício ou "Sessão completa"
        String title = ch.getExerciseName() != null && !ch.getExerciseName().isEmpty()
                ? ch.getExerciseName() : "Sessão completa";
        holder.tvTitle.setText(title);

        // Status de conclusão
        holder.tvStatus.setText(ch.getCompletedLabel());

        // Nível de dor
        holder.tvPain.setText("Dor: " + ch.getPainLevel() + "/10");

        // Observações (oculta se vazio)
        if (ch.getNotes() != null && !ch.getNotes().isEmpty()) {
            holder.tvNotes.setVisibility(View.VISIBLE);
            holder.tvNotes.setText("\"" + ch.getNotes() + "\"");
        } else {
            holder.tvNotes.setVisibility(View.GONE);
        }

        // Botão editar
        holder.btnEdit.setOnClickListener(v -> listener.onEditCheckin(ch));

        // Botão excluir
        holder.btnDelete.setOnClickListener(v -> listener.onDeleteCheckin(ch));
    }

    @Override
    public int getItemCount() { return checkins.size(); }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvDate, tvTitle, tvStatus, tvPain, tvNotes;
        Button btnEdit, btnDelete;

        ViewHolder(View itemView) {
            super(itemView);
            tvDate   = itemView.findViewById(R.id.tv_checkin_date);
            tvTitle  = itemView.findViewById(R.id.tv_checkin_title);
            tvStatus = itemView.findViewById(R.id.tv_checkin_status);
            tvPain   = itemView.findViewById(R.id.tv_checkin_pain);
            tvNotes  = itemView.findViewById(R.id.tv_checkin_notes);
            btnEdit  = itemView.findViewById(R.id.btn_edit_checkin);
            btnDelete = itemView.findViewById(R.id.btn_delete_checkin);
        }
    }
}
