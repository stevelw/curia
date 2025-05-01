import { signin as apiSignIn, fetchFavourites } from "@/src/apis/backEnd.api";
import { SessionContext } from "@/src/contexts/session.context";
import { useRouter } from "expo-router";
import {
  FormEventHandler,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";

export default function Index() {
  const [session, setSession] = useContext(SessionContext);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      setError("");
      e.preventDefault();
      const signin = async () => {
        try {
          const accessToken = await apiSignIn(username, password);
          const cachedFavourites = await fetchFavourites(accessToken);
          setSession((prev) => ({
            ...prev,
            accessToken,
            cachedFavourites,
          }));
        } catch (err) {
          setError((err as Error).message);
        }
      };
      void signin();
    },
    [username, password, setSession],
  );

  useEffect(() => {
    if (session.accessToken) {
      router.back();
    }
  }, [session.accessToken, router]);

  return (
    <View style={styles.view}>
      <form style={styles.container} onSubmit={handleSubmit}>
        <div>
          <label style={styles.item}>
            Username
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label style={styles.item}>
            Password
            <input
              type="text"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button
          type="submit"
          style={styles.item}
          disabled={!username || !password}
        >
          Sign In
        </button>
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
    flex: 1,
    flexDirection: "column",
  },
  item: {
    flex: 1,
  },
});
