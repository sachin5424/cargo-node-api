import { Router } from "express";
import CommonController from "./CommonController";
import DriverRatingModel from "../../../data-base/models/driverRating";
import DriverLoginModel from "../../../data-base/models/driverLogin";
import DriverActiveModel from "../../../data-base/models/driverActive";

const router = Router({ mergeParams: true });

router.get('/list-states', CommonController.listStates);
router.get('/list-service-type', CommonController.listServiceType);
router.get('/init-db', CommonController.initdb);

router.get('/test', async (req, res) => {
    // const data = [
    //     {driver: '626a4b80d3c164e0021f5bbb', customer: '620e265c0c1f12f6cc4230c7', point: 4},
    //     {driver: '626a4b80d3c164e0021f5bbb', customer: '620e27020c1f12f6cc4230da', point: 5},
    //     {driver: '626a4b80d3c164e0021f5bbb', customer: '620e295ca03bc8e51b966b8b', point: 3},
    //     {driver: '626a4b80d3c164e0021f5bbb', customer: '620e2c0cca14c9992342bb98', point: 1},

    //     {driver: '626a4d26d3c164e0021f5c10', customer: '620e265c0c1f12f6cc4230c7', point: 4},
    //     {driver: '626a4d26d3c164e0021f5c10', customer: '620e27020c1f12f6cc4230da', point: 5},
    //     {driver: '626a4d26d3c164e0021f5c10', customer: '620e295ca03bc8e51b966b8b', point: 3},
    //     {driver: '626a4d26d3c164e0021f5c10', customer: '620e2c0cca14c9992342bb98', point: 1},

    //     {driver: '626a4e1bd3c164e0021f5c43', customer: '620e265c0c1f12f6cc4230c7', point: 4},
    //     {driver: '626a4e1bd3c164e0021f5c43', customer: '620e27020c1f12f6cc4230da', point: 5},
    //     {driver: '626a4e1bd3c164e0021f5c43', customer: '620e295ca03bc8e51b966b8b', point: 3},
    //     {driver: '626a4e1bd3c164e0021f5c43', customer: '620e2c0cca14c9992342bb98', point: 1},
    // ];

    // data.forEach(async(v)=>{
    //     const tplData = new DriverRatingModel();
    //     tplData.driver = v.driver;
    //     tplData.customer = v.customer;
    //     tplData.point = v.point;
    //     await tplData.save();
    // });

    // try {
    //     const drivers = ['626a4b80d3c164e0021f5bbb', '626a4d26d3c164e0021f5c10', '626a4e1bd3c164e0021f5c43'];
    //     drivers.forEach(async (v) => {
    //         const tplData = new DriverLoginModel();
    //         tplData.driver = '626a4b80d3c164e0021f5bbb';
    //         await tplData.save();
    //     });
    // } catch (err) {
    //     console.log(err.message);
    // }

    res.send("Success");
});

export default router;
