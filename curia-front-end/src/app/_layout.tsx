import { DevToolsBubble } from "react-native-react-query-devtools";
import * as Clipboard from "expo-clipboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
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
      <Stack>
        <Stack.Screen name="index" options={{ headerTitle: "Curia" }} />
      </Stack>
      {__DEV__ && <DevToolsBubble onCopy={onCopy} data-testid="devtools" />}
    </QueryClientProvider>
  );
}

export const unstable_settings = {
  initialRouteName: "index",
};
