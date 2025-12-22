import mongoose from "mongoose";

const DimensionSchema = new mongoose.Schema({
    seatHeight: { type: Number, min: 0, required: true },
    seatBackHeight: { type: Number, min: 0, required: true },
    seatDepth: { type: Number, min: 0, required: true },
    backRestAngle: { type: Number, min: 0 },
    armWidth: { type: Number, min: 0 },
    armHeightFromSeating: { type: Number, min: 0 },
    armHeightFromFloor: { type: Number, min: 0 },
}, { _id: false });

const ProductDetailSchema = new mongoose.Schema({
    sizeCM: {
        type: String,
        required: true,
        trim: true
    },

    sizeIN: {
        type: String,
        required: true,
        trim: true
    },

    additionalSizes: {
        type: DimensionSchema,
        required: true
    },

    frameMaterial: {
        type: String,
        enum: ['TEAK WOOD', 'MANGOWOOD', 'METAL', 'ASSORTED', 'OTHER'],
        default: 'ASSORTED'
    },

    color: {
        type: String,
        default: 'ASSORTED'
    },

    style: {
        type: String,
        trim: true,
        enum: ['MODERN LUXE', 'CLASSIC', 'CONTEMPORARY', 'RUSTIC', 'OTHER'],
        default: 'MODERN LUXE'
    },

    technique: {
        type: String,
        trim: true,
        enum: ['HANDCRAFTED', 'MACHINE-MADE', 'WOVEN', 'OTHER'],
        default: 'HANDCRAFTED'
    },

    foamFeel: {
        type: String,
        enum: ['Medium Plush', 'Firm', 'Soft', 'OTHER'],
        default: 'Medium Plush'
    },

    fabricCustomisation: {
        type: String,
        trim: true
    }
}, { _id: false });


const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        category: {
            type: String,
            required: true,
        },
        subcategory: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        tags: {
            type: Array,
            required: true,
        },
        images: {
            type: Array,
            required: true,
        },
        galleryImages: {
            type: Array,
        },
        description: {
            type: String,
            required: true,
        },
        width: {
            type: String,
            required: true,
        },
        material: {
            type: String,
            required: true,
        },
        style: {
            type: String,
            required: true,
        },
        technique: {
            type: String,
            required: true,
        },
        fabricWeight: {
            type: String,
            required: true,
        },
        collection: {
            type: String,
            required: true,
        },
        careInstructions: {
            type: String,
            required: true,
        },
        returnPolicy: {
            type: String,
            required: true,
        },
        warranty: {
            type: String,
            required: true,
        },
        origin: {
            type: String,
            required: true,
        },
        details: {
            type: ProductDetailSchema,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Product = mongoose.model("Product", productSchema); 