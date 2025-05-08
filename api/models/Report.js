/*import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true, enum: ['fake', 'inappropriate', 'harassment', 'other'] },
    description: { type: String, required: true },
    status: { type: String, required: true, enum: ['pending', 'reviewed', 'resolved'],default: 'pending'},
}, { timestamps: true });

// Middleware để tự động cập nhật resolvedAt khi report được giải quyết
reportSchema.pre('findOneAndUpdate', function(next) {
    if (this._update.$set && this._update.$set.status === 'resolved') {
        this._update.$set.resolvedAt = new Date();
    }
    next();
});

const Report = mongoose.model("Report", reportSchema);

export default Report; */