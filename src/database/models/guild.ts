import { Schema, model } from "mongoose";

const GuildSchema = new Schema<Guild>(
  {
    _id: {
      type: String,
      required: true,
    },
    prefix: {
      type: String,
      default: "!",
    },
  },
  {
    _id: false,
    versionKey: false,
    timestamps: true,
  }
);

const GuildModel = model<Guild>("guilds", GuildSchema);

let c = new GuildModel({});

export { GuildModel };
