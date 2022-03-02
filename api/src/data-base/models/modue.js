import mongoose from 'mongoose';
const Schema = new mongoose.Schema({
    title: String,
    key: String,
}, { timestamps: false });

const ModuleModel = mongoose.model('module', Schema);
export default ModuleModel;