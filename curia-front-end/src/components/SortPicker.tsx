import { Dispatch, SetStateAction } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SortOptions } from "../apis/api.class";
import { action } from "./colours";

interface Props {
  sortBy: SortOptions;
  setSortBy: Dispatch<SetStateAction<SortOptions>>;
}

export default function SortPicker({ sortBy, setSortBy }: Props) {
  return (
    <View style={styles.flexRow}>
      <Text style={styles.picker__label}>Sort by:</Text>
      <View style={styles.flexRow}>
        {Object.keys(SortOptions).map((key) => (
          <Button
            key={key}
            color={action}
            title={SortOptions[key as keyof typeof SortOptions]}
            disabled={SortOptions[key as keyof typeof SortOptions] === sortBy}
            onPress={() =>
              setSortBy(SortOptions[key as keyof typeof SortOptions])
            }
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  picker__label: {
    flexGrow: 1,
    textAlign: "right",
  },
});
