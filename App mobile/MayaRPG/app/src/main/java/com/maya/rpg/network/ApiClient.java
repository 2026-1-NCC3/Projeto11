package com.maya.rpg.network;

import android.util.Log;
import com.google.gson.JsonObject;
import com.maya.rpg.models.Checkin;
import com.maya.rpg.models.Exercise;
import com.maya.rpg.models.User;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Cliente HTTP para comunicação com o backend Maya RPG.
 *
 * Backend (Render):
 *   - URL: https://maya-rpg-api.onrender.com
 *   - Rotas SEM prefixo /api: /auth/login, /prescricoes/paciente/:id, etc.
 *   - IDs são UUID (String)
 *   - Campos em português: nome, senha, executado, nivel_dor, etc.
 *
 * NOTA: Render free tier tem cold start (~15s na primeira requisição).
 *       Timeouts configurados com margem para isso.
 */
public class ApiClient {

    // URL de produção no Render
    public static final String API_BASE_URL = "https://maya-rpg-api.onrender.com";
    private static final String TAG = "ApiClient";
    private static final MediaType JSON_TYPE = MediaType.get("application/json; charset=utf-8");

    private static final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)   // Render cold start pode levar até 50s
            .readTimeout(60, TimeUnit.SECONDS)       // Margem longa para requests durante cold start
            .writeTimeout(30, TimeUnit.SECONDS)
            .build();

    // ── Callback genérico ───────────────────────────────────────
    public interface ApiCallback<T> {
        void onSuccess(T result);
        void onError(String errorMessage);
    }

    // ── Health check ────────────────────────────────────────────
    public static boolean isApiAvailable() {
        try {
            Request request = new Request.Builder()
                    .url(API_BASE_URL + "/health")
                    .get().build();
            Response response = client.newCall(request).execute();
            boolean ok = response.isSuccessful();
            response.close();
            return ok;
        } catch (IOException e) {
            Log.d(TAG, "API indisponível: " + e.getMessage());
            return false;
        }
    }

    // ── Login ───────────────────────────────────────────────────
    // POST /auth/login
    // Body: { email, senha }
    // Response: { access_token, user: { id, nome, email, role, paciente_id } }
    public static void login(String email, String password, ApiCallback<User> callback) {
        new Thread(() -> {
            try {
                JsonObject body = new JsonObject();
                body.addProperty("email", email);
                body.addProperty("senha", password);  // backend espera "senha"

                Request request = new Request.Builder()
                        .url(API_BASE_URL + "/auth/login")
                        .post(RequestBody.create(body.toString(), JSON_TYPE))
                        .build();

                Response response = client.newCall(request).execute();
                String responseBody = response.body().string();
                Log.d(TAG, "Login response: " + responseBody);

                if (response.isSuccessful()) {
                    JSONObject json = new JSONObject(responseBody);
                    String accessToken = json.optString("access_token");
                    JSONObject userJson = json.optJSONObject("user");

                    User user = new User();
                    user.setId(userJson.optString("id"));
                    user.setName(userJson.optString("nome"));
                    user.setEmail(userJson.optString("email"));
                    user.setRole(userJson.optString("role"));
                    user.setToken(accessToken);
                    // paciente_id pode ser null se não for paciente
                    String pacienteId = userJson.optString("paciente_id", null);
                    if (pacienteId != null && !pacienteId.equals("null")) {
                        user.setPacienteId(pacienteId);
                    }

                    callback.onSuccess(user);
                } else {
                    JSONObject errorJson = new JSONObject(responseBody);
                    String errorMsg = errorJson.optString("error", "E-mail ou senha incorretos.");
                    callback.onError(errorMsg);
                }
            } catch (Exception e) {
                Log.e(TAG, "Erro no login", e);
                callback.onError("Sem conexão com o servidor.");
            }
        }).start();
    }

    // ── Registro ────────────────────────────────────────────────
    // POST /auth/register
    // Body: { nome, email, senha, telefone? }
    // Response: { access_token, user: { id, nome, email, role, paciente_id } }
    public static void register(String name, String email, String password,
                                ApiCallback<User> callback) {
        new Thread(() -> {
            try {
                JsonObject body = new JsonObject();
                body.addProperty("nome", name);     // backend espera "nome"
                body.addProperty("email", email);
                body.addProperty("senha", password); // backend espera "senha"

                Request request = new Request.Builder()
                        .url(API_BASE_URL + "/auth/register")
                        .post(RequestBody.create(body.toString(), JSON_TYPE))
                        .build();

                Response response = client.newCall(request).execute();
                String responseBody = response.body().string();
                Log.d(TAG, "Register response: " + responseBody);

                if (response.isSuccessful()) {
                    JSONObject json = new JSONObject(responseBody);
                    String accessToken = json.optString("access_token");
                    JSONObject userJson = json.optJSONObject("user");

                    User user = new User();
                    user.setId(userJson.optString("id"));
                    user.setName(userJson.optString("nome"));
                    user.setEmail(userJson.optString("email"));
                    user.setRole(userJson.optString("role"));
                    user.setToken(accessToken);
                    String pacienteId = userJson.optString("paciente_id", null);
                    if (pacienteId != null && !pacienteId.equals("null")) {
                        user.setPacienteId(pacienteId);
                    }

                    callback.onSuccess(user);
                } else {
                    JSONObject errorJson = new JSONObject(responseBody);
                    callback.onError(errorJson.optString("error", "Erro ao cadastrar."));
                }
            } catch (Exception e) {
                Log.e(TAG, "Erro no registro", e);
                callback.onError("Sem conexão com o servidor.");
            }
        }).start();
    }

    // ── Buscar dados do usuário autenticado ─────────────────────
    // GET /auth/me
    // Header: Authorization: Bearer <token>
    public static void getMe(String token, ApiCallback<User> callback) {
        new Thread(() -> {
            try {
                Request request = new Request.Builder()
                        .url(API_BASE_URL + "/auth/me")
                        .get()
                        .addHeader("Authorization", "Bearer " + token)
                        .build();

                Response response = client.newCall(request).execute();
                String responseBody = response.body().string();

                if (response.isSuccessful()) {
                    JSONObject json = new JSONObject(responseBody);
                    User user = new User();
                    user.setId(json.optString("id"));
                    user.setName(json.optString("nome"));
                    user.setEmail(json.optString("email"));
                    user.setRole(json.optString("role"));
                    user.setToken(token);
                    String pacienteId = json.optString("paciente_id", null);
                    if (pacienteId != null && !pacienteId.equals("null")) {
                        user.setPacienteId(pacienteId);
                    }
                    callback.onSuccess(user);
                } else {
                    callback.onError("Sessão expirada.");
                }
            } catch (Exception e) {
                callback.onError("Sem conexão.");
            }
        }).start();
    }

    // ── Buscar prescrições (exercícios do paciente) ─────────────
    // GET /prescricoes/paciente/:pacienteId
    // Header: Authorization: Bearer <token>
    // Response: array de prescrições com dados do exercício (JOIN)
    public static void getExercises(String pacienteId, String token,
                                    ApiCallback<List<Exercise>> callback) {
        new Thread(() -> {
            try {
                Request request = new Request.Builder()
                        .url(API_BASE_URL + "/prescricoes/paciente/" + pacienteId)
                        .get()
                        .addHeader("Authorization", "Bearer " + token)
                        .build();

                Response response = client.newCall(request).execute();
                String responseBody = response.body().string();
                Log.d(TAG, "Exercises response: " + responseBody);

                if (response.isSuccessful()) {
                    JSONArray array = new JSONArray(responseBody);
                    List<Exercise> exercises = new ArrayList<>();
                    for (int i = 0; i < array.length(); i++) {
                        JSONObject obj = array.getJSONObject(i);
                        Exercise ex = new Exercise();

                        // ID da prescrição
                        ex.setId(obj.optString("id"));
                        ex.setExercicioId(obj.optString("exercicio_id"));

                        // Dados do exercício (vêm do JOIN)
                        ex.setName(obj.optString("exercicio_nome", "Exercício"));
                        ex.setDescription(obj.optString("exercicio_descricao", ""));
                        ex.setInstrucoes(obj.optString("exercicio_instrucoes", ""));
                        ex.setMusculoAlvo(obj.optString("exercicio_musculo", ""));
                        ex.setTipo(obj.optString("exercicio_tipo", "outro"));
                        ex.setDificuldade(obj.optString("exercicio_dificuldade", "moderado"));
                        ex.setMidiaUrl(obj.optString("exercicio_midia_url", ""));

                        // Dados da prescrição
                        ex.setSets(obj.optInt("series", 3));
                        ex.setReps(obj.optInt("repeticoes", 10));
                        ex.setDurationSeconds(obj.optInt("duracao_seg", 0));
                        ex.setFrequencia(obj.optString("frequencia", ""));
                        ex.setObservacoes(obj.optString("observacoes", ""));

                        // videoUrl vem do midia_url do exercício
                        ex.setVideoUrl(obj.optString("exercicio_midia_url", ""));

                        ex.setOrderIndex(i);
                        exercises.add(ex);
                    }
                    callback.onSuccess(exercises);
                } else {
                    callback.onError("Erro ao buscar exercícios.");
                }
            } catch (Exception e) {
                Log.e(TAG, "Erro ao buscar exercícios", e);
                callback.onError("Sem conexão com o servidor.");
            }
        }).start();
    }

    // ── Registrar check-in ──────────────────────────────────────
    // POST /checkins
    // Body: { paciente_id, prescricao_id, executado, nivel_dor, observacoes }
    // Header: Authorization: Bearer <token>
    public static void postCheckin(String pacienteId, String prescricaoId,
                                   boolean executado, int nivelDor, String observacoes,
                                   String token, ApiCallback<Boolean> callback) {
        new Thread(() -> {
            try {
                JsonObject body = new JsonObject();
                body.addProperty("paciente_id",   pacienteId);
                body.addProperty("prescricao_id", prescricaoId);
                body.addProperty("executado",     executado);
                body.addProperty("nivel_dor",     nivelDor);
                body.addProperty("observacoes",   observacoes);

                Request request = new Request.Builder()
                        .url(API_BASE_URL + "/checkins")
                        .post(RequestBody.create(body.toString(), JSON_TYPE))
                        .addHeader("Authorization", "Bearer " + token)
                        .build();

                Response response = client.newCall(request).execute();
                String responseBody = response.body().string();
                Log.d(TAG, "Checkin response: " + response.code() + " " + responseBody);

                boolean success = response.isSuccessful();
                callback.onSuccess(success);
            } catch (Exception e) {
                Log.e(TAG, "Erro no check-in", e);
                callback.onError("Sem conexão.");
            }
        }).start();
    }

    // ── Buscar histórico de check-ins ───────────────────────────
    // GET /checkins/paciente/:pacienteId
    // Header: Authorization: Bearer <token>
    public static void getCheckinHistory(String pacienteId, String token,
                                         ApiCallback<List<Checkin>> callback) {
        new Thread(() -> {
            try {
                Request request = new Request.Builder()
                        .url(API_BASE_URL + "/checkins/paciente/" + pacienteId)
                        .get()
                        .addHeader("Authorization", "Bearer " + token)
                        .build();

                Response response = client.newCall(request).execute();
                String responseBody = response.body().string();

                if (response.isSuccessful()) {
                    JSONArray array = new JSONArray(responseBody);
                    List<Checkin> checkins = new ArrayList<>();
                    for (int i = 0; i < array.length(); i++) {
                        JSONObject obj = array.getJSONObject(i);
                        Checkin ch = new Checkin();
                        ch.setId(obj.optString("id"));
                        ch.setPacienteId(obj.optString("paciente_id"));
                        ch.setPrescricaoId(obj.optString("prescricao_id"));
                        ch.setExecutado(obj.optBoolean("executado", false));
                        ch.setPainLevel(obj.optInt("nivel_dor", 0));
                        ch.setNotes(obj.optString("observacoes", ""));
                        ch.setCheckinDate(obj.optString("data", ""));
                        ch.setExerciseName(obj.optString("exercicio_nome", ""));
                        ch.setSynced(true);
                        checkins.add(ch);
                    }
                    callback.onSuccess(checkins);
                } else {
                    callback.onError("Erro ao buscar histórico.");
                }
            } catch (Exception e) {
                callback.onError("Sem conexão.");
            }
        }).start();
    }
}
