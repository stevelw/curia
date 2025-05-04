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
    <View>
      <TextInput onChangeText={debouncedSearch} style={styles.searchInput} />
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: "gray",
  },
});
