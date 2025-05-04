import { SortOptions } from "@/src/apis/api.class";
import Artefact from "@/src/apis/Artefact.interface";
import { apiDetailsForArtefact } from "@/src/apis/gateway.api";
import CollectionObjectList, {
  RESULTS_PER_PAGE,
} from "@/src/components/CollectionObjectList";
import {
  defaultFilterOptions,
  FilterOptions,
} from "@/src/components/FilterPicker";
import { SessionContext } from "@/src/contexts/session.context";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";

export default function Index() {
  const [session] = useContext(SessionContext);

  const [filterOptions, setFilterOptions] =
    useState<FilterOptions>(defaultFilterOptions);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(SortOptions.Maker);

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
      session.cachedFavourites?.map((localId) => {
        const api = apiDetailsForArtefact(localId);
        return {
          queryKey: ["favourites", localId],
          queryFn: () => api.fetchFn(),
          staleTime: Infinity,
        };
      }) ?? [],
    combine: combineResults,
  });

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

  if (!session.accessToken) {
    return <Redirect href="/" />;
  }

  return (
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
  );
}
