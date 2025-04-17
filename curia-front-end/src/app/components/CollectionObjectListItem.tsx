import React from "react";
import Artefact from "../../types/Artefact.interface";

interface Props {
  item: Artefact;
}

export default function CollectionObjectListItem({ item }: Props) {
  const {
    title,
    maker,
    objectDate,
    images: { primaryThumbnailUrl },
    apiSource,
  } = item;

  return (
    <div role="listitem">
      <h3>{title}</h3>
      <p>
        {maker && maker + ", "}
        {objectDate}
      </p>
      <img src={primaryThumbnailUrl} alt="" />
      <p>Source: {apiSource}</p>
    </div>
  );
}
