import { LocalId } from "../apis/api.class";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MouseEventHandler, useCallback, useContext } from "react";
import { addToFavourites, removeFromFavourites } from "../apis/backEnd.api";
import { SessionContext } from "../contexts/session.context";
interface Props {
  localId: LocalId;
}

export default function FavouriteButton({ localId }: Props) {
  const [session, setSession] = useContext(SessionContext);

  const handleAddFavourite = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();
      const favourite = async () => {
        const cachedFavourites = await addToFavourites(
          session.accessToken,
          localId,
        );
        setSession((prev) => ({ ...prev, cachedFavourites }));
      };
      void favourite();
    },
    [setSession, localId, session.accessToken],
  );

  const handleRemoveFavourite = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();
      const favourite = async () => {
        const cachedFavourites = await removeFromFavourites(
          session.accessToken,
          localId,
        );
        setSession((prev) => ({ ...prev, cachedFavourites }));
      };
      void favourite();
    },
    [setSession, localId, session.accessToken],
  );

  if (!session.accessToken) return <> </>;

  return (
    <TouchableOpacity>
      <button
        onClick={
          session.cachedFavourites?.includes(localId)
            ? handleRemoveFavourite
            : handleAddFavourite
        }
        style={
          session.cachedFavourites?.includes(localId)
            ? styles.isFavourited
            : styles.isNotFavourited
        }
      >
        {session.cachedFavourites?.includes(localId)
          ? "Unfavourite"
          : "Favourite"}
      </button>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  isFavourited: { backgroundColor: "red" },
  isNotFavourited: { backgroundColor: "gold" },
});
