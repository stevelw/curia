import { signup } from "../../apis/backEnd.api";
import { SessionContext } from "../../contexts/session.context";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Button, StyleSheet, View } from "react-native";

export default function Index() {
  const [_session, setSession] = useContext(SessionContext);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    const createAccountAndSignIn = async () => {
      try {
        const accessToken = await signup(username, password);
        setSession({
          accessToken,
          cachedFavourites: [],
          cachedExhibitions: [],
        });
        router.back();
      } catch (err) {
        setError((err as Error).message);
      }
    };
    void createAccountAndSignIn();
  };

  return (
    <View style={styles.view}>
      <form style={styles.container} onSubmit={handleSubmit}>
        <div style={styles.inputContainer}>
          <label>
            Username
            <input
              style={styles.input}
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div style={styles.inputContainer}>
          <label>
            Password
            <input
              style={styles.input}
              type="text"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <Button
          title="Sign up"
          onPress={handleSubmit}
          disabled={!username || !password}
          color={"green"}
        />
        {error && <p>{error}</p>}
      </form>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    height: "100%",
    width: "100%",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
  },
  input: {
    borderRadius: 5,
    borderWidth: 0,
    shadowColor: "grey",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    margin: 10,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
});
