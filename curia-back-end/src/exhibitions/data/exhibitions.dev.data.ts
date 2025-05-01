import { CreateExhibitionReqDto } from "../dto/create-exhibition.dto";

export const exhibitions: {
  username: string;
  exhibition: CreateExhibitionReqDto;
}[] = [
  {
    username: "Steve",
    exhibition: {
      title: "A journey through time",
      options: {
        description: "description",
        artefacts: ["vaO1363383", "met7985"],
      },
    },
  },
  {
    username: "Steve",
    exhibition: {
      title: "Mold and metal",
      options: { description: "description" },
    },
  },
];
