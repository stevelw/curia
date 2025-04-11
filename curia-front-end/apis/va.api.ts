import axios from "axios";
import { Artefact } from "./aggregated.api";

export const name = "V&A API";

interface Record {
  systemNumber: string;
  accessionNumber: string;
  objectType: string;
  _currentLocation: {
    id: string;
    displayName: string;
    type: string;
    site: string;
    onDisplay: boolean;
    detail: {
      free: string;
      case: string;
      shelf: string;
      box: string;
    };
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

type VenueId = string;

interface Venue {
  id: VenueId;
  value: string;
}

type GalleryId = string;

interface Gallery extends Venue {
  childTerms: {
    id: GalleryId;
    value: string;
  }[];
}

type CategoryId = string;

interface Category {
  id: CategoryId;
  value: string;
}

type ObjectTypeId = string;

interface ObjectType {
  id: ObjectTypeId;
  value: string;
}

type CollectionId = string;

interface Collection {
  id: CollectionId;
  value: string;
}

type PlaceId = string;

interface Place {
  id: PlaceId;
  value: string;
}

type StyleId = string;

interface Style {
  id: StyleId;
  value: string;
}

type MaterialId = string;

interface Material {
  id: MaterialId;
  value: string;
}

type TechniqueId = string;

interface Technique {
  id: TechniqueId;
  value: string;
}

type PersonId = string;

interface Person {
  id: PersonId;
  value: string;
}

type OrganisationId = string;

interface Organisation {
  id: OrganisationId;
  value: string;
}

interface Response {
  info: {
    record_count: number;
    page_size: number;
    pages: number;
    page: number;
    image_count: number;
  };
  records: Record[];
  clusters: {
    venue: {
      terms: Venue[];
    };
    gallery: {
      terms: Gallery[];
    };
    category: {
      terms: Category[];
    };
    object_type: {
      terms: ObjectType[];
    };
    collection: {
      terms: Collection[];
    };
    place: {
      terms: Place[];
    };
    style: {
      terms: Style[];
    };
    material: {
      terms: Material[];
    };
    technique: {
      other_terms_record_count: 5676;
      terms: Technique[];
    };
    person: {
      terms: Person[];
    };
    organisation: {
      terms: Organisation[];
    };
  };
}

export function search(searchTerm: string): Promise<Artefact[]> {
  return axios
    .get<Response>("https://api.vam.ac.uk/v2/objects/search", {
      params: { q: searchTerm, page_size: 100, page: 1 },
    })
    .then(({ data }) => {
      return data.records.map<Artefact>(({ _primaryTitle }) => ({
        Title: _primaryTitle,
      }));
    })
    .catch(() => {
      throw new Error("API error - V&A");
    });
}
