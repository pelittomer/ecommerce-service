import { Document } from "mongoose";
import { Order } from "./order.entity";
import { OrderItem } from "./order-item.entity";

export type OrderDocument = Order & Document;

export enum OrderStatus {
    PaymentPending = "payment_pending",
    PaymentReceived = "payment_received",
    OrderReceived = "order_received",
    Preparing = "preparing",
    Packaging = "packaging",
    ReadyToShip = "ready_to_ship",
    Shipped = "shipped",
    InTransit = "in_transit",
    Delivered = "delivered",
    Cancelled = "cancelled",
    CancellationRequested = "cancellation_requested",
    ReturnRequested = "return_requested",
    ReturnApproved = "return_approved",
    ReturnRejected = "return_rejected",
    Returned = "returned",
}
export type OrderItemDocument = OrderItem & Document;
