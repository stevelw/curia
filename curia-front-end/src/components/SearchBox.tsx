import { Dispatch, SetStateAction } from "react";
import { StyleSheet, TextInput } from "react-native";

interface Props {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

export default function SearchBox({ searchTerm, setSearchTerm }: Props) {
  return (
    <TextInput
      value={searchTerm}
      onChangeText={setSearchTerm}
      style={styles.searchInput}
    ></TextInput>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: "gray",
  },
});
