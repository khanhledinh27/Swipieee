/*import mongoose from "mongoose";

const matchPreferencesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ageRangePreference: {
        min: { 
            type: Number, 
            required: true,
            min: 18 
        },
        max: { 
            type: Number, 
            required: true,
            min: 18 
        }
},
    locationPreference: { type: String },
    hobbies: [{ type: String }],
    distance: { type: Number,min: 1,max: 100,default: 50 },
}, { timestamps: true });

// Middleware để tự động cập nhật lastUpdated
matchPreferencesSchema.pre('save', function(next) {
    this.lastUpdated = new Date();
    next();
});

matchPreferencesSchema.pre('findOneAndUpdate', function(next) {
    this.set({ lastUpdated: new Date() });
    next();
});

// Validation để đảm bảo min age không lớn hơn max age
matchPreferencesSchema.pre('save', function(next) {
    if (this.preferredAgeRange.min > this.preferredAgeRange.max) {
        next(new Error('Minimum age cannot be greater than maximum age'));
    }
    next();
});

const MatchPreferences = mongoose.model("MatchPreferences", matchPreferencesSchema);

export default MatchPreferences;*/