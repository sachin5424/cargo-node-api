import mongoose from 'mongoose';
const Schema = new mongoose.Schema({
    title: String,
    key: String,
}, { timestamps: false });

const moduleModel = mongoose.model('module', Schema);
export default moduleModel;