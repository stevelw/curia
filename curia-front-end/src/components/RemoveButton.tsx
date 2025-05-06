import { LocalId } from "../apis/api.class";
import { Button, GestureResponderEvent, TouchableOpacity } from "react-native";
import { useCallback, useContext } from "react";
import { removeFromExhibition } from "../apis/backEnd.api";
import { SessionContext } from "../contexts/session.context";
import { ExhibitionId } from "../interfaces/get-exhibition.interface";
import { useQueryClient } from "@tanstack/react-query";
import { destroy } from "./colours";
interface Props {
  exhibitionId: ExhibitionId;
  artefactId: LocalId;
}

export default function RemoveButton({ exhibitionId, artefactId }: Props) {
  const [session, setSession] = useContext(SessionContext);
  const queryClient = useQueryClient();

  const handleRemove = useCallback<
    (event: GestureResponderEvent) => void
  >(() => {
    const remove = async () => {
      const updatedExhibition = await removeFromExhibition(
        session.accessToken,
        exhibitionId,
        artefactId,
      );
      setSession((prev) => {
        if (!prev.cachedExhibitions) throw new Error("No cached exhibitions");
        const cachedExhibitions = prev.cachedExhibitions.map(
          (cachedExhibition) => {
            return cachedExhibition._id === updatedExhibition._id
              ? updatedExhibition
              : cachedExhibition;
          },
        );
        return { ...prev, cachedExhibitions };
      });
      await queryClient.invalidateQueries({ queryKey: [exhibitionId] });
    };
    void remove();
  }, [session.accessToken, exhibitionId, artefactId, setSession, queryClient]);

  const isOwned = session.cachedExhibitions?.find(
    ({ _id }) => _id === exhibitionId,
  );

  if (!isOwned) return <></>;

  return (
    <TouchableOpacity>
      <Button title="Remove" onPress={handleRemove} color={destroy} />
    </TouchableOpacity>
  );
}
