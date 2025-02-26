import { model,Schema } from 'mongoose';

const GuildSchema = new Schema<Guild>(
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

const GuildModel = model<Guild>('guilds', GuildSchema);

export { GuildModel };
