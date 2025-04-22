import axios from "axios";
import { Api, Artefact, SearchFnReturn, LocalId } from "./api.class";

const name = "V&A API";
const slug = "va";

const MAX_RESULTS_LIMIT = 100;
const DEFAULT_TITLE = "Untitled";

type RecordId = string;

interface FetchResponse {
  meta: {
    _links: {
      collection_page: {
        href: string;
      };
    };
    images: {
      _primary_thumbnail: string;
      _iiif_image: string;
      _alt_iiif_image: string[];
      _images_meta: {
        assetRef: string;
        copyright: string;
        sensitiveImage: boolean;
      }[];
    };
  };
  record: {
    systemNumber: string;
    accessionNumber: string;
    objectType: string;
    titles: [
      {
        title: string;
        type: string;
      },
    ];
    physicalDescription: string;
    artistMakerPerson: {
      name: {
        text: string;
      };
      note: "";
    }[];
    artistMakerOrganisations: {
      name: {
        text: string;
        id: string;
      };
      association: {
        text: string;
        id: string;
      };
      note: string;
    }[];
    artistMakerPeople: unknown[];
    materials: [
      {
        text: string;
      },
    ];
    techniques: {
      text: string;
    }[];
    materialsAndTechniques: string;
    images: string[];
    galleryLocations: {
      current: {
        text: string;
      };
    }[];
    placesOfOrigin: {
      place: {
        text: string;
      };
      association: {
        text: string;
      };
      note: string;
    }[];
    productionDates: {
      date: {
        text: string;
        earliest: string;
        latest: string;
      };
      association: {
        text: string;
      };
      note: string;
    }[];
    creditLine: string;
    dimensions: unknown[];
    marksAndInscriptions: unknown[];
    objectHistory: string;
    historicalContext: string;
    briefDescription: string;
    production: string;
    contentDescription: string;
    galleryLabels: {
      text: string;
      date: {
        text: string;
        earliest: string;
        latest: string;
      };
    }[];
    recordModificationDate: string;
  };
}

interface SearchRecord {
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
  records: SearchRecord[];
}

async function fetch(this: Api, localId: LocalId): Promise<Artefact> {
  if (!this.isHandled(localId)) {
    throw new Error("Incorrect API for localId");
  }
  const remoteId = this.remoteIdFrom(localId);
  return axios
    .get<FetchResponse>(`https://api.vam.ac.uk/v2/object/${remoteId}`)
    .then(({ data: { record, meta } }) => {
      const {
        systemNumber,
        accessionNumber,
        objectType,
        titles,
        artistMakerPerson,
        artistMakerOrganisations,
        galleryLabels,
        galleryLocations,
        placesOfOrigin,
      } = record;
      const { images } = meta;
      const result: Artefact = {
        localId: slug + systemNumber,
        accessionNumber,
        objectType,
        title: titles[0]?.title || DEFAULT_TITLE,
        maker:
          artistMakerPerson[0]?.name?.text ??
          artistMakerOrganisations[0]?.name?.text ??
          "Unknown",
        objectDate: galleryLabels[0]?.date?.text,
        images: {
          primaryThumbnailUrl: images._primary_thumbnail,
          primaryImage: images._primary_thumbnail,
        },
        currentLocation: `${galleryLocations[0].current.text} - V&A`,
        provenance: placesOfOrigin[0]?.place.text,
        apiSource: name,
      };
      return result;
    })
    .catch(() => {
      throw new Error("API error - V&A");
    });
}

async function search(
  this: Api,
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
          const titleA =
            a._primaryTitle === "" ? DEFAULT_TITLE : a._primaryTitle;
          const titleB =
            b._primaryTitle === "" ? DEFAULT_TITLE : b._primaryTitle;
          if (titleA < titleB) return -1;
          if (titleA > titleB) return 1;
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
            localId: this.localIdFrom(systemNumber),
            accessionNumber,
            objectType,
            title: _primaryTitle === "" ? DEFAULT_TITLE : _primaryTitle,
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

const vaApi = new Api(name, slug, fetch, search);

export { vaApi, SearchFnReturn };
