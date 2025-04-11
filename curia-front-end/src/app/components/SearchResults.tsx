import React from "react";
import { FlatList } from "react-native";
import CollectionObjectListItem from "./CollectionObjectListItem";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import * as vaApi from "../../apis/va.api";
import * as metApi from "../../apis/met.api";
import Artefact from "../../types/Artefact.interface";

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
      <h2>Search Results</h2>
      {queryResults.pending && <p>Loading...</p>}
      <FlatList
        data={queryResults.pending ? [] : queryResults.data}
        renderItem={({ item }) => <CollectionObjectListItem item={item} />}
      />
    </>
  );
}
