import { HydratedDocument, Types } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { LocalId } from "src/types";

export type UserDocument = HydratedDocument<PrivateUser>;
export type Favourites = string[];

@Schema()
export class PrivateUser {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  hashedPassword: string;

  @Prop()
  favourites: LocalId[];

  @Prop()
  exhibitions: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(PrivateUser);
