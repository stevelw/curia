import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { vaApi, SearchFnReturn } from "../apis/va.api";
import { metApi } from "../apis/met.api";
import SearchBox from "./SearchBox";
import { SortOptions } from "../apis/api.class";
import CollectionObjectList, { RESULTS_PER_PAGE } from "./CollectionObjectList";
import { defaultFilterOptions, FilterOptions } from "./FilterPicker";

export default function SearchResults() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(SortOptions.Maker);
  const [page, setPage] = useState(1);
  const [filterOptions, setFilterOptions] =
    useState<FilterOptions>(defaultFilterOptions);

  const combineResults = useCallback(
    (results: UseQueryResult<SearchFnReturn, Error>[]) => {
      const allResults = results
        .flatMap((result) => result.data?.results)
        .filter((artefact) => artefact !== undefined);
      const filteredAndSortedResults = allResults
        .filter(
          ({ objectType }) =>
            filterOptions.objectType.selected.length === 0 ||
            filterOptions.objectType.selected.includes(objectType),
        )
        .filter(
          ({ currentLocation }) =>
            filterOptions.currentLocation.selected.length === 0 ||
            filterOptions.currentLocation.selected.includes(currentLocation),
        )
        .filter(({ apiSource }) =>
          filterOptions.api.selected.includes(apiSource),
        )
        .sort((a, b) => {
          let makerAComparitor, makerBComparitor;
          switch (sortBy) {
            case SortOptions.Maker:
              makerAComparitor = a.maker;
              makerBComparitor = b.maker;
              break;
            case SortOptions.Location:
              makerAComparitor = a.currentLocation;
              makerBComparitor = b.currentLocation;
              break;
            default:
              throw new Error("Unknown sort option in V&A API");
          }
          if (makerAComparitor < makerBComparitor) return -1;
          if (makerAComparitor > makerBComparitor) return 1;
          return 0;
        });
      return {
        totalResultsAvailable: filteredAndSortedResults.length,
        objectTypes: [
          ...new Set<string>(allResults.map((artefact) => artefact.objectType)),
        ].sort(),
        currentLocations: [
          ...new Set(allResults.map((artefact) => artefact.currentLocation)),
        ].sort(),
        data: filteredAndSortedResults.slice(
          (page - 1) * RESULTS_PER_PAGE,
          page * RESULTS_PER_PAGE,
        ),
        pending: results.some((result) => result.isPending),
      };
    },
    [
      page,
      sortBy,
      filterOptions.objectType.selected,
      filterOptions.currentLocation.selected,
      filterOptions.api.selected,
    ],
  );
  const queryResults = useQueries({
    queries: [
      {
        queryKey: ["search", searchTerm, sortBy, vaApi.name],
        queryFn: () =>
          vaApi.search(
            searchTerm,
            sortBy,
            filterOptions.objectType.selected,
            filterOptions.currentLocation.selected,
          ),
        enabled:
          searchTerm !== "" && filterOptions.api.selected.includes(vaApi.name),
        staleTime: vaApi.staleTime,
        gcTime: vaApi.garbageCollectionTime,
      },
      {
        queryKey: ["search", searchTerm, sortBy, metApi.name],
        queryFn: () =>
          metApi.search(
            searchTerm,
            sortBy,
            filterOptions.objectType.selected,
            filterOptions.currentLocation.selected,
          ),
        enabled:
          searchTerm !== "" && filterOptions.api.selected.includes(metApi.name),
        staleTime: metApi.staleTime,
        gcTime: metApi.garbageCollectionTime,
      },
    ],
    combine: combineResults,
  });

  useEffect(() => {
    if (!queryResults.pending) {
      setFilterOptions((prevFilterOptions) => ({
        objectType: {
          valid: queryResults.objectTypes,
          selected: prevFilterOptions.objectType.selected.filter((selected) =>
            queryResults.objectTypes.includes(selected),
          ),
        },
        currentLocation: {
          valid: queryResults.currentLocations,
          selected: prevFilterOptions.currentLocation.selected.filter(
            (selected) => queryResults.currentLocations.includes(selected),
          ),
        },
        api: prevFilterOptions.api,
      }));
    }
  }, [
    queryResults.pending,
    queryResults.objectTypes,
    queryResults.currentLocations,
  ]);

  return (
    <>
      <h1 style={styles.h1}>Search</h1>
      <SearchBox setSearchTerm={setSearchTerm} />
      {searchTerm !== "" && (
        <CollectionObjectList
          queryResultsPending={queryResults.pending}
          artefactsForPage={queryResults.data}
          totalResultsAvailable={queryResults.totalResultsAvailable}
          page={page}
          setPage={setPage}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
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
