import { DevToolsBubble } from "react-native-react-query-devtools";
import * as Clipboard from "expo-clipboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./app";

export default function RootLayout() {
  const queryClient = new QueryClient();

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
      <App />
      <DevToolsBubble onCopy={onCopy} />
    </QueryClientProvider>
  );
}
