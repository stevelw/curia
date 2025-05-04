import { DevToolsBubble } from "react-native-react-query-devtools";
import * as Clipboard from "expo-clipboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SessionContext, Session } from "../contexts/session.context";
import { useState } from "react";
import { SafeAreaView } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [session, setSession] = useState<Session>({
    accessToken: "",
    cachedFavourites: null,
    cachedExhibitions: null,
  });

  const onCopy = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContext.Provider value={[session, setSession]}>
        <SafeAreaView>
          <Stack>
            <Stack.Screen name="index" options={{ headerTitle: "Curia" }} />
            <Stack.Screen
              name="signup/index"
              options={{ headerTitle: "Create new account" }}
            />
            <Stack.Screen
              name="signin/index"
              options={{ headerTitle: "Sign in" }}
            />
            <Stack.Screen
              name="favourites/index"
              options={{ headerTitle: "Favourites" }}
            />
            <Stack.Screen
              name="exhibitions/index"
              options={{ headerTitle: "Exhibitions" }}
            />
            <Stack.Screen
              name="exhibitions/new/index"
              options={{ headerTitle: "Create a new exhibition" }}
            />
          </Stack>
        </SafeAreaView>
      </SessionContext.Provider>
      {__DEV__ && <DevToolsBubble onCopy={onCopy} data-testid="devtools" />}
    </QueryClientProvider>
  );
}

export const unstable_settings = {
  initialRouteName: "index",
};
