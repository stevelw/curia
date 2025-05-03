import { LocalId } from "../apis/api.class";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useCallback, useContext, useState } from "react";
import { addToExhibition } from "../apis/backEnd.api";
import { SessionContext } from "../contexts/session.context";
import { ExhibitionId } from "../interfaces/get-exhibitions.interface";
interface Props {
  artefactId: LocalId;
}

export default function AddToExhibitionDropdown({ artefactId }: Props) {
  const [session, setSession] = useContext(SessionContext);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const UserExhibitionsNotIncludingArtefact = useCallback(
    (artefactId: LocalId) => {
      return session.cachedExhibitions?.filter(
        ({ artefacts }) => !artefacts?.includes(artefactId),
      );
    },
    [session.cachedExhibitions],
  );

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const handleAddToExhibition = useCallback<
    (exhibitionId: ExhibitionId) => void
  >(
    (exhibitionId) => {
      const add = async () => {
        await addToExhibition(session.accessToken, exhibitionId, artefactId);
        const cachedExhibitions = session.cachedExhibitions;
        cachedExhibitions
          ?.find(({ _id }) => _id === exhibitionId)
          ?.artefacts?.push(artefactId);
        setSession((prev) => ({
          ...prev,
          cachedExhibitions,
        }));
      };
      void add();
    },
    [artefactId, session.accessToken, session.cachedExhibitions, setSession],
  );

  if (!session.accessToken || !UserExhibitionsNotIncludingArtefact(artefactId))
    return <> </>;

  return (
    <>
      <TouchableOpacity>
        <Text onPress={toggleDropdown}>Add to exhibition</Text>
      </TouchableOpacity>
      {isDropdownVisible && (
        <FlatList
          style={styles.dropdown}
          data={UserExhibitionsNotIncludingArtefact(artefactId)}
          keyExtractor={({ _id }) => _id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity>
                <Text onPress={() => handleAddToExhibition(item._id)}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  dropdown: { height: "100%" },
});
