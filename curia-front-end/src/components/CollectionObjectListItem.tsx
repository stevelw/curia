import React from "react";
import { Artefact } from "../apis/api.class";
import { StyleSheet, View } from "react-native";

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
    <View role="listitem" style={styles.listItem}>
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
    </View>
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
