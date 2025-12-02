import { Stack } from "expo-router";

import {
  Poppins_400Regular,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_Regular: Poppins_400Regular,
    Poppins_Bold: Poppins_700Bold,
  });

  return (
    <Stack>
      <Stack.Screen name="startscreens" options={{ headerShown: false }} />
    </Stack>
  );
}
