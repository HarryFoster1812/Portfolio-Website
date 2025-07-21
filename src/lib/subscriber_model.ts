import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now },
    confirmed: { type: Boolean, default: false },
    confirmationToken: { type: String },
});

export const Subscriber = mongoose.models?.Subscriber || mongoose.model('Subscriber', subscriberSchema);
