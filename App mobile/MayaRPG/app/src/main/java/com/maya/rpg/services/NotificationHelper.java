
package com.maya.rpg.services;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import com.maya.rpg.R;
import com.maya.rpg.activities.MainActivity;
import java.util.concurrent.TimeUnit;

public class NotificationHelper {

    private static final String CHANNEL_ID      = "maya_exercicios";
    private static final String CHANNEL_NAME    = "Lembretes de Exercicios";
    private static final String WORK_TAG        = "lembrete_exercicio";

    // Cria o canal de notificação (obrigatório no Android 8+)
    public static void createChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID, CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_DEFAULT);
            channel.setDescription("Lembretes diarios de exercicios de RPG");
            NotificationManager nm = context.getSystemService(NotificationManager.class);
            if (nm != null) nm.createNotificationChannel(channel);
        }
    }

    // Agenda lembrete diário de exercícios usando WorkManager
    public static void agendarLembretesDiarios(Context context) {
        PeriodicWorkRequest workRequest =
                new PeriodicWorkRequest.Builder(ExercicioReminderWorker.class,
                        24, TimeUnit.HOURS)
                        .addTag(WORK_TAG)
                        .build();

        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                WORK_TAG,
                ExistingPeriodicWorkPolicy.KEEP, // não recria se já existe
                workRequest);
    }

    // Exibe uma notificação imediata
    public static void mostrarNotificacao(Context context, String titulo, String mensagem) {
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pi = PendingIntent.getActivity(context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle(titulo)
                .setContentText(mensagem)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setContentIntent(pi)
                .setAutoCancel(true); // fecha ao tocar

        NotificationManager nm = (NotificationManager)
                context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) nm.notify((int) System.currentTimeMillis(), builder.build());
    }

    // Worker que executa em background para disparar o lembrete
    public static class ExercicioReminderWorker extends Worker {
        public ExercicioReminderWorker(Context context, WorkerParameters params) {
            super(context, params);
        }

        @Override
        public Result doWork() {
            mostrarNotificacao(getApplicationContext(),
                    "Maya Yamamoto RPG",
                    "Hora dos seus exercicios! Mantenha o ritmo da sua reabilitacao.");
            return Result.success();
        }
    }
}

