import { UserModel } from "../../data-base";
import { clearSearch } from "../../utls/_helper";
import { uploadFile } from "../../utls/_helper";
import config from "../../utls/config";

export default class Service {

    static async listUsers(query, cuser) {
        const response = {
            statusCode: 400,
            message: 'Data not found!',
            data: {
                docs: [],
                page: query.page * 1 > 0 ? query.page * 1 : 1,
                limit: query.limit * 1 > 0 ? query.limit * 1 : 20,
                totalDocs: 0,
            },
            status: false
        };

        try {
            const search = { _id: query._id, isDeleted: false };
            clearSearch(search);

            response.data.docs = await UserModel.find(search)
                .select('-password -updatedAt -createdAt -__v')
                .limit(response.data.limit)
                .skip(response.data.limit * (response.data.page - 1))
                .then(async function (data) {
                    await UserModel.count(search).then(count => { response.data.totalDocs = count }).catch(err => { response.data.totalDocs = 0 })
                    return data;
                })
                .catch(err => { throw new Error(err.message) })

            if (response.data.docs.length) {
                response.message = "Data fetched";
            }
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }

    static async saveUser(data) {
        const _id = data._id;
        const response = { statusCode: 400, message: 'Error!', status: false };

        try {
            const tplData = _id ? await UserModel.findById(_id) : new UserModel();

            tplData.firstName = data.firstName;
            tplData.lastName = data.lastName;
            tplData.phoneNo = data.phoneNo;
            tplData.email = data.email;
            tplData.password = data.password;
            tplData.dob = data.dob;
            tplData.photo = await uploadFile(data.photo, config.uploadPaths.user.photo, UserModel, 'photo', _id);
            tplData.type = data.type;
            tplData.state = data.state;
            tplData.district = data.district;
            tplData.taluk = data.taluk;
            tplData.isActive = data.isActive;

            await tplData.save();

            response.message = _id ? "User is Updated" : "A new user is created";
            response.statusCode = 200;
            response.status = true;

            return response;

        } catch (e) {
            throw new Error(e)
        }
    }
}