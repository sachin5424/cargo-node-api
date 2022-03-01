import mongoose from 'mongoose';
import moduleModel from '../models/modue';

const createModules = async () => {
    mongoose.modelNames()?.forEach(async (v)=>{
        v = v.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
        v = v.charAt(0).toUpperCase() + v.slice(1);
        v = v.match(/[A-Z][a-z]+/g).join(" ");

        await moduleModel.deleteMany();
        const dt = [
            {
                title: "Add " + v,
                key: 'add' + v.replaceAll(' ', '')
            },
            {
                title: "Edit " + v,
                key: 'edit' + v.replaceAll(' ', '')
            },
            {
                title: "View " + v,
                key: 'view' + v.replaceAll(' ', '')
            },
            {
                title: "Delete " + v,
                key: 'delete' + v.replaceAll(' ', '')
            },
        ];

        await moduleModel.insertMany(dt);
    })
};
export default createModules