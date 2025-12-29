import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { Cart } from '../models/cart.models.js'
import { ApiResponse } from '../utils/ApiResponse.js';

const CartData = asyncHandler(async (req, res) => {

    try {
        const { productId, name, image, price, quantity, size, materail, description } = req.body;
        const userId = req.user._id
        if (!productId || !quantity || !name || !price || !image) {
            throw new ApiError(400, "Product fileds are required");
        }

        const item = {
            productId,
            name,
            image,
            price,
            quantity: Number(quantity),
            size,
            materail,
            description,
        }


        let cart = await Cart.findOne({ user: userId })

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                product: [item],
            })
        } else {
            const productIndex = cart.product.findIndex((item) => item.productId === productId);
            if (productIndex > -1) {
                cart.product[productIndex].quantity += Number(quantity);
            } else {
                cart.product.push(item);
            }

            await cart.save();
        }


        return res.status(200).json(
            new ApiResponse(200, cart, "Cart item updated successfully")
        );

    } catch (error) {
        throw new ApiError(500, error);
    }
});

const CartGetData = asyncHandler(async (req, res) => {

    const userId = req.user._id

    const cart = await Cart.find({ user: userId }).populate("product");


    if (!cart) {
        throw new ApiError(400, "Not found Cart data")
    }

    res.status(200).json(
        new ApiResponse(200, cart, "Cart item found")
    )
})

const SetQuantity = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        throw new ApiError(400, "ProductId and quantity are required");
    }

    const cart = await Cart.findOneAndUpdate(
        { product: productId },
        { quantity },
        { new: true }
    )

    console.log("Cart : ", cart)

    if (!cart) {
        throw new ApiError(400, "Quantity cannot be less than 1");
    }

    res.status(200).json(
        new ApiResponse(200, cart, "Product quantity updated")
    );
});

const DeleteItem = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        if (!productId) {
            //delete all cart paroducts
            const orderDelete = await Cart.deleteMany();
            console.log(orderDelete)
            res.status(200).json(
                new ApiResponse(200, "All cart item delete successFully")
            )
        } else {
            const cart = await Cart.findOneAndUpdate(
                { user: userId },
                {
                    $pull: {
                        product: { productId: productId }
                    }
                },
                { new: true }
            );

            if (!cart) {
                throw new ApiError(404, "Cart not found");
            }

            return res.status(200).json(
                new ApiResponse(200, cart, "Item deleted from cart")
            );
        }

    } catch (error) {
        throw new ApiError(500, error.message);
    }
});


export { CartData, CartGetData, SetQuantity, DeleteItem };