import StateModel from "../models/state";
import DistrictModel from "../models/district";
import TalukModel from "../models/taluk";
import ServiceTypeModel from "../models/serviceType";
import AdminModulesModel from "../models/adminModules";
import RideTypeModel from "../models/rideTypeModel";

import states from "../initdata/statesDistrictsAndTaluks";
import serviceTypes from "../initdata/serviceTypes";
import userTypePermission from "../initdata/adminModules";
import rideType from "../initdata/rideType";

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

    let resultServiceTypes = await ServiceTypeModel.findOne();

    if(!resultServiceTypes){
        serviceTypes?.map(async (st)=>{
            resultServiceTypes = new ServiceTypeModel();
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
        });
    }


    let rideTypeResult = RideTypeModel.findOne();

    if(rideTypeResult){
        const cargoId = await ServiceTypeModel.findOne({key: 'cargo'});
        const taxiId = await ServiceTypeModel.findOne({key: 'taxi'});
        rideType.forEach(async(v)=>{
            rideTypeResult = new RideTypeModel();
            rideTypeResult.name = v.name;
            rideTypeResult.key = v.key;
            if(v.serviceType === 'cargo'){
                rideTypeResult.serviceType = cargoId;
            } else if(v.serviceType === 'taxi'){
                rideTypeResult.serviceType = taxiId;
            }
            
            await rideTypeResult.save();
        });
    }
}