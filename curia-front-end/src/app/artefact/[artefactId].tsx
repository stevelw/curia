import { ScrollView } from "react-native";
import { LocalId } from "../../apis/Artefact.interface";
import { Stack, useLocalSearchParams } from "expo-router";
import { vaApi } from "../../apis/va.api";
import { metApi } from "../../apis/met.api";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../apis/api.class";
import { useCallback, useEffect, useState } from "react";

export default function ArtefactDetails() {
  const { artefactId } = useLocalSearchParams<{ artefactId: string }>();
  const [apiHandler, setApiHandler] = useState<Api | undefined>();
  const fetch = useCallback(
    (id: LocalId) => apiHandler?.fetch(id),
    [apiHandler],
  );
  const artefact = useQuery({
    queryKey: [artefactId],
    queryFn: () => fetch(artefactId),
    staleTime: apiHandler?.staleTime,
    gcTime: apiHandler?.garbageCollectionTime,
    enabled: !!apiHandler,
  });

  useEffect(() => {
    if (vaApi.isHandled(artefactId)) {
      setApiHandler(vaApi);
    } else if (metApi.isHandled(artefactId)) {
      setApiHandler(metApi);
    } else {
      throw new Error("No matching API found");
    }
  }, [artefactId]);

  if (!artefact.isSuccess) return <p>Loading...</p>;
  if (artefact.isError)
    return (
      <p>Sorry, we couldn't find that artefact. Perhaps it's been removed.</p>
    );

  if (artefact.data) {
    const {
      objectDate,
      accessionNumber,
      images,
      objectType,
      maker,
      provenance,
      currentLocation,
      apiSource,
    } = artefact.data;

    return (
      <>
        <Stack.Screen options={{ title: artefact.data.title }} />
        <ScrollView>
          {objectDate && <p>{objectDate}</p>}
          <p>Accession Number: {accessionNumber}</p>
          <img src={images.primaryImage} alt="" />
          <p>Object Type: {objectType}</p>
          {maker && <p>Maker: {maker}</p>}
          {provenance && <p>Provenance: {provenance}</p>}
          <p>Current location: {currentLocation}</p>
          <p>API source: {apiSource}</p>
        </ScrollView>
      </>
    );
  }
}
