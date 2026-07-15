const Cart=require("../models/cart.model")

const addToCart = async (userId, productId) => {

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {

        cart = await Cart.create({

            user: userId,

            items: [

                {

                    product: productId,

                    quantity: 1

                }

            ]

        });

        return cart;
    }

    const existingItem = cart.items.find(item =>
        item.product.toString() === productId
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.items.push({

            product: productId,

            quantity: 1

        });

    }

    await cart.save();

    return cart;
};

module.exports={ addToCart}