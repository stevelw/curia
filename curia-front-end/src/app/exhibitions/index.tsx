import { fetchAllExhibitions } from "@/src/apis/backEnd.api";
import ExhibitionListItem from "@/src/components/ExhibitionListItem";
import { SessionContext } from "@/src/contexts/session.context";
import { GetExhibitionResDto } from "@/src/interfaces/get-exhibition.interface";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { Button, SectionList, SectionListData, View } from "react-native";

const MAX_TO_RENDER_PER_BATCH = 10; // 10
const UPDATE_CELLS_BATCH_PERIOD = 50; // 50
const INITIAL_NUM_TO_RENDER = 20; // 10
const WINDOW_SIZE = 5; // 21

export default function Index() {
  const [session] = useContext(SessionContext);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [exhibitionsSections, setExhibitionsSections] = useState<
    SectionListData<GetExhibitionResDto>[]
  >([]);

  const isOwner = useCallback(
    (exhibition: GetExhibitionResDto) => {
      return session.cachedExhibitions?.find(
        ({ _id }) => _id === exhibition._id,
      );
    },
    [session.cachedExhibitions],
  );

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      setError("");

      fetchAllExhibitions()
        .then((returnedExhibitions) => {
          const usersExhibitions = returnedExhibitions.filter((exhibition) =>
            isOwner(exhibition),
          );
          const otherExhibitions = returnedExhibitions.filter(
            (exhibition) => !isOwner(exhibition),
          );
          setExhibitionsSections([
            { title: "My Exhibitions", data: usersExhibitions },
            { title: "Public Exhibitions", data: otherExhibitions },
          ]);
          setIsLoading(false);
        })
        .catch((err) => {
          setError((err as Error).message);
        });
    }, [isOwner]),
  );

  return (
    <View>
      {session.accessToken && (
        <Button
          title="Create an exhibition"
          onPress={() => router.navigate("/exhibitions/new")}
        />
      )}
      {error && <p>{error}</p>}
      {isLoading && !error ? (
        <p>Loading...</p>
      ) : (
        <SectionList
          sections={exhibitionsSections}
          keyExtractor={(item) => item._id}
          maxToRenderPerBatch={MAX_TO_RENDER_PER_BATCH}
          updateCellsBatchingPeriod={UPDATE_CELLS_BATCH_PERIOD}
          initialNumToRender={INITIAL_NUM_TO_RENDER}
          windowSize={WINDOW_SIZE}
          renderItem={({ item }) => <ExhibitionListItem item={item} />}
          renderSectionHeader={
            session.cachedExhibitions
              ? ({ section }) => <h2>{section.title}</h2>
              : undefined
          }
        />
      )}
    </View>
  );
}
