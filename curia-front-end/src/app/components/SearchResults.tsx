import React from "react";
import { FlatList, StyleSheet } from "react-native";
import CollectionObjectListItem from "./CollectionObjectListItem";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { vaApi, Artefact } from "../../apis/va.api";
import { metApi } from "../../apis/met.api";

const MAX_TO_RENDER_PER_BATCH = 10; // 10
const UPDATE_CELLS_BATCH_PERIOD = 50; // 50
const INITIAL_NUM_TO_RENDER = 20; // 10
const WINDOW_SIZE = 5; // 21

const searchTerm = "China";

const combineResults = (results: UseQueryResult<Artefact[], Error>[]) => {
  return {
    data: results
      .flatMap((result) => result.data)
      .filter((artefact) => !!artefact)
      .sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      }),
    pending: results.some((result) => result.isPending),
  };
};

export default function SearchResults() {
  const queryResults = useQueries({
    queries: [
      {
        queryKey: ["search", searchTerm, vaApi.name],
        queryFn: () => vaApi.search(searchTerm),
      },
      {
        queryKey: ["search", searchTerm, metApi.name],
        queryFn: () => metApi.search(searchTerm),
      },
    ],
    combine: combineResults,
  });

  return (
    <>
      <h2 style={styles.h2}>Search Results</h2>
      {queryResults.pending && <p>Loading...</p>}
      <FlatList
        data={queryResults.pending ? [] : queryResults.data}
        keyExtractor={(item) => item.localId}
        maxToRenderPerBatch={MAX_TO_RENDER_PER_BATCH}
        updateCellsBatchingPeriod={UPDATE_CELLS_BATCH_PERIOD}
        initialNumToRender={INITIAL_NUM_TO_RENDER}
        windowSize={WINDOW_SIZE}
        renderItem={({ item }) => <CollectionObjectListItem item={item} />}
      />
    </>
  );
}

const styles = StyleSheet.create({
  h2: {
    padding: 10,
  },
});
