export default interface Artefact {
  localId: string;
  accessionNumber: string;
  objectType: string;
  title: string;
  maker?: string;
  objectDate: string;
  images: {
    primaryThumbnailUrl: string;
    primaryImage: string;
    iiif_image_base_url?: string;
    additionalImages: string[];
  };
  currentLocation: string;
  provenance: string;
  apiSource: string;
}
