import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema({
    title: {
        type: String, // "Yxwalds vrede"
        required: true,
    },
    episodeNumber: {
        type: Number, // 1
        required: true,
    },
    length: {
        type: Number, // Get length from audio file
        required: true,
    },
    description: {
        type: String, // "Ska kunna redigeras av användarna"
        required: true,
    },
    characters: {
        type: [String], // Vilka karaktärer var med i episoden
        required: true,
        default: [],
    },
    players: {
        type: [String], // Vilka spelare var med i episoden
        required: true,
        default: [],
    },
    gameMaster: {
        type: String,
        required: true,
    },
    poster: {
        type: String,
        required: true,
        default: "https://res.cloudinary.com/dkccaruot/image/upload/v1722965887/oyswfgmlb5olqisiazsg.png",
    },
    audioFile: {
        type: String,
        required: true,
        default: "",
    },
    rating: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Episode = mongoose.model('Episode', episodeSchema);

export default Episode;