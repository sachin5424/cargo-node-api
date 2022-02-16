import StateModel from "../models/state";
import DistrictModel from "../models/district";
import TalukModel from "../models/taluk";

import states from "../initdata/statesDistrictsAndTaluks";

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
}