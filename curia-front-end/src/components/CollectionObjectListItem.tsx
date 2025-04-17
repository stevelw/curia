import React from "react";
import { Artefact } from "../apis/api.class";
import { Pressable, StyleSheet, View } from "react-native";
import { Link } from "expo-router";

interface Props {
  item: Artefact;
}

export default function CollectionObjectListItem({ item }: Props) {
  const {
    title,
    maker,
    objectDate,
    images: { primaryThumbnailUrl },
    apiSource,
  } = item;

  return (
    <View role="listitem">
      <Link href={`/artefact/${item.localId}`} asChild>
        <div style={styles.container}>
          <div style={styles.listItemLeft}>
            <img src={primaryThumbnailUrl} alt="" style={styles.image} />
          </div>
          <div style={styles.listItemRight}>
            <h2>{title}</h2>
            <p>
              {maker && maker + ", "}
              {objectDate}
            </p>
            <p>Source: {apiSource}</p>
          </div>
        </div>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderColor: "black",
    borderWidth: 1,
    borderStyle: "solid",
    flexDirection: "row",
    display: "flex",
    cursor: "pointer",
  },
  listItemLeft: {
    flex: 1,
    height: 200,
  },
  listItemRight: {
    flex: 1,
  },
  image: {
    maxHeight: "100%",
  },
});
