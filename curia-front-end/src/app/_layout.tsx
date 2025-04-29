import { DevToolsBubble } from "react-native-react-query-devtools";
import * as Clipboard from "expo-clipboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SessionContext, Session } from "../contexts/session.context";
import { useState } from "react";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [session, setSession] = useState<Session>({
    accessToken: "",
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
        <Stack>
          <Stack.Screen name="index" options={{ headerTitle: "Curia" }} />
        </Stack>
      </SessionContext.Provider>
      {__DEV__ && <DevToolsBubble onCopy={onCopy} data-testid="devtools" />}
    </QueryClientProvider>
  );
}

export const unstable_settings = {
  initialRouteName: "index",
};
