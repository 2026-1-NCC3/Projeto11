
package com.maya.rpg.fragments;

import android.app.AlertDialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.RadioGroup;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.maya.rpg.R;
import com.maya.rpg.adapters.CheckinAdapter;
import com.maya.rpg.database.DatabaseHelper;
import com.maya.rpg.models.Checkin;
import com.maya.rpg.utils.SessionManager;
import java.util.ArrayList;
import java.util.List;

public class HistoryFragment extends Fragment implements CheckinAdapter.OnCheckinActionListener {

    private RecyclerView recyclerView;
    private CheckinAdapter adapter;
    private List<Checkin> checkinList;
    private SessionManager session;
    private DatabaseHelper db;
    private LineChart lineChart;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_history, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        session = new SessionManager(requireContext());
        db      = DatabaseHelper.getInstance(requireContext());
        recyclerView = view.findViewById(R.id.rv_checkins);
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        lineChart = view.findViewById(R.id.line_chart);
        setupChart();
        loadHistory();
    }

    private void loadHistory() {
        checkinList = db.getCheckinHistory(session.getUserId());
        View root = requireView();
        if (checkinList.isEmpty()) {
            root.findViewById(R.id.tv_empty).setVisibility(View.VISIBLE);
            recyclerView.setVisibility(View.GONE);
            lineChart.setVisibility(View.GONE);
        } else {
            root.findViewById(R.id.tv_empty).setVisibility(View.GONE);
            recyclerView.setVisibility(View.VISIBLE);
            lineChart.setVisibility(View.VISIBLE);
            adapter = new CheckinAdapter(checkinList, this);
            recyclerView.setAdapter(adapter);
            updateChart(checkinList);
        }
    }

    private void setupChart() {
        lineChart.getDescription().setEnabled(false);
        lineChart.setTouchEnabled(true);
        lineChart.getXAxis().setPosition(XAxis.XAxisPosition.BOTTOM);
        lineChart.getAxisRight().setEnabled(false);
        lineChart.getAxisLeft().setAxisMinimum(0f);
        lineChart.getAxisLeft().setAxisMaximum(10f);
    }

    private void updateChart(List<Checkin> checkins) {
        List<Entry> entries = new ArrayList<>();
        int start = Math.max(0, checkins.size() - 10);
        for (int i = start; i < checkins.size(); i++) {
            entries.add(new Entry(i - start, checkins.get(i).getPainLevel()));
        }
        LineDataSet dataSet = new LineDataSet(entries, "Nivel de dor");
        dataSet.setColor(0xFF3DC8D8);
        dataSet.setCircleColor(0xFF3DC8D8);
        dataSet.setLineWidth(2f);
        dataSet.setCircleRadius(4f);
        dataSet.setValueTextSize(9f);
        lineChart.setData(new LineData(dataSet));
        lineChart.invalidate();
    }

    @Override
    public void onEditCheckin(Checkin checkin) {
        View dialogView = LayoutInflater.from(requireContext())
                .inflate(R.layout.dialog_edit_checkin, null);
        SeekBar seekPain   = dialogView.findViewById(R.id.seekbar_pain_edit);
        TextView tvPainVal = dialogView.findViewById(R.id.tv_pain_value_edit);
        EditText etNotes   = dialogView.findViewById(R.id.et_notes_edit);
        RadioGroup rgCompl = dialogView.findViewById(R.id.rg_completion_edit);
        seekPain.setProgress(checkin.getPainLevel());
        tvPainVal.setText(String.valueOf(checkin.getPainLevel()));
        etNotes.setText(checkin.getNotes());
        seekPain.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override public void onProgressChanged(SeekBar s, int p, boolean u) { tvPainVal.setText(String.valueOf(p)); }
            @Override public void onStartTrackingTouch(SeekBar s) {}
            @Override public void onStopTrackingTouch(SeekBar s) {}
        });
        switch (checkin.getCompleted()) {
            case Checkin.COMPLETED: rgCompl.check(R.id.rb_complete_edit); break;
            case Checkin.PARTIAL:   rgCompl.check(R.id.rb_partial_edit);  break;
            default:                rgCompl.check(R.id.rb_not_done_edit);
        }
        new AlertDialog.Builder(requireContext())
                .setTitle("Editar registro")
                .setView(dialogView)
                .setPositiveButton("Salvar", (dialog, which) -> {
                    int cId = rgCompl.getCheckedRadioButtonId();
                    int completion = Checkin.COMPLETED;
                    if (cId == R.id.rb_partial_edit)  completion = Checkin.PARTIAL;
                    if (cId == R.id.rb_not_done_edit) completion = Checkin.NOT_DONE;
                    db.updateCheckin(checkin.getId(), completion,
                            seekPain.getProgress(), etNotes.getText().toString().trim());
                    Toast.makeText(requireContext(), "Registro atualizado.", Toast.LENGTH_SHORT).show();
                    loadHistory();
                })
                .setNegativeButton("Cancelar", null)
                .show();
    }

    @Override
    public void onDeleteCheckin(Checkin checkin) {
        new AlertDialog.Builder(requireContext())
                .setTitle("Excluir registro")
                .setMessage("Tem certeza que deseja excluir este registro?")
                .setPositiveButton("Excluir", (dialog, which) -> {
                    db.deleteCheckin(checkin.getId());
                    Toast.makeText(requireContext(), "Registro excluido.", Toast.LENGTH_SHORT).show();
                    loadHistory();
                })
                .setNegativeButton("Cancelar", null)
                .show();
    }
}
