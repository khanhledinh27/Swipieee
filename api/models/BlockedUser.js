/*import mongoose from "mongoose";

const blockedUserSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    blockedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String },
    blockedAt: { type: Date, required: true,default: Date.now },
    expiresAt: { type: Date },
    isPermanent: { type: Boolean, default: false }
}, { timestamps: true });

// Index để tối ưu việc tìm kiếm
blockedUserSchema.index({ user: 1, blockedUser: 1 }, { unique: true });

// Middleware để kiểm tra tính hợp lệ của thời gian chặn
blockedUserSchema.pre('save', function(next) {
    if (this.isPermanent) {
        this.expiresAt = undefined;
    } else if (!this.expiresAt) {
        // Nếu không phải chặn vĩnh viễn và không có thời gian hết hạn
        // Mặc định chặn trong 30 ngày
        this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
    next();
});

const BlockedUser = mongoose.model("BlockedUser", blockedUserSchema);

export default BlockedUser; */