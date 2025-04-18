import { StyleSheet, View } from "react-native";
import SearchResults from "../components/SearchResults";

export default function Index() {
  return <SearchResults />;
}

const styles = StyleSheet.create({
  h1: {
    padding: 10,
  },
});
