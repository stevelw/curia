import React from "react";
import { useArtefactSearch } from "../../apis/aggregated.api";
import { FlatList } from "react-native";

export default function SearchResults() {
  const queryResults = useArtefactSearch("China");

  if (!queryResults.some(({ isSuccess }) => isSuccess)) {
    return <p>Loading...</p>;
  }
  if (queryResults.every(({ isError }) => isError)) return <p>ERROR</p>;

  return (
    <>
      <h2>Search Results</h2>
      {queryResults.some(({ isLoading }) => isLoading) && <p>Loading...</p>}
      {queryResults.some(({ isError }) => isError) && (
        <p>Some API's have errors, so we're not including them.</p>
      )}
      <FlatList
        data={queryResults.flatMap((queryResult) => {
          return queryResult.isSuccess ? queryResult.data : [];
        })}
        renderItem={({ item }) => (
          <div>
            <h3>{item.title}</h3>
            <p>Source: {item.apiSource}</p>
          </div>
        )}
      />
    </>
  );
}
