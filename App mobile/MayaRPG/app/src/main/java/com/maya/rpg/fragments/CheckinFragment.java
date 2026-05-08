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
import com.maya.rpg.models.Plan;
import com.maya.rpg.network.ApiClient;
import com.maya.rpg.utils.SessionManager;

public class CheckinFragment extends Fragment {

    private static final String[] EXERCISE_NAMES = {
            "Sessão completa (todos os exercícios)",
            "01. Postura da Montanha",
            "02. Alongamento da Cadeia Posterior",
            "03. Postura do Esquiador",
            "04. Abertura do Tórax",
            "05. Fechamento da Cadeia Anterior",
            "06. Autoelongação Sentado",
            "07. Postura da Rã no Chão",
            "08. Respiração Diafragmática",
            "09. Postura do Corredor",
            "10. Mobilização Cervical"
    };

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

        SessionManager session = new SessionManager(requireContext());
        DatabaseHelper db = DatabaseHelper.getInstance(requireContext());

        Spinner spinnerExercise = view.findViewById(R.id.spinner_exercise);
        ArrayAdapter<String> spinnerAdapter = new ArrayAdapter<>(
                requireContext(),
                android.R.layout.simple_spinner_dropdown_item,
                EXERCISE_NAMES);
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

            Plan plan = db.getActivePlan(session.getUserId());
            if (plan == null) {
                Toast.makeText(requireContext(), "Nenhum plano ativo.", Toast.LENGTH_SHORT).show();
                return;
            }

            Checkin checkin = new Checkin(session.getUserId(), plan.getId(),
                    exIndex, completion, painLevel, notes);
            db.saveCheckin(checkin);

            if (!session.isDemoMode()) {
                ApiClient.postCheckin(plan.getId(), exIndex, completion,
                        painLevel, notes, session.getToken(),
                        new ApiClient.ApiCallback<Boolean>() {
                            @Override public void onSuccess(Boolean result) {}
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
