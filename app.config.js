// app.config.js — dynamic config that reads sensitive values from .env
// This file supersedes app.json when Expo detects it is present.
// Run `cp .env.example .env` and fill in your values before starting.

export default {
  expo: {
    name: "Fast Eat",
    slug: "fast-eat",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logo/logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/logo/splash_logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/logo/splash_logo.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./assets/logo/logo.png",
    },
    extra: {
      baseUrl:
        process.env.BASE_URL || "https://fallback-placeholder.com/",
    },
  },
};
