import { CreateExhibitionReqDto } from "../dto/create-exhibition.dto";

export const exhibitions: {
  username: string;
  exhibition: CreateExhibitionReqDto;
}[] = [
  {
    username: "user1",
    exhibition: {
      title: "exhibition1",
      options: {
        description: "description",
        artefacts: ["vaO1363383", "met7985"],
      },
    },
  },
  {
    username: "exhibition2",
    exhibition: {
      title: "title",
      options: { description: "description" },
    },
  },
];
