import { Types } from "mongoose";

export enum Role {
    Customer = "CUSTOMER",
    Seller = "SELLER",
    Admin = "ADMIN"
}

export interface UserInfo {
    userId: Types.ObjectId;
    username: string;
    roles: Role
}

export enum Gender {
    Male = "Male",
    Female = "Female",
    Other = "Other",
    PreferNotToSay = "PreferNotToSay"
}

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

export enum CompanyStatus {
    Pending = "PENDING",
    Approved = "APPROVED",
    Rejected = "REJECTED"
}
