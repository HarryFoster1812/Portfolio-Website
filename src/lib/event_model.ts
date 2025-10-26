import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IEvent extends Document {
  ts: Date;
  path: string;
  vid: string;
  cc: string;
  client: string;
  ref?: string;
}

const EventSchema = new Schema<IEvent>(
  {
    ts:        { type: Date, default: Date.now, immutable: true },
    path:      { type: String, required: true, trim: true, maxlength: 512 },
    vid:       { type: String, required: true, match: /^[a-f0-9]{16}$/i, index: true },
    cc:        { type: String, required: true, match: /^(?:[A-Z]{2}|ZZ)$/ },
    client:    { type: String, required: true, maxlength: 64, trim: true },
    ref:       { type: String, default: '', maxlength: 255, trim: true },
  },
  { versionKey: false, timestamps: false }
);

EventSchema.index({ ts: -1 });
EventSchema.index({ path: 1, ts: -1 });

export const EventModel: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
