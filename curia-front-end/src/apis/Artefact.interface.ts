export type LocalId = string;

export default interface Artefact {
  localId: LocalId;
  accessionNumber: string;
  objectType: string;
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
