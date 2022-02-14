import StateModel from "../models/state";
import DistrictModel from "../models/district";
import TalukModel from "../models/taluk";

import states from "../initdata/statesDistrictsAndTaluks";

export default async function initdata() {
    let resultState = await StateModel.findOne(),
        resultDistrict, resultTaluk;
    
    if (!resultState) {
        
        states?.forEach(async (vs) => {
            resultState = new StateModel();
            resultState.name = vs.name;
            await resultState.save();

            vs?.districts?.forEach(async (vd) => {
                resultDistrict = new DistrictModel();
                resultDistrict.name = vd.name;
                resultDistrict.state = resultState._id;
                await resultDistrict.save();

                vd?.taluks.forEach(async(vt) => {
                    resultTaluk = new TalukModel();
                    resultTaluk.name = vt;
                    resultTaluk.district = resultDistrict._id;

                    await resultTaluk.save();

                });
            })
        })
    }
}