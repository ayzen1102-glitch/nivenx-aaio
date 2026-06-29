plugins {
    id("java")
    id("application")
    id("com.gradleup.shadow") version "8.3.1"
}

group = "com.pfpbot"
version = "1.0.0"

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

application {
    mainClass.set("com.pfpbot.Bot")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("net.dv8tion:JDA:6.4.2")
    implementation("org.xerial:sqlite-jdbc:3.47.1.0")
    implementation("com.google.code.gson:gson:2.11.0")
    implementation("ch.qos.logback:logback-classic:1.5.6")
    implementation("org.yaml:snakeyaml:2.2")
}

tasks {
    named<com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar>("shadowJar") {
        archiveClassifier.set("")
        mergeServiceFiles()
        destinationDirectory.set(rootProject.layout.projectDirectory.dir("../main-source").asFile)
    }

    named<JavaExec>("run") {
        standardInput = System.`in`
    }

    build {
        dependsOn(shadowJar)
    }
}
