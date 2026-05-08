package com.maya.rpg.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import com.maya.rpg.models.Checkin;
import com.maya.rpg.models.Exercise;
import com.maya.rpg.models.Plan;
import com.maya.rpg.models.User;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class DatabaseHelper extends SQLiteOpenHelper {

    private static final String DB_NAME    = "maya_rpg.db";
    private static final int    DB_VERSION = 1;
    public static final String TABLE_USERS     = "users";
    public static final String TABLE_PLANS     = "plans";
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
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "name TEXT NOT NULL," +
                "email TEXT UNIQUE NOT NULL," +
                "password_hash TEXT NOT NULL," +
                "lgpd_accepted INTEGER DEFAULT 0," +
                "lgpd_date TEXT," +
                "created_at TEXT DEFAULT (datetime('now')))");

        db.execSQL("CREATE TABLE " + TABLE_PLANS + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "user_id INTEGER NOT NULL," +
                "title TEXT NOT NULL," +
                "description TEXT," +
                "frequency TEXT," +
                "duration_weeks INTEGER," +
                "is_active INTEGER DEFAULT 1," +
                "created_at TEXT DEFAULT (datetime('now')))");

        db.execSQL("CREATE TABLE " + TABLE_EXERCISES + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "plan_id INTEGER NOT NULL," +
                "name TEXT NOT NULL," +
                "description TEXT," +
                "sets INTEGER DEFAULT 0," +
                "reps INTEGER DEFAULT 0," +
                "duration_seconds INTEGER DEFAULT 0," +
                "rest_seconds INTEGER DEFAULT 0," +
                "video_url TEXT," +
                "image_url TEXT," +
                "order_index INTEGER DEFAULT 0)");

        db.execSQL("CREATE TABLE " + TABLE_CHECKINS + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "user_id INTEGER NOT NULL," +
                "plan_id INTEGER NOT NULL," +
                "exercise_id INTEGER DEFAULT 0," +
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
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_PLANS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_USERS);
        onCreate(db);
    }

    public long createUser(String name, String email, String passwordHash) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("name", name);
        cv.put("email", email);
        cv.put("password_hash", passwordHash);
        return db.insert(TABLE_USERS, null, cv);
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

    public User getUserById(int id) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.query(TABLE_USERS, null,
                "id = ?", new String[]{String.valueOf(id)},
                null, null, null, "1");
        User user = null;
        if (c.moveToFirst()) user = cursorToUser(c);
        c.close();
        return user;
    }

    private User cursorToUser(Cursor c) {
        User u = new User();
        u.setId(c.getInt(c.getColumnIndexOrThrow("id")));
        u.setName(c.getString(c.getColumnIndexOrThrow("name")));
        u.setEmail(c.getString(c.getColumnIndexOrThrow("email")));
        u.setLgpdAccepted(c.getInt(c.getColumnIndexOrThrow("lgpd_accepted")) == 1);
        u.setLgpdDate(c.getString(c.getColumnIndexOrThrow("lgpd_date")));
        return u;
    }

    public void acceptLgpd(int userId) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("lgpd_accepted", 1);
        cv.put("lgpd_date", getCurrentDateTime());
        db.update(TABLE_USERS, cv, "id = ?", new String[]{String.valueOf(userId)});
    }

    public Plan getActivePlan(int userId) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.query(TABLE_PLANS, null,
                "user_id = ? AND is_active = 1",
                new String[]{String.valueOf(userId)},
                null, null, null, "1");
        Plan plan = null;
        if (c.moveToFirst()) {
            plan = new Plan();
            plan.setId(c.getInt(c.getColumnIndexOrThrow("id")));
            plan.setUserId(c.getInt(c.getColumnIndexOrThrow("user_id")));
            plan.setTitle(c.getString(c.getColumnIndexOrThrow("title")));
            plan.setDescription(c.getString(c.getColumnIndexOrThrow("description")));
            plan.setFrequency(c.getString(c.getColumnIndexOrThrow("frequency")));
            plan.setDurationWeeks(c.getInt(c.getColumnIndexOrThrow("duration_weeks")));
            plan.setActive(c.getInt(c.getColumnIndexOrThrow("is_active")) == 1);
        }
        c.close();
        return plan;
    }

    public List<Exercise> getExercisesByPlan(int planId) {
        SQLiteDatabase db = getReadableDatabase();
        List<Exercise> list = new ArrayList<>();
        Cursor c = db.query(TABLE_EXERCISES, null,
                "plan_id = ?", new String[]{String.valueOf(planId)},
                null, null, "order_index ASC");
        while (c.moveToNext()) {
            Exercise ex = new Exercise();
            ex.setId(c.getInt(c.getColumnIndexOrThrow("id")));
            ex.setPlanId(c.getInt(c.getColumnIndexOrThrow("plan_id")));
            ex.setName(c.getString(c.getColumnIndexOrThrow("name")));
            ex.setDescription(c.getString(c.getColumnIndexOrThrow("description")));
            ex.setSets(c.getInt(c.getColumnIndexOrThrow("sets")));
            ex.setReps(c.getInt(c.getColumnIndexOrThrow("reps")));
            ex.setDurationSeconds(c.getInt(c.getColumnIndexOrThrow("duration_seconds")));
            ex.setRestSeconds(c.getInt(c.getColumnIndexOrThrow("rest_seconds")));
            ex.setVideoUrl(c.getString(c.getColumnIndexOrThrow("video_url")));
            ex.setOrderIndex(c.getInt(c.getColumnIndexOrThrow("order_index")));
            list.add(ex);
        }
        c.close();
        return list;
    }

    public long saveCheckin(Checkin checkin) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("user_id",     checkin.getUserId());
        cv.put("plan_id",     checkin.getPlanId());
        cv.put("exercise_id", checkin.getExerciseId());
        cv.put("completed",   checkin.getCompleted());
        cv.put("pain_level",  checkin.getPainLevel());
        cv.put("notes",       checkin.getNotes());
        cv.put("checkin_date", getCurrentDateTime());
        cv.put("synced", 0);
        return db.insert(TABLE_CHECKINS, null, cv);
    }

    public void updateCheckin(int id, int completed, int painLevel, String notes) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("completed",  completed);
        cv.put("pain_level", painLevel);
        cv.put("notes",      notes);
        cv.put("synced", 0);
        db.update(TABLE_CHECKINS, cv, "id = ?", new String[]{String.valueOf(id)});
    }

    public void deleteCheckin(int id) {
        SQLiteDatabase db = getWritableDatabase();
        db.delete(TABLE_CHECKINS, "id = ?", new String[]{String.valueOf(id)});
    }

    public List<Checkin> getCheckinHistory(int userId) {
        SQLiteDatabase db = getReadableDatabase();
        List<Checkin> list = new ArrayList<>();
        String query = "SELECT c.*, e.name as exercise_name " +
                "FROM " + TABLE_CHECKINS + " c " +
                "LEFT JOIN " + TABLE_EXERCISES + " e ON c.exercise_id = e.id " +
                "WHERE c.user_id = ? ORDER BY c.checkin_date DESC LIMIT 50";
        Cursor cursor = db.rawQuery(query, new String[]{String.valueOf(userId)});
        while (cursor.moveToNext()) {
            Checkin ch = new Checkin();
            ch.setId(cursor.getInt(cursor.getColumnIndexOrThrow("id")));
            ch.setUserId(cursor.getInt(cursor.getColumnIndexOrThrow("user_id")));
            ch.setPlanId(cursor.getInt(cursor.getColumnIndexOrThrow("plan_id")));
            ch.setExerciseId(cursor.getInt(cursor.getColumnIndexOrThrow("exercise_id")));
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

    public int getWeeklyProgress(int userId) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery(
                "SELECT COUNT(*) FROM " + TABLE_CHECKINS +
                        " WHERE user_id = ? AND completed = 2 " +
                        "AND checkin_date >= date('now', '-7 days')",
                new String[]{String.valueOf(userId)});
        int count = 0;
        if (c.moveToFirst()) count = c.getInt(0);
        c.close();
        return count;
    }

    public void seedDemoData(int userId) {
        Plan existing = getActivePlan(userId);
        if (existing != null) return;

        SQLiteDatabase db = getWritableDatabase();
        ContentValues planCv = new ContentValues();
        planCv.put("user_id", userId);
        planCv.put("title", "Fortalecimento Joelho");
        planCv.put("description", "Protocolo pós-cirúrgico LCA");
        planCv.put("frequency", "3x por semana");
        planCv.put("duration_weeks", 8);
        planCv.put("is_active", 1);
        long planId = db.insert(TABLE_PLANS, null, planCv);

        String[][] exercises = {
                {"Postura da Montanha","Em pé com pés paralelos, joelhos levemente flexionados.","3","0","60","30","https://www.youtube.com/watch?v=dQw4w9WgXcQ"},
                {"Alongamento da Cadeia Posterior","Deitado, eleve uma perna com joelho estendido.","2","0","45","30","https://www.youtube.com/watch?v=dQw4w9WgXcQ"},
                {"Postura do Esquiador","Tronco inclinado para frente com coluna reta.","3","0","45","30","https://www.youtube.com/watch?v=dQw4w9WgXcQ"},
                {"Abertura do Tórax","Sentado, mãos atrás da cabeça, abra os cotovelos.","3","10","0","30","https://www.youtube.com/watch?v=dQw4w9WgXcQ"},
                {"Fechamento da Cadeia Anterior","Deitado, joelhos no peito abraçados.","2","0","60","30","https://www.youtube.com/watch?v=dQw4w9WgXcQ"},
                {"Autoelongação Sentado","Empurre a cabeça em direção ao teto.","3","0","30","20","https://www.youtube.com/watch?v=dQw4w9WgXcQ"},
                {"Postura da Rã no Chão","Plantas dos pés juntas, joelhos para os lados.","2","0","90","30","https://www.youtube.com/watch?v=dQw4w9WgXcQ"},
                {"Respiração Diafragmática","Inspire expandindo o abdômen, não o peito.","1","15","0","0","https://www.youtube.com/watch?v=dQw4w9WgXcQ"},
                {"Postura do Corredor","Passo à frente, joelho a 90°, tronco ereto.","2","0","45","30","https://www.youtube.com/watch?v=dQw4w9WgXcQ"},
                {"Mobilização Cervical","Incline a cabeça para cada lado, ombros relaxados.","3","8","0","20","https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
        };

        for (int i = 0; i < exercises.length; i++) {
            ContentValues exCv = new ContentValues();
            exCv.put("plan_id",          planId);
            exCv.put("name",             exercises[i][0]);
            exCv.put("description",      exercises[i][1]);
            exCv.put("sets",             Integer.parseInt(exercises[i][2]));
            exCv.put("reps",             Integer.parseInt(exercises[i][3]));
            exCv.put("duration_seconds", Integer.parseInt(exercises[i][4]));
            exCv.put("rest_seconds",     Integer.parseInt(exercises[i][5]));
            exCv.put("video_url",        exercises[i][6]);
            exCv.put("order_index",      i);
            db.insert(TABLE_EXERCISES, null, exCv);
        }
    }

    private String getCurrentDateTime() {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
                .format(new Date());
    }
}