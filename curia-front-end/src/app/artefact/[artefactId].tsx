import { ScrollView, StyleSheet } from "react-native";
import Artefact, { LocalId } from "@/src/apis/Artefact.interface";
import { Stack, useLocalSearchParams } from "expo-router";
import { vaApi } from "@/src/apis/va.api";
import { metApi } from "@/src/apis/met.api";
import { useQuery } from "@tanstack/react-query";

const fetchArtefact = async (artefactId: LocalId): Promise<Artefact> => {
  if (artefactId.match(new RegExp(`^${vaApi.slug}`))) {
    const result: Artefact = await vaApi.fetch(artefactId);
    return result;
  }
  if (artefactId.match(new RegExp(`^${metApi.slug}`)))
    return metApi.fetch(artefactId);
  throw new Error("No matching API found");
};

export default function ArtefactDetails() {
  const { artefactId } = useLocalSearchParams<{ artefactId: string }>();
  const artefact = useQuery({
    queryKey: [artefactId],
    queryFn: () => fetchArtefact(artefactId),
  });

  if (!artefact.isSuccess) return <p>Loading...</p>;

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

const styles = StyleSheet.create({});

// export default interface Artefact {
//   apiSource: string;
// }
