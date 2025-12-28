import { Activity } from "../models/activity.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { Product } from "../models/product.model.js"

const UserActivity = asyncHandler(async (req, res) => {
    try {
        const { productId, action, searchKeyword, category } = req.body

        const obj = {
            productId, action, searchKeyword, category
        }


        await Activity.create({
            userId: req.user?._id || null,
            productId,
            action,
            searchKeyword,
            category
        })

        res.status(200).json(
            new ApiResponse(200, "Activity saved")
        )


    } catch (error) {
        throw new ApiError(500, error)
    }
})


const RecentlyViewed = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const activities = await Activity.aggregate([
        {
            $match: {
                userId: userId,
                action: "view"
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $group: {
                _id: "$productId",
                lastViewedAt: { $first: "$createdAt" }
            }
        },
        {
            $sort: { lastViewedAt: -1 }
        },
        {
            $limit: 5
        }
    ]);

    if (activities.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No recently viewed products")
        );
    }

    const productIds = activities.map(item => item._id);

    const products = await Product.find({
        _id: { $in: productIds }
    });

    res.status(200).json(
        new ApiResponse(200, products, "Recently viewed products")
    );
});

const Recommended = asyncHandler(async (req, res) => {
    try {
        const topCategory = await Activity.aggregate([
            { $match: { userId: req.user._id, action: "view" } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);


        const products = await Product.find({
            category: topCategory[0]._id
        }).limit(6);


        res.status(200).json(
            new ApiResponse(200, products, "All done")
        )

    } catch (error) {
        throw new ApiError(500, error)
    }
})


export { UserActivity, RecentlyViewed, Recommended };