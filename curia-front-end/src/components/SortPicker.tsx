import { Dispatch, SetStateAction } from "react";
import { Button, StyleSheet, View } from "react-native";
import { SortOptions } from "../apis/api.class";

interface Props {
  sortBy: SortOptions;
  setSortBy: Dispatch<SetStateAction<SortOptions>>;
}

export default function SortPicker({ sortBy, setSortBy }: Props) {
  return (
    <View style={styles.picker}>
      {Object.keys(SortOptions).map((key) => (
        <Button
          key={key}
          title={SortOptions[key as keyof typeof SortOptions]}
          disabled={SortOptions[key as keyof typeof SortOptions] === sortBy}
          onPress={() =>
            setSortBy(SortOptions[key as keyof typeof SortOptions])
          }
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    display: "flex",
    width: "100%",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
});
