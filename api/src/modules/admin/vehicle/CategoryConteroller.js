import Service from '../../../services/VehicleService';
// import { VehicalCategorieModel } from '../../../data-base/index';
// import { createData, listPaginate } from '../../../services/test';
// import { slug } from '../../../utls/_helper';

export default class CategoryController {
/*
    static async addVehicalCategorie(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    message: errors.msg,
                    errors: errors.errors
                });
            }
            else {
                const payload = req.body;
                const userRequest = req;
                let logData = {
                    name: payload.name,
                    icon: payload.icon,
                    isdeleted: 0,
                    active: 1,
                };
                let options = {
                    name: payload.name,
                    icon: payload.icon,
                    isdeleted: 0,
                    active: 1,
                    slug: slug(payload.name),
                    activeLog: [
                        {
                            userId: userRequest.userId,
                            method: 'POST',
                            newData: JSON.stringify(logData)
                        }
                    ]
                };
                await createData(VehicalCategorieModel, options);
                return res.status(200).json({ message: "create vehicale categoires" });
            }
        }
        catch (error) {
            return res.status(200).json({ error });
        }
    }
    static async getVehicalCategorie(req, res) {
        try {
            const _id = req.query.id;
            const logs = req.query.logs;
            const getquery = req.query;
            let select = '';
            logs ? '' : select = '-activeLog';
            let query = {
                select: select
            };
            let options = {
                page: getquery.page ? parseInt(getquery.page) : 1,
                limit: getquery.limit ? parseInt(getquery.limit) : 50,
                sort: {
                    _id: -1
                }
            };
            // const data = await  VehicalCategorieModel.find(query).select(select)
            const data = await listPaginate(VehicalCategorieModel, query, options);
            return res.status(200).json({ data });
        }
        catch (error) {
            return res.status(500).json({ error });
        }
    }
    static async detailsVehicalCategorie(req, res) {
        try {
            const _id = req.params.id;
            const data = await VehicalCategorieModel.findOne({ _id });
            return res.status(200).json({ data });
        }
        catch (error) {
            return res.status(500).json({ error });
        }
    }
    static async updateVehicalCategorie(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    message: errors.msg,
                    errors: errors.errors
                });
            }
            else {
                const _id = req.params.id;
                const payload = req.body;
                if (payload) {
                    const test_select = Object.keys(payload);
                    const chech_data = await VehicalCategorieModel.findOne({ _id }).select(test_select);
                    const userRequest = req;
                    let update = [
                        {
                            userId: userRequest.userId,
                            method: 'UPDATE',
                            oldData: JSON.stringify(chech_data),
                            newData: JSON.stringify(payload)
                        }
                    ];
                    await VehicalCategorieModel.updateOne({ _id }, payload);
                    await VehicalCategorieModel.updateOne({ _id }, { $push: { activeLog: update } });
                }
                return res.status(200).json({ message: "update data" });
            }
        }
        catch (error) {
            return res.status(500).json({ error });
        }
    }
    static async deleteVehicalCategorie(req, res) {
        try {
            const _id = req.params.id;
            const payload = req.body;
            const userRequest = req;
            let update = [
                {
                    userId: userRequest.userId,
                    method: 'DELETED',
                    newData: JSON.stringify(payload)
                }
            ];
            await VehicalCategorieModel.updateOne({ _id }, { isdeleted: 1 });
            await VehicalCategorieModel.updateOne({ _id });
            return res.status(200).json({ message: "delete data" });
        }
        catch (error) {
            return res.status(500).json({ error });
        }
    }

*/
    static async list(req, res) {
        try {
			const srvRes = await Service.listVehicleCategory(req?.query, req.params)
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async save(req, res) {
        try {
			const srvRes = await Service.saveVehicleCategory(req.body)
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

    static async delete(req, res) {
        try {
			const srvRes = await Service.deleteVehicleCategory(req.params.id);
            return res.status(srvRes.statusCode).json({ ...srvRes });
        } catch (e) {
			return res.status(400).send({message: e.message});
		}
    }

}