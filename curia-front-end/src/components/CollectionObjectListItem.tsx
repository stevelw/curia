import { Artefact } from "../apis/api.class";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
    images: { primaryThumbnailUrl },
  } = item;

  const router = useRouter();

  return (
    <View role="listitem" style={styles.outerListItem}>
      <Pressable
        style={styles.innerListItem}
        onPress={() => router.push(`/artefact/${localId}`)}
      >
        <View style={styles.listItemTop}>
          <img src={primaryThumbnailUrl} alt="" style={styles.image} />
        </View>
        <View style={styles.listItemBottom}>
          <Text
            style={styles.title}
            accessibilityRole="header"
            adjustsFontSizeToFit
          >
            {title}
          </Text>
          <View>
            <FavouriteButton localId={localId} />
            {viewedInExhibition && (
              <RemoveButton
                exhibitionId={viewedInExhibition}
                artefactId={localId}
              />
            )}
          </View>
          <p>Made by: {maker}</p>
          <p>Current location: {currentLocation}</p>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  outerListItem: {
    margin: 10,
    padding: 10,
    borderColor: "black",
    borderWidth: 1,
    borderStyle: "solid",
    flex: 1,
  },
  innerListItem: {
    display: "flex",
    flexDirection: "column",
    height: 300,
  },
  listItemTop: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexShrink: 2,
    flexGrow: 1,
  },
  listItemBottom: { flexGrow: 1, flexShrink: 0 },
  image: { maxWidth: "100%", maxHeight: "100%" },
  container: {
    flexDirection: "row",
    display: "flex",
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    paddingTop: 10,
  },
});
