import { createExhibition } from "@/src/apis/backEnd.api";
import { SessionContext } from "@/src/contexts/session.context";
import { Redirect, useRouter } from "expo-router";
import { FormEventHandler, useCallback, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Index() {
  const [session] = useContext(SessionContext);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      setError("");
      e.preventDefault();
      console.log(`HERE`);
      const create = async () => {
        try {
          const newExhibition = await createExhibition(
            session.accessToken,
            title,
            description !== "" ? description : undefined,
          );
          console.log(newExhibition);
          router.replace(`/exhibitions/${newExhibition._id}`);
        } catch (err) {
          setError((err as Error).message);
        }
      };
      void create();
    },
    [title, description, router, session.accessToken],
  );

  if (!session.accessToken) {
    return <Redirect href="/exhibitions" />;
  }

  return (
    <View style={styles.view}>
      <form style={styles.container} onSubmit={handleSubmit}>
        <div>
          <label style={styles.item}>
            Title
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label style={styles.item}>
            Description
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
        <button
          type="submit"
          style={styles.item}
          disabled={!title || !description}
        >
          Create
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
