pluginManagement {
    repositories {
        google()            // Essencial para encontrar o plugin do Android
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    // Usamos PREFER_SETTINGS para evitar erros se houver scripts globais na sua máquina
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)

    repositories {
        google()
        mavenCentral()

        // Repositório da FECAP configurado corretamente aqui dentro
        maven {
            url = uri("http://pkg.fecap.br/repository/maven")
            isAllowInsecureProtocol = true
        }
    }
}

rootProject.name = "Android Maya RPG"
include(":app")