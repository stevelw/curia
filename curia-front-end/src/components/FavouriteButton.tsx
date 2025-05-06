import { LocalId } from "../apis/api.class";
import { Button } from "react-native";
import { useCallback, useContext } from "react";
import { addToFavourites, removeFromFavourites } from "../apis/backEnd.api";
import { SessionContext } from "../contexts/session.context";
import { destroy, flag } from "./colours";
interface Props {
  localId: LocalId;
}

export default function FavouriteButton({ localId }: Props) {
  const [session, setSession] = useContext(SessionContext);

  const handleAddFavourite = useCallback(() => {
    const favourite = async () => {
      const cachedFavourites = await addToFavourites(
        session.accessToken,
        localId,
      );
      setSession((prev) => ({ ...prev, cachedFavourites }));
    };
    void favourite();
  }, [setSession, localId, session.accessToken]);

  const handleRemoveFavourite = useCallback(() => {
    const favourite = async () => {
      const cachedFavourites = await removeFromFavourites(
        session.accessToken,
        localId,
      );
      setSession((prev) => ({ ...prev, cachedFavourites }));
    };
    void favourite();
  }, [setSession, localId, session.accessToken]);

  if (!session.accessToken) return <> </>;

  if (session.cachedFavourites?.includes(localId)) {
    return (
      <Button
        title="Unfavourite"
        color={destroy}
        onPress={handleRemoveFavourite}
      />
    );
  } else {
    return (
      <Button title="Favourite" color={flag} onPress={handleAddFavourite} />
    );
  }
}
