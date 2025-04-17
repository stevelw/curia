import { StyleSheet } from "react-native";
import SearchResults from "./components/SearchResults";

export default function App() {
  return (
    <>
      <h1 style={styles.h1}>Curia</h1>
      <SearchResults />
    </>
  );
}

const styles = StyleSheet.create({
  h1: {
    padding: 10,
  },
});
