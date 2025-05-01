import { SessionContext } from "@/src/contexts/session.context";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Button } from "react-native";

export default function Index() {
  const [session] = useContext(SessionContext);
  const router = useRouter();

  return (
    <>
      {session.accessToken && (
        <Button
          title="Create an exhibition"
          onPress={() => router.navigate("/exhibitions/new")}
        />
      )}
      <p>EXHIBITIONS LIST</p>
    </>
  );
}
