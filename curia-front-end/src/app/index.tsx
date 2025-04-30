import { Button, View } from "react-native";
import SearchResults from "../components/SearchResults";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { SessionContext } from "../contexts/session.context";

export default function Index() {
  const router = useRouter();
  const [session, setSession] = useContext(SessionContext);

  return (
    <View>
      {!session.accessToken ? (
        <>
          <Button title="Sign in" onPress={() => router.navigate("/signin")} />
          <Button
            title="Create account"
            color={"green"}
            onPress={() => router.navigate("/signup")}
          />
        </>
      ) : (
        <Button
          title="Sign out"
          color={"red"}
          onPress={() => setSession({ accessToken: "" })}
        />
      )}
      <SearchResults />
    </View>
  );
}
