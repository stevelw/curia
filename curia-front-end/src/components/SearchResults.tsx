import { useCallback, useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import CollectionObjectListItem from "./CollectionObjectListItem";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { vaApi, SearchFnReturn } from "../apis/va.api";
import { metApi } from "../apis/met.api";
import PagePicker from "./PagePicker";
import SearchBox from "./SearchBox";
import { SortOptions } from "../apis/api.class";
import SortPicker from "./SortPicker";
import FilterPicker, { FilterOptions } from "./FilterPicker";

const RESULTS_PER_PAGE = 10;
const MAX_TO_RENDER_PER_BATCH = 10; // 10
const UPDATE_CELLS_BATCH_PERIOD = 50; // 50
const INITIAL_NUM_TO_RENDER = 20; // 10
const WINDOW_SIZE = 5; // 21

export default function SearchResults() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(SortOptions.Maker);
  const [page, setPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    objectType: { valid: [], selected: [] },
    currentLocation: { valid: [], selected: [] },
    api: {
      valid: [vaApi.name, metApi.name].sort(),
      selected: [vaApi.name, metApi.name],
    },
  });

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
      setNumberOfPages(
        Math.ceil(queryResults.totalResultsAvailable / RESULTS_PER_PAGE),
      );
    }
  }, [queryResults.pending, queryResults]);

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

  useEffect(() => {
    if (page > numberOfPages) setPage(numberOfPages);
  }, [page, numberOfPages]);

  return (
    <>
      <h1 style={styles.h1}>Search</h1>
      <SearchBox setSearchTerm={setSearchTerm} />
      {searchTerm !== "" && (
        <>
          <SortPicker sortBy={sortBy} setSortBy={setSortBy} />
          <View style={styles.columns}>
            <ScrollView style={styles.filters}>
              <FilterPicker
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
              />
            </ScrollView>
            <View style={styles.results}>
              <PagePicker
                currentPage={page}
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
                  renderItem={({ item }) => (
                    <CollectionObjectListItem item={item} />
                  )}
                />
              )}
            </View>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  h1: {
    padding: 10,
  },
  columns: {
    flexDirection: "row",
    flex: 1,
  },
  filters: {
    flex: 1,
  },
  results: {
    flex: 2,
  },
});
