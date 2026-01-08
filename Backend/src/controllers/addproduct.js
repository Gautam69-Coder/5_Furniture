import { Activity } from "../models/activity.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { Product } from "../models/product.model.js"

const AddProduct = asyncHandler(async (req, res) => {

    const { formData } = req.body;

    console.log(formData);

    if (!formData) {
        throw new ApiError(400, "Product Data is Required")
    }

    const product = await Product.create({
        name: formData.name,
        category: formData.category,
        price: formData.price,
        description: formData.description,
        images: formData.images,
        details: {
            sizeCM: formData.sizeCM
        },
        details: {
            frameMaterial: formData.frameMaterial
        },
    })

    console.log(product)

})

export {AddProduct}