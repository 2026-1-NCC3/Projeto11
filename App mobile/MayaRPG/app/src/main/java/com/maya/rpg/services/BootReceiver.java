
package com.maya.rpg.services;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            // Recria o canal e reagenda os lembretes
            NotificationHelper.createChannel(context);
            NotificationHelper.agendarLembretesDiarios(context);
        }
    }
}