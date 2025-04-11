import React, { useEffect, useState } from "react";
import { Artefact } from "../../apis/aggregated.api";
import { title } from "process";

interface Props {
  item: Artefact;
}

export default function CollectionObjectListItem({ item }: Props) {
  const [updatedItem, setUpdatedItem] = useState<Artefact | undefined>(
    undefined,
  );

  useEffect(() => {
    item.lazyLoading?.();
    setUpdatedItem({ title: "fetch test", apiSource: "MET" });
    // item
    //   .lazyLoading?.()
    //   .then((fetchedItem) => setUpdatedItem(fetchedItem))
    //   .catch(() => {
    //     throw new Error("Error doing lazy fetch");
    //   });
  }, [item]);

  return (
    <div>
      <h3>{updatedItem ? updatedItem.title : item.title}</h3>
      <p>Source: {updatedItem ? updatedItem.apiSource : item.apiSource}</p>
    </div>
  );
}
