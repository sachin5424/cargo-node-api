import { jwtTokenPermission, vehicleOwnerValidate } from '../middleware/jwtToken';
import routerVehicle from './admin/vehicle/route';
import routerUser from './admin/user/route';
import routerPermission from './admin/permission/route';
import routerTrip from './admin/trip/route';
import routerDriver from './admin/driver/route';
import routerCommon from './admin/common/route';
import routerCustomer from './admin/customer/route';


import routerVOVehicle from './vehicleOwner/vehicle/route';
import routerVOCustomer from './vehicleOwner/user/route';
import routerVODriver from './vehicleOwner/driver/route';


const api = (app) => {
    app.use('*', (req, res, next) => {
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        });
        if (req.method === 'OPTIONS') {
            res.status(200).json({ status: 'Okay' });
        } else {
            next();
        }
    });

    app.all('/status', (req, res) => {

        res.send(res, {
            data: {
                headers: req.headers,
                params: req.params,
                query: req.query,
                body: req.body,
            },
        });
    });

    app.use('/admin/vehicle', routerVehicle);
    app.use('/admin/user', routerUser);
    app.use('/admin/permission', routerPermission);
    app.use('/admin/trip', routerTrip);
    app.use('/admin/driver', jwtTokenPermission, routerDriver);
    app.use('/admin/common', routerCommon);
    app.use('/admin/customer', routerCustomer);


    app.use('/vehicle-owner/user', routerVOCustomer);
    app.use('/vehicle-owner/vehicle', vehicleOwnerValidate, routerVOVehicle);
    app.use('/vehicle-owner/driver', vehicleOwnerValidate, routerVODriver);
};

export default api;
