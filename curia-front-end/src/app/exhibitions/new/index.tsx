import {
  createExhibition,
  fetchUsersExhibitions,
} from "@/src/apis/backEnd.api";
import { create } from "@/src/components/colours";
import { SessionContext } from "@/src/contexts/session.context";
import { Redirect, useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { Button, StyleSheet, View } from "react-native";

export default function Index() {
  const [session, setSession] = useContext(SessionContext);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(() => {
    setError("");
    const create = async () => {
      try {
        const newExhibition = await createExhibition(
          session.accessToken,
          title,
          description !== "" ? description : undefined,
        );
        const { exhibitions: cachedExhibitions } = await fetchUsersExhibitions(
          session.accessToken,
        );
        setSession((prev) => ({ ...prev, cachedExhibitions }));
        router.replace(`/exhibitions/${newExhibition._id}`);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    void create();
  }, [session.accessToken, title, description, setSession, router]);

  if (!session.accessToken) {
    return <Redirect href="/exhibitions" />;
  }

  return (
    <View style={styles.view}>
      <form style={styles.container}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>
            Title
            <input
              style={styles.input}
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>
            Description
            <textarea
              style={styles.input}
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
        <Button
          title="Create"
          onPress={handleSubmit}
          color={create}
          disabled={!title || !description}
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
    verticalAlign: "middle",
    width: 250,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  label: {
    justifyContent: "center",
    alignItems: "center",
  },
});
