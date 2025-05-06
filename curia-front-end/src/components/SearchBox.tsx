import debounce from "lodash.debounce";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface Props {
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

export default function SearchBox({ setSearchTerm }: Props) {
  const handleChange = useCallback(
    (text: string) => {
      setSearchTerm(text);
    },
    [setSearchTerm],
  );

  const debouncedSearch = useMemo(
    () => debounce(handleChange, 300),
    [handleChange],
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  return (
    <View style={styles.searchInput__frame}>
      <TextInput
        aria-label="Search"
        style={styles.searchInput}
        onChangeText={debouncedSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput__frame: {
    borderRadius: 5,
    height: "100%",
    shadowColor: "grey",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    marginStart: 10,
  },
  searchInput: {
    height: "100%",
    paddingStart: 10,
  },
});
