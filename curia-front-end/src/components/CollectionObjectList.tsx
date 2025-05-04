import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import CollectionObjectListItem from "./CollectionObjectListItem";
import PagePicker from "./PagePicker";
import SortPicker from "./SortPicker";
import FilterPicker, { FilterOptions } from "./FilterPicker";
import { Artefact, SortOptions } from "../apis/api.class";
import { ExhibitionId } from "../interfaces/get-exhibition.interface";

export const RESULTS_PER_PAGE = 10;
const MAX_TO_RENDER_PER_BATCH = 10; // 10
const UPDATE_CELLS_BATCH_PERIOD = 50; // 50
const INITIAL_NUM_TO_RENDER = 20; // 10
const WINDOW_SIZE = 5; // 21

interface Props {
  queryResultsPending: boolean;
  totalResultsAvailable: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  sortBy: SortOptions;
  setSortBy: Dispatch<SetStateAction<SortOptions>>;
  filterOptions: FilterOptions;
  setFilterOptions: Dispatch<SetStateAction<FilterOptions>>;
  artefactsForPage: Artefact[];
  forExhibition?: ExhibitionId;
}

export default function CollectionObjectList({
  queryResultsPending,
  totalResultsAvailable,
  page,
  setPage,
  sortBy,
  setSortBy,
  filterOptions,
  setFilterOptions,
  artefactsForPage,
  forExhibition,
}: Props) {
  const [numberOfPages, setNumberOfPages] = useState(1);

  useEffect(() => {
    if (!queryResultsPending) {
      setNumberOfPages(Math.ceil(totalResultsAvailable / RESULTS_PER_PAGE));
    }
  }, [queryResultsPending, totalResultsAvailable]);

  useEffect(() => {
    if (page > numberOfPages) setPage(numberOfPages);
  }, [page, numberOfPages, setPage]);

  return (
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
          {queryResultsPending ? (
            <p>Loading...</p>
          ) : (
            <FlatList
              data={queryResultsPending ? [] : artefactsForPage}
              keyExtractor={(item) => item.localId}
              maxToRenderPerBatch={MAX_TO_RENDER_PER_BATCH}
              updateCellsBatchingPeriod={UPDATE_CELLS_BATCH_PERIOD}
              initialNumToRender={INITIAL_NUM_TO_RENDER}
              windowSize={WINDOW_SIZE}
              renderItem={({ item }) => (
                <CollectionObjectListItem
                  item={item}
                  viewedInExhibition={forExhibition}
                />
              )}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
