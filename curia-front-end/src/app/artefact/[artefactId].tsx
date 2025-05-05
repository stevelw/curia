import { ScrollView, View } from "react-native";
import { LocalId } from "../../apis/Artefact.interface";
import { Stack, useLocalSearchParams } from "expo-router";
import { vaApi } from "../../apis/va.api";
import { metApi } from "../../apis/met.api";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../apis/api.class";
import { useCallback, useContext, useEffect, useState } from "react";
import { SessionContext } from "../../contexts/session.context";
import FavouriteButton from "../../components/FavouriteButton";
import AddToExhibitionDropdown from "../../components/AddToExhibitionDropdown";

export default function ArtefactDetails() {
  const [session] = useContext(SessionContext);
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

  if (!artefact.isSuccess)
    return (
      <View>
        <p>Loading...</p>;
      </View>
    );
  if (artefact.isError)
    return (
      <View>
        <p>Sorry, we couldn't find that artefact. Perhaps it's been removed.</p>
      </View>
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
      <View>
        <Stack.Screen options={{ title: artefact.data.title }} />
        {session.accessToken && (
          <>
            <FavouriteButton localId={artefact.data.localId} />
            <AddToExhibitionDropdown artefactId={artefactId} />
          </>
        )}
        <ScrollView>
          {objectDate && <p style={styles.margins}>Dated: {objectDate}</p>}
          <p style={styles.margins}>Accession Number: {accessionNumber}</p>
          <img src={images.primaryImage} alt="" />
          <p style={styles.margins}>Object Type: {objectType}</p>
          {maker && <p style={styles.margins}>Maker: {maker}</p>}
          {provenance && <p style={styles.margins}>Provenance: {provenance}</p>}
          <p style={styles.margins}>Current location: {currentLocation}</p>
          <p style={styles.margins}>API source: {apiSource}</p>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flexDirection: "column", flex: 1 },
  margins: { marginLeft: 10, marginTop: 5, marginBottom: 5 },
});
