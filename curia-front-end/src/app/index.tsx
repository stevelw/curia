import { Button, StyleSheet, View } from "react-native";
import Search from "../components/Search";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { SessionContext } from "../contexts/session.context";

export default function Index() {
  const router = useRouter();
  const [session, setSession] = useContext(SessionContext);

  return (
    <View>
      {!session.accessToken ? (
        <View style={styles.flexRow}>
          <View style={styles.flexButton}>
            <Button
              title="Sign in"
              onPress={() => router.navigate("/signin")}
            />
          </View>
          <View style={styles.flexButton}>
            <Button
              title="Create account"
              color={"green"}
              onPress={() => router.navigate("/signup")}
            />
          </View>
        </View>
      ) : (
        <View style={styles.flexRow}>
          <View style={styles.flexButton}>
            <Button
              title="My Favourites"
              onPress={() => router.navigate("/favourites")}
            />
          </View>
          <View style={styles.flexButton}>
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
          </View>
        </View>
      )}
      <View style={styles.flexButton}>
        <Button
          title="Exhibitions"
          onPress={() => router.navigate("/exhibitions")}
        />
      </View>
      <Search />
    </View>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: "row",
  },
  flexButton: {
    flex: 1,
    padding: 5,
  },
});
