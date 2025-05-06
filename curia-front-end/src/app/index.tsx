import { Button, StyleSheet, View } from "react-native";
import Search from "../components/Search";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { SessionContext } from "../contexts/session.context";
import { action, create, destroy } from "../components/colours";

export default function Index() {
  const router = useRouter();
  const [session, setSession] = useContext(SessionContext);

  return (
    <View style={styles.container}>
      <nav>
        {!session.accessToken ? (
          <View style={styles.flexRow}>
            <View style={styles.flexButton}>
              <Button
                title="Sign in"
                color={action}
                onPress={() => router.navigate("/signin")}
              />
            </View>
            <View style={styles.flexButton}>
              <Button
                title="Create account"
                color={create}
                onPress={() => router.navigate("/signup")}
              />
            </View>
          </View>
        ) : (
          <View style={styles.flexRow}>
            <View style={styles.flexButton}>
              <Button
                title="My Favourites"
                color={action}
                onPress={() => router.navigate("/favourites")}
              />
            </View>
            <View style={styles.flexButton}>
              <Button
                title="Sign out"
                color={destroy}
                onPress={() =>
                  setSession({
                    accessToken: "",
                    cachedFavourites: null,
                    cachedExhibitions: null,
                  })
                }
              />
            </View>
          </View>
        )}
        <View style={styles.button}>
          <Button
            title="Exhibitions"
            color={action}
            onPress={() => router.navigate("/exhibitions")}
          />
        </View>
      </nav>
      <View aria-label="main" style={styles.flex1}>
        <Search />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "column", flex: 1 },
  flexRow: {
    flexDirection: "row",
  },
  flexButton: {
    flex: 1,
    padding: 5,
  },
  button: {
    padding: 5,
  },
  flex1: {
    flex: 1,
  },
});
