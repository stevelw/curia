import axios from "axios";
import Artefact from "../types/Artefact.interface";

export const name = "V&A API";
export const slug = "va";

const MAX_RESULTS_LIMIT = 100;

type RecordId = string;

interface Record {
  systemNumber: RecordId;
  accessionNumber: string;
  objectType: string;
  _currentLocation: {
    displayName: string;
    site: string;
    onDisplay: boolean;
  };
  _primaryTitle: string;
  _primaryMaker: {
    name: string;
    association: string;
  };
  _primaryImageId: string;
  _primaryDate: string;
  _primaryPlace: string;
  _images: {
    _primary_thumbnail: string;
    _iiif_image_base_url: string;
  };
}

interface SearchResponse {
  info: {
    record_count: number;
    page_size: number;
    pages: number;
    page: number;
    image_count: number;
  };
  records: Record[];
}

export function search(searchTerm: string): Promise<Artefact[]> {
  return axios
    .get<SearchResponse>("https://api.vam.ac.uk/v2/objects/search", {
      params: { q: searchTerm, page_size: 100, page: 1 },
    })
    .then(({ data }) => {
      return data.records
        .slice(0, MAX_RESULTS_LIMIT)
        .map<Artefact>(
          ({
            systemNumber,
            accessionNumber,
            objectType,
            _currentLocation,
            _primaryTitle,
            _primaryMaker,
            _primaryImageId,
            _primaryDate,
            _primaryPlace,
            _images,
          }) => ({
            localId: slug + systemNumber,
            accessionNumber,
            objectType,
            title: _primaryTitle,
            objectDate: _primaryDate,
            maker: _primaryMaker.name + ", " + _primaryMaker.association,
            images: {
              primaryThumbnailUrl: _images._primary_thumbnail,
              primaryImage: _primaryImageId,
              iiif_image_base_url:
                _images._iiif_image_base_url + _primaryImageId,
              additionalImages: [_images._iiif_image_base_url],
            },
            currentLocation:
              _currentLocation.site +
              " - " +
              _currentLocation.displayName +
              (_currentLocation.onDisplay
                ? " (On display)"
                : " (Not on display)"),
            provenance: _primaryPlace,
            apiSource: name,
          }),
        );
    })
    .catch(() => {
      throw new Error("API error - V&A");
    });
}
