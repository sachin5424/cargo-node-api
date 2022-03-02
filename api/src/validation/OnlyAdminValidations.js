import { check } from '../settings/import';
import AdminModulesModel from '../data-base/models/adminModules';


export const adminModuleValidation = [
    check('typeKey')
        .isIn(['stateAdmin', 'districtAdmin', 'talukAdmin']).withMessage('This type of admin does not exist. Please refresh and try again')
        .custom(async (v) => {
            try {
                const r = await AdminModulesModel.findOne({typeKey: v});
                console.log('r', r);
                if (!r) {
                    throw new Error("Data not found");
                }
            } catch (e) {
                throw new Error("Error! Refresh and try again.");
            } finally{
                return true;
            }
        }),

];