/*import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, enum: ['match', 'message', 'like', 'system'] },
    content: { type: String, required: true },
}, { timestamps: true });

// Middleware để tự động cập nhật readAt khi notification được đánh dấu là đã đọc
notificationSchema.pre('findOneAndUpdate', function(next) {
    if (this._update.$set && this._update.$set.read === true) {
        this._update.$set.readAt = new Date();
    }
    next();
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification; */