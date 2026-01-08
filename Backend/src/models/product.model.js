import mongoose from "mongoose";

const DimensionSchema = new mongoose.Schema({
    seatHeight: { type: Number, min: 0},
    seatBackHeight: { type: Number, min: 0},
    seatDepth: { type: Number, min: 0},
    backRestAngle: { type: Number, min: 0 },
    armWidth: { type: Number, min: 0 },
    armHeightFromSeating: { type: Number, min: 0 },
    armHeightFromFloor: { type: Number, min: 0 },
}, { _id: false });

const ProductDetailSchema = new mongoose.Schema({
    sizeCM: {
        type: String,

        trim: true
    },

    sizeIN: {
        type: String,

        trim: true
    },

    additionalSizes: {
        type: DimensionSchema,
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

            index: true,
        },
        category: {
            type: String,

        },
        subcategory: {
            type: String,

        },
        smallCategory: {
            type: String,

        },
        price: {
            type: Number,

        },
        tags: {
            type: Array,

        },
        images: {
            type: Array,

        },
        galleryImages: {
            type: Array,
        },
        description: {
            type: String,

        },
        width: {
            type: String,

        },
        material: {
            type: String,

        },
        style: {
            type: String,

        },
        technique: {
            type: String,

        },
        fabricWeight: {
            type: String,

        },
        collection: {
            type: String,

        },
        careInstructions: {
            type: String,

        },
        returnPolicy: {
            type: String,

        },
        warranty: {
            type: String,

        },
        origin: {
            type: String,

        },
        details: {
            type: ProductDetailSchema,
        }
    },
    {
        timestamps: true
    }
);

export const Product = mongoose.model("Product", productSchema); 