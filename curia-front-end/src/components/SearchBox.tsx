import debounce from "lodash.debounce";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { StyleSheet, TextInput } from "react-native";

interface Props {
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

export default function SearchBox({ setSearchTerm }: Props) {
  const [searchBoxText, setSearchBoxText] = useState("");
  const debouncedSearch = useCallback(
    debounce((input: string) => setSearchTerm(input), 300),
    [setSearchTerm],
  );

  useEffect(() => {
    debouncedSearch(searchBoxText);
  }, [searchBoxText]);

  return (
    <TextInput
      value={searchBoxText}
      onChangeText={setSearchBoxText}
      style={styles.searchInput}
    ></TextInput>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: "gray",
  },
});
