import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { Product } from '../models/product.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const productData = asyncHandler(async (req, res) => {

    try {
        const products =await Product.find();

        res.status(200).json(
            new ApiResponse(200, products, "Products fetched successfully")
        )
        
    } catch (error) {
        throw new ApiError(500, "Failed to update cart");
    }
})

export { productData };