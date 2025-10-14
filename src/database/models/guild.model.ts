import type { InferSchemaType } from 'mongoose';
import { model, Schema } from 'mongoose';

const GuildSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    prefix: {
      type: String,
      required: true,
      default: '!'
    }
  },
  {
    _id: false,
    versionKey: false,
    timestamps: true
  }
);

// Infer the TypeScript type from the schema
export type Guild = InferSchemaType<typeof GuildSchema>;

export const GuildModel = model<Guild>('guilds', GuildSchema);
