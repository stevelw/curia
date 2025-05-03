import { Button, StyleSheet, View } from "react-native";
import SearchResults from "../components/SearchResults";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { SessionContext } from "../contexts/session.context";

export default function Index() {
  const router = useRouter();
  const [session, setSession] = useContext(SessionContext);

  return (
    <View style={styles.appView}>
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
        <>
          <Button
            title="My Favourites"
            onPress={() => router.navigate("/favourites")}
          />
          <Button
            title="Sign out"
            color={"red"}
            onPress={() =>
              setSession({
                accessToken: "",
                cachedFavourites: null,
                cachedExhibitions: null,
              })
            }
          />
        </>
      )}
      <Button
        title="Exhibitions"
        onPress={() => router.navigate("/exhibitions")}
      />
      <SearchResults />
    </View>
  );
}

const styles = StyleSheet.create({
  appView: {
    height: "100%",
  },
});
