import { HydratedDocument } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { LocalId } from "src/types";

export type ExhibitionDocument = HydratedDocument<Exhibition>;

@Schema()
export class Exhibition {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  artefacts: LocalId[];
}

export const ExhibitionSchema = SchemaFactory.createForClass(Exhibition);
