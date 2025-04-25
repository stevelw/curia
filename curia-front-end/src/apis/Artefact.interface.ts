export type LocalId = string;
export type ObjectType = string;

export default interface Artefact {
  localId: LocalId;
  accessionNumber: string;
  objectType: ObjectType;
  title: string;
  maker: string;
  objectDate?: string;
  images: {
    primaryThumbnailUrl: string;
    primaryImage?: string;
  };
  currentLocation: string;
  provenance?: string;
  apiSource: string;
}
