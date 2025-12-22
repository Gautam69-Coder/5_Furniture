import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { Product } from '../models/product.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const productData = asyncHandler(async (req, res) => {

    try {
        let { _limit = 10, _page = 1 } = req.query;

        _limit = Number(_limit);
        _page = Number(_page);

        const products = await Product.find()
            .limit(_limit)
            .skip((_page - 1) * _limit);

        const total = await Product.countDocuments();

        res.json({
            total,
            page: _page,
            limit: _limit,
            data: products
        });
        
    } catch (error) {
        throw new ApiError(500, "Failed to update cart");
    }
})

export { productData };