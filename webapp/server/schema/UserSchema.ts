const UserSchema = {
    name: "User",
    properties: {
        _id: "objectId",
        username: "string",
        phone: "string",
        password: "string"
    },
    primaryKey: "_id"
}

export default UserSchema