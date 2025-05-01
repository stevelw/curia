import { SortOptions } from "@/src/apis/api.class";
import Artefact from "@/src/apis/Artefact.interface";
import { fetchExhibition } from "@/src/apis/backEnd.api";
import { apiDetailsForArtefact } from "@/src/apis/gateway.api";
import CollectionObjectList, {
  RESULTS_PER_PAGE,
} from "@/src/components/CollectionObjectList";
import {
  defaultFilterOptions,
  FilterOptions,
} from "@/src/components/FilterPicker";
import { GetExhibitionResDto } from "@/src/interfaces/get-exhibitions.interface";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export default function ArtefactDetails() {
  const { exhibitionId } = useLocalSearchParams<{ exhibitionId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [exhibition, setExhibition] = useState<GetExhibitionResDto | undefined>(
    undefined,
  );
  const [filterOptions, setFilterOptions] =
    useState<FilterOptions>(defaultFilterOptions);
  const [sortBy, setSortBy] = useState(SortOptions.Maker);
  const [page, setPage] = useState(1);

  const combineResults = useCallback(
    (results: UseQueryResult<Artefact, Error>[]) => {
      const allResults: Artefact[] = results
        .map((result) => result.data)
        .filter((result) => result !== undefined);

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
              throw new Error("Unknown sort option");
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
        dataForPage: filteredAndSortedResults.slice(
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

  const {
    pending,
    dataForPage,
    totalResultsAvailable,
    objectTypes,
    currentLocations,
  } = useQueries({
    queries:
      exhibition?.artefacts?.map((localId) => {
        const api = apiDetailsForArtefact(localId);
        return {
          queryKey: ["post", localId],
          queryFn: () => api.fetchFn(),
          staleTime: Infinity,
        };
      }) ?? [],
    combine: combineResults,
  });

  useEffect(() => {
    setIsLoading(true);
    setError("");

    fetchExhibition(exhibitionId)
      .then((returnedArticle) => {
        setExhibition(returnedArticle);
        setIsLoading(false);
      })
      .catch((err) => {
        setError((err as Error).message);
      });
  }, [exhibitionId]);

  useEffect(() => {
    if (!pending) {
      setFilterOptions((prevFilterOptions) => ({
        objectType: {
          valid: objectTypes,
          selected: prevFilterOptions.objectType.selected.filter((selected) =>
            objectTypes.includes(selected),
          ),
        },
        currentLocation: {
          valid: currentLocations,
          selected: prevFilterOptions.currentLocation.selected.filter(
            (selected) => currentLocations.includes(selected),
          ),
        },
        api: prevFilterOptions.api,
      }));
    }
  }, [pending, objectTypes, currentLocations]);

  if (error || !exhibition) {
    return (
      <>
        <Stack.Screen options={{ title: "Oops!" }} />
        <p>{error}</p>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: "Loading..." }} />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Exhibition" }} />
      <h1>{exhibition.title}</h1>
      {exhibition.description && <p>Description: {exhibition.description}</p>}
      <CollectionObjectList
        queryResultsPending={pending}
        artefactsForPage={dataForPage}
        totalResultsAvailable={totalResultsAvailable}
        page={page}
        setPage={setPage}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
    </>
  );
}
