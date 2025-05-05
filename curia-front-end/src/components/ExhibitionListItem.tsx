import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { GetExhibitionResDto } from "../interfaces/get-exhibition.interface";

interface Props {
  item: GetExhibitionResDto;
}

export default function ExhibitionListItem({ item }: Props) {
  const { _id, title, description } = item;

  const router = useRouter();

  return (
    <Pressable onPress={() => router.push(`/exhibitions/${_id}`)}>
      <View role="listitem" style={styles.listItem}>
        <h3>{title}</h3>
        <p>{description}</p>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listItem: {
    margin: 10,
    padding: 10,
    borderColor: "grey",
    borderWidth: 1,
    borderStyle: "solid",
  },
});
