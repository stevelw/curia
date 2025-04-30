import { Artefact } from "../apis/api.class";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { MouseEventHandler, useCallback, useContext } from "react";
import { addToFavourites } from "../apis/backEnd.api";
import { SessionContext } from "../contexts/session.context";
interface Props {
  item: Artefact;
}

export default function CollectionObjectListItem({ item }: Props) {
  const {
    localId,
    title,
    maker,
    currentLocation,
    objectDate,
    images: { primaryThumbnailUrl },
    apiSource,
  } = item;

  const [session, setSession] = useContext(SessionContext);
  const router = useRouter();

  const handleFavourite = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();
      const favourite = async () => {
        const cachedFavourites = await addToFavourites(
          session.accessToken,
          localId,
        );
        setSession((prev) => ({ ...prev, cachedFavourites }));
      };
      void favourite();
    },
    [setSession, localId, session.accessToken],
  );

  return (
    <Pressable onPress={() => router.push(`/artefact/${localId}`)}>
      <View role="listitem" style={styles.listItem}>
        <div style={styles.listItemLeft}>
          <img src={primaryThumbnailUrl} alt="" style={styles.image} />
        </div>
        <div style={styles.flex}>
          <div style={styles.container}>
            <h2 style={styles.flex}>{title}</h2>
            {session.accessToken && (
              <TouchableOpacity>
                <button
                  onClick={handleFavourite}
                  style={
                    session.cachedFavourites?.includes(localId)
                      ? styles.isFavourited
                      : styles.isNotFavourited
                  }
                >
                  {session.cachedFavourites?.includes(localId)
                    ? "Unfavourite"
                    : "Favourite"}
                </button>
              </TouchableOpacity>
            )}
          </div>
          <p>Made by: {maker}</p>
          <p>Current location: {currentLocation}</p>
          <p>{objectDate}</p>
          <p>Source: {apiSource}</p>
        </div>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listItem: {
    margin: 10,
    padding: 10,
    borderColor: "black",
    borderWidth: 1,
    borderStyle: "solid",
    flexDirection: "row",
    display: "flex",
  },
  listItemLeft: {
    flex: 1,
    height: 100,
  },
  flex: {
    flex: 1,
  },
  image: {
    maxHeight: "100%",
  },
  container: {
    flexDirection: "row",
    display: "flex",
    width: "100%",
  },
  isFavourited: { backgroundColor: "red" },
  isNotFavourited: { backgroundColor: "gold" },
});
