import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import CollectionObjectListItem from "./CollectionObjectListItem";
import PagePicker from "./PagePicker";
import SortPicker from "./SortPicker";
import FilterPicker, { FilterOptions } from "./FilterPicker";
import { Artefact, SortOptions } from "../apis/api.class";
import { ExhibitionId } from "../interfaces/get-exhibition.interface";
import { action } from "./colours";

export const RESULTS_PER_PAGE = 25;
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
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  const [numberOfPages, setNumberOfPages] = useState(1);
  const [isShowingFilters, setIsShowingFilters] = useState(false);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    if (!queryResultsPending) {
      setNumberOfPages(
        Math.max(Math.ceil(totalResultsAvailable / RESULTS_PER_PAGE), 1),
      );
    }
  }, [queryResultsPending, totalResultsAvailable]);

  useEffect(() => {
    if (page > numberOfPages) setPage(numberOfPages);
  }, [page, numberOfPages, setPage]);

  useEffect(() => {
    setColumns(Math.max(Math.floor(width / 250), 1));
  }, [width]);

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
  }, [page]);

  function toggleFilterDisplay() {
    setIsShowingFilters((prev) => !prev);
  }

  return (
    <View style={styles.container}>
      <View style={styles.flexRow}>
        <Button title="Filters" color={action} onPress={toggleFilterDisplay} />
        <View style={styles.flex1}>
          <SortPicker sortBy={sortBy} setSortBy={setSortBy} />
        </View>
      </View>
      {isShowingFilters ? (
        <ScrollView style={styles.flex1}>
          <FilterPicker
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
          />
        </ScrollView>
      ) : (
        <View style={styles.container}>
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
              ref={flatListRef}
              style={styles.list}
              horizontal={false}
              numColumns={columns}
              columnWrapperStyle={
                (columns > 1 ? styles.row : undefined) || undefined
              }
              key={columns}
              data={queryResultsPending ? [] : artefactsForPage}
              keyExtractor={(item: Artefact) => item.localId}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "column", flex: 1, margin: 0, padding: 0 },
  flexRow: {
    flexDirection: "row",
    margin: 5,
  },
  flex1: {
    flex: 1,
  },
  list: {
    flex: 1,
    width: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
  },
});
