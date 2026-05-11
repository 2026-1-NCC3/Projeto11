package com.maya.rpg;

import android.app.Application;
import com.maya.rpg.database.DatabaseHelper;

public class MayaApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        DatabaseHelper.getInstance(this).getWritableDatabase();
    }
}
