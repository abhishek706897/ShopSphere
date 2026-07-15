const Wishlist=require("../models/wishlist.model")

const addToWishlist = async (userId, productId) => {

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {

        wishlist = await Wishlist.create({
            user: userId,
            products: [productId]
        });

        return wishlist;
    }

    const exists = wishlist.products.find(
        item => item.toString() === productId.toString()
    );

    if (exists) {
        return wishlist;
    }

    wishlist.products.push(productId);

    await wishlist.save();

    return wishlist;
};

const getWishlist = async (userId) => {

    return await Wishlist.findOne({ user: userId })
        .populate("products");

};

const removeFromWishlist = async (userId, productId) => {

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        throw new Error("Wishlist not found");
    }

    wishlist.products = wishlist.products.filter(
        item => item.toString() !== productId.toString()
    );

    await wishlist.save();

    return wishlist;
};

const clearWishlist = async (userId) => {

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        throw new Error("Wishlist not found");
    }

    wishlist.products = [];

    await wishlist.save();

    return wishlist;
};

module.exports={ addToWishlist, getWishlist, removeFromWishlist, clearWishlist }