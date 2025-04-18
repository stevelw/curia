import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import CollectionObjectListItem from "./CollectionObjectListItem";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { vaApi, SearchFnReturn } from "../apis/va.api";
import { metApi } from "../apis/met.api";
import PagePicker from "./PagePicker";

const RESULTS_PER_PAGE = 10;
const MAX_TO_RENDER_PER_BATCH = 10; // 10
const UPDATE_CELLS_BATCH_PERIOD = 50; // 50
const INITIAL_NUM_TO_RENDER = 20; // 10
const WINDOW_SIZE = 5; // 21

const searchTerm = "China";

export default function SearchResults() {
  const [page, setPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);

  const combineResults = useCallback(
    (results: UseQueryResult<SearchFnReturn, Error>[]) => {
      return {
        totalResultsAvailable: results.reduce((acc, { data }) => {
          const totalResultsAvailable = data?.totalResultsAvailable ?? 0;
          return acc + totalResultsAvailable;
        }, 0),
        data: results
          .flatMap((result) => result.data?.results)
          .filter((artefact) => !!artefact)
          .sort((a, b) => {
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            return 0;
          })
          .slice((page - 1) * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE),
        pending: results.some((result) => result.isPending),
      };
    },
    [page],
  );
  const queryResults = useQueries({
    queries: [
      {
        queryKey: ["search", searchTerm, page, vaApi.name],
        queryFn: () => vaApi.search(searchTerm, page * RESULTS_PER_PAGE),
      },
      {
        queryKey: ["search", searchTerm, page, metApi.name],
        queryFn: () => metApi.search(searchTerm, page * RESULTS_PER_PAGE),
      },
    ],
    combine: combineResults,
  });

  useEffect(() => {
    if (!queryResults.pending) {
      setNumberOfPages(
        Math.ceil(queryResults.totalResultsAvailable / RESULTS_PER_PAGE),
      );
    }
  }, [queryResults.pending, queryResults.totalResultsAvailable]);

  return (
    <>
      <h1 style={styles.h1}>Search Results</h1>
      <PagePicker
        page={page}
        numOfPages={numberOfPages}
        setPageCbFn={(page) => {
          setPage(page);
        }}
      />
      {queryResults.pending ? (
        <p>Loading...</p>
      ) : (
        <FlatList
          data={queryResults.pending ? [] : queryResults.data}
          keyExtractor={(item) => item.localId}
          maxToRenderPerBatch={MAX_TO_RENDER_PER_BATCH}
          updateCellsBatchingPeriod={UPDATE_CELLS_BATCH_PERIOD}
          initialNumToRender={INITIAL_NUM_TO_RENDER}
          windowSize={WINDOW_SIZE}
          renderItem={({ item }) => <CollectionObjectListItem item={item} />}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  h1: {
    padding: 10,
  },
});
