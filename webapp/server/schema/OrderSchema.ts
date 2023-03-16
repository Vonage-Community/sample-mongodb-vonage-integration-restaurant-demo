const OrderSchema = {
    name: "Order",
    properties: {
        _id: "objectId",
        items: "inventory[]",
        orderTime: "string",
        status: "int",
        lastUpdated: "string",
        user_id: "User?",
        meetingUrl: "string",
    },
    primaryKey: "_id"
}

export default OrderSchema