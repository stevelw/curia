import { Button, StyleSheet, View } from "react-native";

interface Props {
  currentPage: number;
  setPageCbFn: (page: number) => void;
  numOfPages: number;
}

export default function PagePicker({
  currentPage,
  setPageCbFn,
  numOfPages,
}: Props) {
  return (
    <View style={styles.picker}>
      <Button
        title="Previous"
        onPress={() => setPageCbFn(currentPage - 1)}
        disabled={currentPage < 2}
      />
      {[...Array(numOfPages).keys()].map((index) => {
        const pageNumber = index + 1;
        return (
          <Button
            key={pageNumber}
            title={pageNumber.toString()}
            onPress={() => setPageCbFn(pageNumber)}
            disabled={pageNumber === currentPage}
          />
        );
      })}
      <Button
        title="Next"
        onPress={() => setPageCbFn(currentPage + 1)}
        disabled={currentPage >= numOfPages}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: "100%",
    margin: 5,
    gap: 5,
  },
});
