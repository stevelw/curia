import { Artefact } from "../apis/api.class";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

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
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push(`/artefact/${localId}`)}>
      <View role="listitem" style={styles.listItem}>
        <div style={styles.listItemLeft}>
          <img src={primaryThumbnailUrl} alt="" style={styles.image} />
        </div>
        <div style={styles.listItemRight}>
          <h2>{title}</h2>
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
  listItemRight: {
    flex: 1,
  },
  image: {
    maxHeight: "100%",
  },
});
