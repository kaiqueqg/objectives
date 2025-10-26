import 'dotenv/config';

export default {
  expo: {
    name: "Objectives",
    slug: "Objectives",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./public/images/appicon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./public/images/appicon.png",
      resizeMode: "contain",
      backgroundColor: "#1D1D1D"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./public/images/appicon.png",
        backgroundColor: "#1D1D1D"
      },
      package: "com.kayqg.Objectives"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      identityUrl: process.env.IDENTITY_URL,
      objectivesListUrl: process.env.OBJECTIVESLIST_URL,
      eas: {
        projectId: "ffd85f38-aee4-4c6d-ad99-66b34b0ecaf4"
      }
    },
    plugins: [
      "expo-font",
      [
        "expo-camera",
        {
          cameraPermission: "Allow Objectives to access your camera",
          microphonePermission: "Allow Objectives to access your microphone",
          recordAudioAndroid: true
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you share them with your friends."
        }
      ]
    ]
  }
};
