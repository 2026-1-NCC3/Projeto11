package com.maya.rpg.network;

import android.util.Log;
import com.google.gson.JsonObject;
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

public class ApiClient {

    public static final String API_BASE_URL = "http://10.0.2.2:3000/api";
    private static final String TAG = "ApiClient";
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    private static final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(5, TimeUnit.SECONDS)
            .readTimeout(5, TimeUnit.SECONDS)
            .writeTimeout(5, TimeUnit.SECONDS)
            .build();

    public interface ApiCallback<T> {
        void onSuccess(T result);
        void onError(String errorMessage);
    }

    public static boolean isApiAvailable() {
        try {
            Request request = new Request.Builder()
                    .url(API_BASE_URL + "/health")
                    .get().build();
            Response response = client.newCall(request).execute();
            return response.isSuccessful();
        } catch (IOException e) {
            return false;
        }
    }

    public static void login(String email, String password, ApiCallback<User> callback) {
        new Thread(() -> {
            try {
                JsonObject body = new JsonObject();
                body.addProperty("email", email);
                body.addProperty("password", password);
                Request request = new Request.Builder()
                        .url(API_BASE_URL + "/auth/login")
                        .post(RequestBody.create(body.toString(), JSON))
                        .build();
                Response response = client.newCall(request).execute();
                String responseBody = response.body().string();
                if (response.isSuccessful()) {
                    JSONObject json = new JSONObject(responseBody);
                    User user = new User();
                    user.setId(json.optInt("id"));
                    user.setName(json.optString("name"));
                    user.setEmail(json.optString("email"));
                    user.setToken(json.optString("token"));
                    callback.onSuccess(user);
                } else {
                    callback.onError("E-mail ou senha incorretos.");
                }
            } catch (Exception e) {
                callback.onError("Sem conexão com o servidor.");
            }
        }).start();
    }

    public static void register(String name, String email, String password,
                                ApiCallback<User> callback) {
        new Thread(() -> {
            try {
                JsonObject body = new JsonObject();
                body.addProperty("name", name);
                body.addProperty("email", email);
                body.addProperty("password", password);
                Request request = new Request.Builder()
                        .url(API_BASE_URL + "/auth/register")
                        .post(RequestBody.create(body.toString(), JSON))
                        .build();
                Response response = client.newCall(request).execute();
                String responseBody = response.body().string();
                if (response.isSuccessful()) {
                    JSONObject json = new JSONObject(responseBody);
                    User user = new User();
                    user.setId(json.optInt("id"));
                    user.setName(json.optString("name"));
                    user.setEmail(json.optString("email"));
                    callback.onSuccess(user);
                } else {
                    callback.onError("Erro ao cadastrar.");
                }
            } catch (Exception e) {
                callback.onError("Sem conexão com o servidor.");
            }
        }).start();
    }

    public static void getExercises(int planId, String token,
                                    ApiCallback<List<Exercise>> callback) {
        new Thread(() -> {
            try {
                Request request = new Request.Builder()
                        .url(API_BASE_URL + "/plans/" + planId + "/exercises")
                        .get()
                        .addHeader("Authorization", "Bearer " + token)
                        .build();
                Response response = client.newCall(request).execute();
                String responseBody = response.body().string();
                if (response.isSuccessful()) {
                    JSONArray array = new JSONArray(responseBody);
                    List<Exercise> exercises = new ArrayList<>();
                    for (int i = 0; i < array.length(); i++) {
                        JSONObject obj = array.getJSONObject(i);
                        Exercise ex = new Exercise();
                        ex.setId(obj.optInt("id"));
                        ex.setPlanId(planId);
                        ex.setName(obj.optString("name"));
                        ex.setDescription(obj.optString("description"));
                        ex.setSets(obj.optInt("sets"));
                        ex.setReps(obj.optInt("reps"));
                        ex.setDurationSeconds(obj.optInt("duration_seconds"));
                        ex.setRestSeconds(obj.optInt("rest_seconds"));
                        ex.setVideoUrl(obj.optString("video_url"));
                        ex.setOrderIndex(i);
                        exercises.add(ex);
                    }
                    callback.onSuccess(exercises);
                } else {
                    callback.onError("Erro ao buscar exercícios.");
                }
            } catch (Exception e) {
                callback.onError("Sem conexão com o servidor.");
            }
        }).start();
    }

    public static void postCheckin(int planId, int exerciseId, int completed,
                                   int painLevel, String notes, String token,
                                   ApiCallback<Boolean> callback) {
        new Thread(() -> {
            try {
                JsonObject body = new JsonObject();
                body.addProperty("plan_id",    planId);
                body.addProperty("exercise_id", exerciseId);
                body.addProperty("completed",  completed);
                body.addProperty("pain_level", painLevel);
                body.addProperty("notes",      notes);
                Request request = new Request.Builder()
                        .url(API_BASE_URL + "/checkins")
                        .post(RequestBody.create(body.toString(), JSON))
                        .addHeader("Authorization", "Bearer " + token)
                        .build();
                Response response = client.newCall(request).execute();
                callback.onSuccess(response.isSuccessful());
            } catch (Exception e) {
                callback.onError("Sem conexão.");
            }
        }).start();
    }
}
