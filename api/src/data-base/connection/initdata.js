import StateModel from "../models/state";
import DistrictModel from "../models/district";
import statesAndDistricts from "../initdata/statesAndDistricts";

export default async function initdata() {
    let resultState = await StateModel.findOne(),
        resultDistrict;
    
    if (!resultState) {
        // console.log('resultState', resultState);
        statesAndDistricts?.forEach(async (vs) => {
            resultState = new StateModel();
            resultState.name = vs.state;
            await resultState.save();


            vs?.districts?.forEach(async (vd) => {
                resultDistrict = new DistrictModel();
                resultDistrict.name = vd;
                resultDistrict.state = resultState._id;
                await resultDistrict.save();
            })
        })
    }
}