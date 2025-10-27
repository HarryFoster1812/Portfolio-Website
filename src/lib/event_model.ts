import mongoose from 'mongoose';


const EventSchema = new mongoose.Schema(
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

export const EventModel =
  mongoose.models.Event || mongoose.model('Event', EventSchema);
