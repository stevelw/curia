import { ScrollView } from "react-native";
import Artefact, { LocalId } from "../../apis/Artefact.interface";
import { Stack, useLocalSearchParams } from "expo-router";
import { vaApi } from "../../apis/va.api";
import { metApi } from "../../apis/met.api";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../apis/api.class";

const fetchArtefact = async (artefactId: LocalId): Promise<Artefact> => {
  let handler: Api | undefined;
  if (vaApi.isHandled(artefactId)) {
    handler = vaApi;
  } else if (metApi.isHandled(artefactId)) {
    handler = metApi;
  }

  if (handler) return handler.fetch(artefactId);

  throw new Error("No matching API found");
};

export default function ArtefactDetails() {
  const { artefactId } = useLocalSearchParams<{ artefactId: string }>();
  const artefact = useQuery({
    queryKey: [artefactId],
    queryFn: () => fetchArtefact(artefactId),
  });

  if (!artefact.isSuccess) return <p>Loading...</p>;
  if (artefact.isError)
    return (
      <p>Sorry, we couldn't find that artefact. Perhaps it's been removed.</p>
    );

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
