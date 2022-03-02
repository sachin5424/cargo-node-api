import StateModel from "../models/state";
import DistrictModel from "../models/district";
import TalukModel from "../models/taluk";
import ServiceTypeeModel from "../models/serviceType";
import AdminModulesModel from "../models/adminModules";

import states from "../initdata/statesDistrictsAndTaluks";
import serviceTypes from "../initdata/serviceTypes";
import userTypePermission from "../initdata/adminModules";

export default async function initdata() {
    let resultState = await StateModel.findOne(),
        resultDistrict, resultTaluk;

    if (!resultState) {
        states?.map(async (state) => {
            resultState = new StateModel();
            resultState.name = state.name;
            resultState.save((errVS, vs) => {
                if (!errVS) {
                    state?.districts?.forEach(async (district) => {
                        resultDistrict = new DistrictModel();
                        resultDistrict.name = district.name;
                        resultDistrict.state = vs._id;
                        await resultDistrict.save((errVD, vd) => {
                            if (!errVD) {
                                district?.taluks.forEach(async (vt) => {
                                    resultTaluk = new TalukModel();
                                    resultTaluk.name = vt;
                                    resultTaluk.district = vd._id;
                                    await resultTaluk.save();
                                });
                            }
                        });
                    })
                }
            });
        })
    }

    let resultServiceTypes = await ServiceTypeeModel.findOne();

    if(!resultServiceTypes){
        serviceTypes?.map(async (st)=>{
            resultServiceTypes = new ServiceTypeeModel();
            resultServiceTypes.name = st.name;
            resultServiceTypes.key = st.key;
            await resultServiceTypes.save();
        })
    }

    let resultUserTypePermission = await AdminModulesModel.findOne();

    if(!resultUserTypePermission){
        userTypePermission?.map(async (utp)=>{
            resultUserTypePermission = new AdminModulesModel();
            resultUserTypePermission.typeName = utp.typeName;
            resultUserTypePermission.typeKey = utp.typeKey;
            resultUserTypePermission.grantedModules = utp.grantedModules;
            await resultUserTypePermission.save();
        })
    }
}