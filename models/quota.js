import mongoose from "mongoose";

export const document = {
    _id: "string",
    msisdn: "string",
    name: "string",
    transactionType: "string",
    price: "number",
    status: "string",
    datetime: "date",
    usercode: "string",
    username: "string"
}

const usageSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    msisdn: {
        type: String,
        required: [true, "Please provide a phone number for the package"],
        maxlength: [15, "Phone number cannot be more than 15"]
    },
    name: {
        type: String,
        required: [true, "Please provide a package name for the package"],
        maxlength: [255, "The package name is too long"]
    },
    transactionType: {
        type: String,
        required: [true, "Please provide a transaction type for the package"],
        maxlength: [50, "Transaction type is too long"]
    },
    price: {
        type: Number,
        required: [true, "Please provide a price for the package"]
    },
    status: {
        type: String,
        required: [true, "Please provide a status for the package"],
        maxlength: [50, "Status package is too long"]
    },
    datetime: {
        type: Date
    },
    usercode: {
        type: String,
        required: [true, "Please provide a user code for the package"]
    },
    username: {
        type: String,
        required: [true, "Please provide a username for the package"]
    }
}, { _id: false, versionKey: false })

export default mongoose.models.Quota || mongoose.model("Quota", usageSchema)