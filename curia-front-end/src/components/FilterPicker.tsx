import { StyleSheet, View } from "react-native";
import { ObjectType } from "../apis/Artefact.interface";
import { Dispatch, SetStateAction, useCallback } from "react";

export interface FilterOptions {
  objectType: { valid: ObjectType[]; selected: ObjectType[] };
  currentLocation: { valid: string[]; selected: string[] };
  api: { valid: string[]; selected: string[] };
}

interface Props {
  filterOptions: FilterOptions;
  setFilterOptions: Dispatch<SetStateAction<FilterOptions>>;
}

export default function FilterPicker({
  filterOptions,
  setFilterOptions,
}: Props) {
  const handleCheckboxChange = useCallback(
    (filterKey: string, option: string, checked: boolean) => {
      setFilterOptions((prev) => {
        const next = structuredClone(prev);
        if (
          checked &&
          !next[filterKey as keyof typeof next].selected.includes(option)
        ) {
          next[filterKey as keyof typeof next].selected.push(option);
        } else if (
          !checked &&
          next[filterKey as keyof typeof next].selected.includes(option)
        ) {
          next[filterKey as keyof typeof next].selected.splice(
            next[filterKey as keyof typeof next].selected.indexOf(option),
            1,
          );
        }
        return next;
      });
    },
    [setFilterOptions],
  );

  const isChecked = useCallback(
    (filterKey: string, option: string): boolean =>
      filterOptions[filterKey as keyof typeof filterOptions].selected.includes(
        option,
      ),
    [filterOptions],
  );

  return (
    <View style={styles.picker}>
      {Object.keys(filterOptions).map((filterKey) => (
        <View key={filterKey}>
          <label htmlFor={filterKey}>
            Filter by{" "}
            {filterKey === "objectType"
              ? "object type"
              : filterKey === "currentLocation"
                ? "current location"
                : filterKey === "api"
                  ? "Data source"
                  : ""}
          </label>
          {filterOptions[filterKey as keyof typeof filterOptions].valid.map(
            (option) => {
              return (
                <View key={option}>
                  <label htmlFor={option}>{option}</label>
                  <input
                    type="checkbox"
                    id={option}
                    name={option}
                    value={option}
                    onChange={({ target: { checked } }) => {
                      handleCheckboxChange(filterKey, option, checked);
                    }}
                    checked={isChecked(filterKey, option)}
                  />
                </View>
              );
            },
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    display: "flex",
    width: "100%",
    justifyContent: "space-evenly",
    flexDirection: "column",
  },
});
