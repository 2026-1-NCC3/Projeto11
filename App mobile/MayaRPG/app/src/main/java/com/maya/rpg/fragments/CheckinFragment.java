package com.maya.rpg.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioGroup;
import android.widget.SeekBar;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.maya.rpg.R;
import com.maya.rpg.database.DatabaseHelper;
import com.maya.rpg.models.Checkin;
import com.maya.rpg.models.Exercise;
import com.maya.rpg.network.ApiClient;
import com.maya.rpg.utils.SessionManager;
import java.util.ArrayList;
import java.util.List;

/**
 * Fragment de check-in diário.
 * Carrega exercícios dinamicamente das prescrições do paciente
 * em vez de usar uma lista hardcoded.
 */
public class CheckinFragment extends Fragment {

    private List<Exercise> exerciseList = new ArrayList<>();
    private String[] exerciseNames;
    private SessionManager session;
    private DatabaseHelper db;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_checkin, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        session = new SessionManager(requireContext());
        db = DatabaseHelper.getInstance(requireContext());

        // Carrega exercícios para popular o spinner
        String pacienteId = session.getPacienteId();
        if (pacienteId == null || pacienteId.isEmpty()) {
            pacienteId = session.getUserId();
        }

        exerciseList = db.getExercisesByUser(pacienteId);
        setupUI(view);
    }

    private void setupUI(View view) {
        // Prepara nomes dos exercícios para o spinner
        List<String> names = new ArrayList<>();
        names.add("Sessão completa (todos os exercícios)");
        for (int i = 0; i < exerciseList.size(); i++) {
            names.add(String.format("%02d. %s", i + 1, exerciseList.get(i).getName()));
        }
        exerciseNames = names.toArray(new String[0]);

        Spinner spinnerExercise = view.findViewById(R.id.spinner_exercise);
        ArrayAdapter<String> spinnerAdapter = new ArrayAdapter<>(
                requireContext(),
                android.R.layout.simple_spinner_dropdown_item,
                exerciseNames);
        spinnerExercise.setAdapter(spinnerAdapter);

        SeekBar seekBarPain = view.findViewById(R.id.seekbar_pain);
        TextView tvPainValue = view.findViewById(R.id.tv_pain_value);
        seekBarPain.setMax(10);
        seekBarPain.setProgress(0);
        tvPainValue.setText("0 — Sem dor");

        final String[] labels = {"Sem dor","Mínima","Leve","Leve-moderada",
                "Moderada","Moderada","Mod-intensa","Intensa","Muito intensa","Severa","Máxima"};

        seekBarPain.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar s, int progress, boolean fromUser) {
                tvPainValue.setText(progress + " — " + labels[progress]);
            }
            @Override public void onStartTrackingTouch(SeekBar s) {}
            @Override public void onStopTrackingTouch(SeekBar s) {}
        });

        RadioGroup rgCompletion = view.findViewById(R.id.rg_completion);
        rgCompletion.check(R.id.rb_complete);

        EditText etNotes = view.findViewById(R.id.et_notes);

        Button btnSave = view.findViewById(R.id.btn_save_checkin);
        btnSave.setOnClickListener(v -> {
            int checkedId = rgCompletion.getCheckedRadioButtonId();
            int completion = Checkin.COMPLETED;
            if (checkedId == R.id.rb_partial) completion = Checkin.PARTIAL;
            if (checkedId == R.id.rb_not_done) completion = Checkin.NOT_DONE;

            int painLevel = seekBarPain.getProgress();
            String notes = etNotes.getText().toString().trim();
            int exIndex = spinnerExercise.getSelectedItemPosition();

            String pacienteId = session.getPacienteId();
            if (pacienteId == null || pacienteId.isEmpty()) {
                pacienteId = session.getUserId();
            }

            // Determinar prescricaoId do exercício selecionado
            String prescricaoId = null;
            String exerciseName = "Sessão completa";
            if (exIndex > 0 && exIndex <= exerciseList.size()) {
                Exercise selectedEx = exerciseList.get(exIndex - 1);
                prescricaoId = selectedEx.getId(); // ID da prescrição
                exerciseName = selectedEx.getName();
            } else if (!exerciseList.isEmpty()) {
                // "Sessão completa" → usa primeira prescrição como referência
                prescricaoId = exerciseList.get(0).getId();
            }

            // Salvar localmente
            Checkin checkin = new Checkin(pacienteId, prescricaoId,
                    completion, painLevel, notes);
            checkin.setExerciseName(exerciseName);
            db.saveCheckin(checkin);

            // Sincronizar com API se online
            if (!session.isDemoMode() && prescricaoId != null) {
                boolean executado = (completion == Checkin.COMPLETED);
                ApiClient.postCheckin(pacienteId, prescricaoId, executado,
                        painLevel, notes, session.getToken(),
                        new ApiClient.ApiCallback<Boolean>() {
                            @Override public void onSuccess(Boolean result) {
                                if (result) {
                                    db.markCheckinAsSynced(checkin.getId());
                                }
                            }
                            @Override public void onError(String error) {}
                        });
            }

            Toast.makeText(requireContext(), "Check-in salvo!", Toast.LENGTH_SHORT).show();
            seekBarPain.setProgress(0);
            etNotes.setText("");
            rgCompletion.check(R.id.rb_complete);
            spinnerExercise.setSelection(0);
        });
    }
}
