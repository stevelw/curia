import axios from "axios";
import { Api, Artefact, SearchFnReturn } from "./api.class";

const name = "V&A API";
const slug = "va";
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

async function search(
  searchTerm: string,
  maxResults: number,
): Promise<SearchFnReturn> {
  return axios
    .get<SearchResponse>("https://api.vam.ac.uk/v2/objects/search", {
      params: { q: searchTerm, page_size: MAX_RESULTS_LIMIT, page: 1 },
    })
    .then(({ data: { records } }) => {
      const totalResultsAvailable = records.length;
      const results = records
        .sort((a, b) => {
          if (a._primaryTitle < b._primaryTitle) return -1;
          if (a._primaryTitle > b._primaryTitle) return 1;
          return 0;
        })
        .slice(0, maxResults)
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
      return {
        totalResultsAvailable,
        results,
      };
    })
    .catch(() => {
      throw new Error("API error - V&A");
    });
}

const vaApi = new Api(name, search);

export { vaApi, SearchFnReturn };
