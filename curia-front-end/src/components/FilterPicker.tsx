import { StyleSheet, View } from "react-native";
import { ObjectType } from "../apis/Artefact.interface";
import { Dispatch, SetStateAction, useCallback } from "react";
import { availableApis } from "../apis/gateway.api";

export interface FilterOptions {
  objectType: { valid: ObjectType[]; selected: ObjectType[] };
  currentLocation: { valid: string[]; selected: string[] };
  api: { valid: string[]; selected: string[] };
}

export const defaultFilterOptions: FilterOptions = {
  objectType: { valid: [], selected: [] },
  currentLocation: { valid: [], selected: [] },
  api: {
    valid: availableApis.map((api) => api.name).sort(),
    selected: availableApis.map((api) => api.name),
  },
};

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
    <View>
      {Object.keys(filterOptions).map((filterKey) => (
        <View key={filterKey}>
          <label style={styles.heading} htmlFor={filterKey}>
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
                <View key={option} style={styles.container}>
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
                  <label style={styles.label} htmlFor={option}>
                    {option}
                  </label>
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
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  heading: {
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 5,
    marginBottom: 5,
  },
  flex1: {
    flex: 1,
  },
  label: {
    flex: 1,
  },
});
