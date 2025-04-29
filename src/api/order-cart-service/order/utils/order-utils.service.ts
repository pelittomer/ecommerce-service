import { Injectable } from "@nestjs/common";
import { PopulateCart } from "../../cart/cart.repository";

@Injectable()
export class OrderUtilsService {
    // Calculate the total amount for a list of cart items
    calculateTotalAmount(carts: PopulateCart[]): number {
        return carts.reduce((total, item) => {
            let itemPrice: number
            // Calculate item price based on discount type
            if (item.product.discount && item.product.discount.applied_price) {
                itemPrice = (item.product.price - item.product.discount.applied_price + item.product_stock.additional_price)
            } else if (item.product.discount && item.product.discount.discount_percentage) {
                itemPrice = item.product.price * (1 - (item.product.discount.discount_percentage / 100))
            } else {
                itemPrice = item.product.price
            }

            return total + itemPrice * item.quantity
        }, 0)
    }

    // Calculate the price of a single cart item
    calculateItemPrice(item: PopulateCart): number {
        if (item.product.discount && item.product.discount.applied_price) {
            return item.product.price - item.product.discount.applied_price + item.product_stock.additional_price
        }
        if (item.product.discount && item.product.discount.discount_percentage) {
            return item.product.price * (1 - item.product.discount.discount_percentage / 100)
        }
        return item.product.price
    }

}