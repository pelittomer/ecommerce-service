
export enum Role {
    Customer = "CUSTOMER",
    Seller = "SELLER",
    Admin = "ADMIN"
}

export enum Gender {
    Male = "Male",
    Female = "Female",
    Other = "Other",
    PreferNotToSay = "PreferNotToSay"
}

export enum PaymentMethod {
    CreditCard = "credit_card",
    EFT = "eft",
    PayPal = "paypal",
    MobilePayment = "mobile_payment",
    Other = "other"
}

export enum PaymentStatus {
    Pending = "pending",
    Processing = "processing",
    Completed = "completed",
    Failed = "failed",
    Refunded = "refunded",
    PartiallyRefunded = "partially_refunded"
}

export enum ReturnRequestStatus {
    ReturnRequested = "return_requested",
    ReturnApproved = "return_approved",
    ReturnRejected = "return_rejected",
    Returned = "returned",
    CancellationRequested = "cancellation_requested",
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
