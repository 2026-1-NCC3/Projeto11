package com.maya.rpg.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import com.maya.rpg.models.Checkin;
import com.maya.rpg.models.Exercise;
import com.maya.rpg.models.User;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/**
 * Banco de dados SQLite local — cache offline dos dados do backend.
 * Quando o app está sem internet, usa dados locais de demonstração.
 *
 * v2: IDs agora são TEXT (para compatibilidade com UUIDs do backend)
 */
public class DatabaseHelper extends SQLiteOpenHelper {

    private static final String DB_NAME    = "maya_rpg.db";
    private static final int    DB_VERSION = 2;  // bump para forçar migration
    public static final String TABLE_USERS     = "users";
    public static final String TABLE_EXERCISES = "exercises";
    public static final String TABLE_CHECKINS  = "checkins";

    private static DatabaseHelper instance;

    public static synchronized DatabaseHelper getInstance(Context context) {
        if (instance == null) {
            instance = new DatabaseHelper(context.getApplicationContext());
        }
        return instance;
    }

    private DatabaseHelper(Context context) {
        super(context, DB_NAME, null, DB_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE " + TABLE_USERS + " (" +
                "id TEXT PRIMARY KEY," +
                "name TEXT NOT NULL," +
                "email TEXT UNIQUE NOT NULL," +
                "password_hash TEXT NOT NULL," +
                "role TEXT DEFAULT 'paciente'," +
                "paciente_id TEXT," +
                "lgpd_accepted INTEGER DEFAULT 0," +
                "lgpd_date TEXT," +
                "created_at TEXT DEFAULT (datetime('now')))");

        db.execSQL("CREATE TABLE " + TABLE_EXERCISES + " (" +
                "id TEXT PRIMARY KEY," +
                "exercicio_id TEXT," +
                "name TEXT NOT NULL," +
                "description TEXT," +
                "instrucoes TEXT," +
                "musculo_alvo TEXT," +
                "tipo TEXT DEFAULT 'outro'," +
                "dificuldade TEXT DEFAULT 'moderado'," +
                "sets INTEGER DEFAULT 0," +
                "reps INTEGER DEFAULT 0," +
                "duration_seconds INTEGER DEFAULT 0," +
                "rest_seconds INTEGER DEFAULT 0," +
                "frequencia TEXT," +
                "observacoes TEXT," +
                "video_url TEXT," +
                "image_url TEXT," +
                "order_index INTEGER DEFAULT 0," +
                "user_id TEXT)");

        db.execSQL("CREATE TABLE " + TABLE_CHECKINS + " (" +
                "id TEXT PRIMARY KEY," +
                "paciente_id TEXT NOT NULL," +
                "prescricao_id TEXT," +
                "exercise_name TEXT," +
                "completed INTEGER DEFAULT 0," +
                "pain_level INTEGER DEFAULT 0," +
                "notes TEXT," +
                "checkin_date TEXT DEFAULT (datetime('now'))," +
                "synced INTEGER DEFAULT 0)");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_CHECKINS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_EXERCISES);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_USERS);
        onCreate(db);
    }

    // ── Users ───────────────────────────────────────────────────

    public long createUser(String id, String name, String email, String passwordHash,
                           String role, String pacienteId) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("id", id);
        cv.put("name", name);
        cv.put("email", email);
        cv.put("password_hash", passwordHash);
        cv.put("role", role != null ? role : "paciente");
        cv.put("paciente_id", pacienteId);
        return db.insertWithOnConflict(TABLE_USERS, null, cv,
                SQLiteDatabase.CONFLICT_REPLACE);
    }

    /** Overload simplificado para cadastro local (modo demo) */
    public long createUser(String name, String email, String passwordHash) {
        String localId = "local_" + System.currentTimeMillis();
        return createUser(localId, name, email, passwordHash, "paciente", null);
    }

    public User getUserByEmail(String email) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.query(TABLE_USERS, null,
                "email = ?", new String[]{email.toLowerCase()},
                null, null, null, "1");
        User user = null;
        if (c.moveToFirst()) user = cursorToUser(c);
        c.close();
        return user;
    }

    public User getUserById(String id) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.query(TABLE_USERS, null,
                "id = ?", new String[]{id},
                null, null, null, "1");
        User user = null;
        if (c.moveToFirst()) user = cursorToUser(c);
        c.close();
        return user;
    }

    private User cursorToUser(Cursor c) {
        User u = new User();
        u.setId(c.getString(c.getColumnIndexOrThrow("id")));
        u.setName(c.getString(c.getColumnIndexOrThrow("name")));
        u.setEmail(c.getString(c.getColumnIndexOrThrow("email")));
        u.setRole(c.getString(c.getColumnIndexOrThrow("role")));
        int pacIdx = c.getColumnIndex("paciente_id");
        if (pacIdx >= 0) u.setPacienteId(c.getString(pacIdx));
        u.setLgpdAccepted(c.getInt(c.getColumnIndexOrThrow("lgpd_accepted")) == 1);
        int lgpdIdx = c.getColumnIndex("lgpd_date");
        if (lgpdIdx >= 0) u.setLgpdDate(c.getString(lgpdIdx));
        return u;
    }

    public void acceptLgpd(String userId) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("lgpd_accepted", 1);
        cv.put("lgpd_date", getCurrentDateTime());
        db.update(TABLE_USERS, cv, "id = ?", new String[]{userId});
    }

    // ── Exercises (cache local de prescrições) ──────────────────

    public List<Exercise> getExercisesByUser(String userId) {
        SQLiteDatabase db = getReadableDatabase();
        List<Exercise> list = new ArrayList<>();
        Cursor c = db.query(TABLE_EXERCISES, null,
                "user_id = ?", new String[]{userId},
                null, null, "order_index ASC");
        while (c.moveToNext()) {
            Exercise ex = cursorToExercise(c);
            list.add(ex);
        }
        c.close();
        return list;
    }

    private Exercise cursorToExercise(Cursor c) {
        Exercise ex = new Exercise();
        ex.setId(c.getString(c.getColumnIndexOrThrow("id")));
        int exIdIdx = c.getColumnIndex("exercicio_id");
        if (exIdIdx >= 0) ex.setExercicioId(c.getString(exIdIdx));
        ex.setName(c.getString(c.getColumnIndexOrThrow("name")));
        ex.setDescription(c.getString(c.getColumnIndexOrThrow("description")));
        int instrIdx = c.getColumnIndex("instrucoes");
        if (instrIdx >= 0) ex.setInstrucoes(c.getString(instrIdx));
        int muscIdx = c.getColumnIndex("musculo_alvo");
        if (muscIdx >= 0) ex.setMusculoAlvo(c.getString(muscIdx));
        int tipoIdx = c.getColumnIndex("tipo");
        if (tipoIdx >= 0) ex.setTipo(c.getString(tipoIdx));
        int difIdx = c.getColumnIndex("dificuldade");
        if (difIdx >= 0) ex.setDificuldade(c.getString(difIdx));
        ex.setSets(c.getInt(c.getColumnIndexOrThrow("sets")));
        ex.setReps(c.getInt(c.getColumnIndexOrThrow("reps")));
        ex.setDurationSeconds(c.getInt(c.getColumnIndexOrThrow("duration_seconds")));
        ex.setRestSeconds(c.getInt(c.getColumnIndexOrThrow("rest_seconds")));
        int freqIdx = c.getColumnIndex("frequencia");
        if (freqIdx >= 0) ex.setFrequencia(c.getString(freqIdx));
        int obsIdx = c.getColumnIndex("observacoes");
        if (obsIdx >= 0) ex.setObservacoes(c.getString(obsIdx));
        ex.setVideoUrl(c.getString(c.getColumnIndexOrThrow("video_url")));
        ex.setOrderIndex(c.getInt(c.getColumnIndexOrThrow("order_index")));
        return ex;
    }

    public void saveExercisesForUser(String userId, List<Exercise> exercises) {
        SQLiteDatabase db = getWritableDatabase();
        // Limpa cache anterior
        db.delete(TABLE_EXERCISES, "user_id = ?", new String[]{userId});
        for (Exercise ex : exercises) {
            ContentValues cv = new ContentValues();
            cv.put("id", ex.getId());
            cv.put("exercicio_id", ex.getExercicioId());
            cv.put("name", ex.getName());
            cv.put("description", ex.getDescription());
            cv.put("instrucoes", ex.getInstrucoes());
            cv.put("musculo_alvo", ex.getMusculoAlvo());
            cv.put("tipo", ex.getTipo());
            cv.put("dificuldade", ex.getDificuldade());
            cv.put("sets", ex.getSets());
            cv.put("reps", ex.getReps());
            cv.put("duration_seconds", ex.getDurationSeconds());
            cv.put("rest_seconds", ex.getRestSeconds());
            cv.put("frequencia", ex.getFrequencia());
            cv.put("observacoes", ex.getObservacoes());
            cv.put("video_url", ex.getVideoUrl());
            cv.put("order_index", ex.getOrderIndex());
            cv.put("user_id", userId);
            db.insertWithOnConflict(TABLE_EXERCISES, null, cv,
                    SQLiteDatabase.CONFLICT_REPLACE);
        }
    }

    // ── Checkins ────────────────────────────────────────────────

    public long saveCheckin(Checkin checkin) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        String id = checkin.getId() != null ? checkin.getId()
                : "local_" + System.currentTimeMillis();
        cv.put("id", id);
        cv.put("paciente_id",   checkin.getPacienteId());
        cv.put("prescricao_id", checkin.getPrescricaoId());
        cv.put("exercise_name", checkin.getExerciseName());
        cv.put("completed",     checkin.getCompleted());
        cv.put("pain_level",    checkin.getPainLevel());
        cv.put("notes",         checkin.getNotes());
        cv.put("checkin_date",  getCurrentDateTime());
        cv.put("synced",        checkin.isSynced() ? 1 : 0);
        return db.insert(TABLE_CHECKINS, null, cv);
    }

    public void updateCheckin(String id, int completed, int painLevel, String notes) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("completed",  completed);
        cv.put("pain_level", painLevel);
        cv.put("notes",      notes);
        cv.put("synced", 0);
        db.update(TABLE_CHECKINS, cv, "id = ?", new String[]{id});
    }

    public void deleteCheckin(String id) {
        SQLiteDatabase db = getWritableDatabase();
        db.delete(TABLE_CHECKINS, "id = ?", new String[]{id});
    }

    public List<Checkin> getCheckinHistory(String pacienteId) {
        SQLiteDatabase db = getReadableDatabase();
        List<Checkin> list = new ArrayList<>();
        String query = "SELECT * FROM " + TABLE_CHECKINS +
                " WHERE paciente_id = ? ORDER BY checkin_date DESC LIMIT 50";
        Cursor cursor = db.rawQuery(query, new String[]{pacienteId});
        while (cursor.moveToNext()) {
            Checkin ch = new Checkin();
            ch.setId(cursor.getString(cursor.getColumnIndexOrThrow("id")));
            ch.setPacienteId(cursor.getString(cursor.getColumnIndexOrThrow("paciente_id")));
            int presIdx = cursor.getColumnIndex("prescricao_id");
            if (presIdx >= 0) ch.setPrescricaoId(cursor.getString(presIdx));
            ch.setCompleted(cursor.getInt(cursor.getColumnIndexOrThrow("completed")));
            ch.setPainLevel(cursor.getInt(cursor.getColumnIndexOrThrow("pain_level")));
            ch.setNotes(cursor.getString(cursor.getColumnIndexOrThrow("notes")));
            ch.setCheckinDate(cursor.getString(cursor.getColumnIndexOrThrow("checkin_date")));
            ch.setSynced(cursor.getInt(cursor.getColumnIndexOrThrow("synced")) == 1);
            int exNameIdx = cursor.getColumnIndex("exercise_name");
            if (exNameIdx >= 0) ch.setExerciseName(cursor.getString(exNameIdx));
            list.add(ch);
        }
        cursor.close();
        return list;
    }

    public int getWeeklyProgress(String pacienteId) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery(
                "SELECT COUNT(*) FROM " + TABLE_CHECKINS +
                        " WHERE paciente_id = ? AND completed = 2 " +
                        "AND checkin_date >= date('now', '-7 days')",
                new String[]{pacienteId});
        int count = 0;
        if (c.moveToFirst()) count = c.getInt(0);
        c.close();
        return count;
    }

    /** Dados de demonstração para modo offline */
    public void seedDemoData(String userId) {
        List<Exercise> existing = getExercisesByUser(userId);
        if (!existing.isEmpty()) return;

        String[][] exercises = {
                {"Postura da Montanha","Em pé com pés paralelos, joelhos levemente flexionados.","3","0","60","30","alongamento"},
                {"Alongamento da Cadeia Posterior","Deitado, eleve uma perna com joelho estendido.","2","0","45","30","alongamento"},
                {"Postura do Esquiador","Tronco inclinado para frente com coluna reta.","3","0","45","30","postural"},
                {"Abertura do Tórax","Sentado, mãos atrás da cabeça, abra os cotovelos.","3","10","0","30","mobilidade"},
                {"Fechamento da Cadeia Anterior","Deitado, joelhos no peito abraçados.","2","0","60","30","alongamento"},
                {"Autoelongação Sentado","Empurre a cabeça em direção ao teto.","3","0","30","20","postural"},
                {"Postura da Rã no Chão","Plantas dos pés juntas, joelhos para os lados.","2","0","90","30","postural"},
                {"Respiração Diafragmática","Inspire expandindo o abdômen, não o peito.","1","15","0","0","respiratorio"},
                {"Postura do Corredor","Passo à frente, joelho a 90°, tronco ereto.","2","0","45","30","fortalecimento"},
                {"Mobilização Cervical","Incline a cabeça para cada lado, ombros relaxados.","3","8","0","20","mobilidade"}
        };

        List<Exercise> demoExercises = new ArrayList<>();
        for (int i = 0; i < exercises.length; i++) {
            Exercise ex = new Exercise();
            ex.setId("demo_" + (i + 1));
            ex.setName(exercises[i][0]);
            ex.setDescription(exercises[i][1]);
            ex.setSets(Integer.parseInt(exercises[i][2]));
            ex.setReps(Integer.parseInt(exercises[i][3]));
            ex.setDurationSeconds(Integer.parseInt(exercises[i][4]));
            ex.setRestSeconds(Integer.parseInt(exercises[i][5]));
            ex.setTipo(exercises[i][6]);
            ex.setDificuldade("moderado");
            ex.setOrderIndex(i);
            demoExercises.add(ex);
        }
        saveExercisesForUser(userId, demoExercises);
    }

    private String getCurrentDateTime() {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
                .format(new Date());
    }
}