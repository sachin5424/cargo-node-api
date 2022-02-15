import StateModel from "../models/state";
import DistrictModel from "../models/district";
import TalukModel from "../models/taluk";

import states from "../initdata/statesDistrictsAndTaluks";

export default async function initdata() {
    let resultState = await StateModel.findOne(),
        resultDistrict, resultTaluk;

    // if (!resultState) {

    states?.map(async (vs) => {
        resultState = new StateModel();
        resultState.name = vs.name;
        resultState.save((errVS, vs) => {
            if (!errVS) {
                vs?.districts?.forEach(async (vd) => {
                    resultDistrict = new DistrictModel();
                    resultDistrict.name = vd.name;
                    resultDistrict.state = vs._id;
                    console.log('vs._id-----', vs._id);
                    await resultDistrict.save((errVD, vd) => {
                        if (!errVD) {
                            // vd?.taluks.forEach(async (vt) => {
                            //     resultTaluk = new TalukModel();
                            //     resultTaluk.name = vt;
                            //     resultTaluk.district = resultDistrict._id;
                            //     console.log('resultDistrict._id-----', resultDistrict._id);

                            //     await resultTaluk.save();

                            // });
                        }
                    });

                    // vd?.taluks.forEach(async (vt) => {
                    //     resultTaluk = new TalukModel();
                    //     resultTaluk.name = vt;
                    //     resultTaluk.district = resultDistrict._id;
                    //     console.log('resultDistrict._id-----', resultDistrict._id);

                    //     await resultTaluk.save();

                    // });
                })
            }
            // console.log('resultState._id-----', result._id, result.name);

        });

        // vs?.districts?.forEach(async (vd) => {
        //     resultDistrict = new DistrictModel();
        //     resultDistrict.name = vd.name;
        //     resultDistrict.state = resultState._id;
        //     console.log('resultState._id-----', resultState._id);
        //     await resultDistrict.save();

        //     vd?.taluks.forEach(async(vt) => {
        //         resultTaluk = new TalukModel();
        //         resultTaluk.name = vt;
        //         resultTaluk.district = resultDistrict._id;
        //         console.log('resultDistrict._id-----', resultDistrict._id);

        //         await resultTaluk.save();

        //     });
        // })
    })
    // }
}