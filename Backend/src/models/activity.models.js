import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',

    },

    // New field to capture the type of activity
    action: {
        type: String,
        enum: ['view', 'add_to_cart', 'purchase', "search","category_visit"],
    },
    searchKeyword: String,
    category: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Activity = mongoose.model('Activity', activitySchema);

export {Activity}