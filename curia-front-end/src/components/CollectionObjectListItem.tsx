import { Artefact } from "../apis/api.class";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import FavouriteButton from "./FavouriteButton";
import RemoveButton from "./RemoveButton";
import { ExhibitionId } from "../interfaces/get-exhibition.interface";
interface Props {
  item: Artefact;
  viewedInExhibition?: ExhibitionId;
}

export default function CollectionObjectListItem({
  item,
  viewedInExhibition,
}: Props) {
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
        <div style={styles.flex}>
          <div style={styles.container}>
            <h1 style={styles.flex}>{title}</h1>
            <View>
              <FavouriteButton localId={localId} />
              {viewedInExhibition && (
                <RemoveButton
                  exhibitionId={viewedInExhibition}
                  artefactId={localId}
                />
              )}
            </View>
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
