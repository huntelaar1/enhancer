const { Schema } = require('mongoose');

// commented = api obj name; if none, then they're the same
const artSchema = new Schema({
    artist: {
        type:String
    },
    // ^ artistDisplayName
    objectID: {
        type:Number,
        required: true
    },
    isHighlight: {
        type:Boolean
    },
    title: {
        type:String,
        required: true
    },
    image: {
        type:String,
        required: true
    },
    // ^ primaryImage
    objectDate: {
        type:String
    },
    culture: {
        type:String
    },
    objectName: {
        type:String
    },
    city: {
        type:String
    },
    country: {
        type:String
    }
});

module.exports = artSchema;