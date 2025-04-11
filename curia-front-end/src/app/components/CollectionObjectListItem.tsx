import React from "react";
import Artefact from "../../types/Artefact.interface";

interface Props {
  item: Artefact;
}

export default function CollectionObjectListItem({ item }: Props) {
  const { title, apiSource } = item;

  return (
    <div>
      <h3>{title}</h3>
      <p>Source: {apiSource}</p>
    </div>
  );
}
