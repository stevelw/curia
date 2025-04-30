import { HydratedDocument } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = HydratedDocument<PrivateUser>;
export type Favourites = string[];

@Schema()
export class PrivateUser {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  hashedPassword: string;

  @Prop()
  favourites: string[];
}

export const UserSchema = SchemaFactory.createForClass(PrivateUser);
