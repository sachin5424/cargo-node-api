import { jwtTokenPermission } from '../middleware/jwtToken';
import { validateSuperAdmin } from '../middleware/validateAdmin';
import routerVehicle from './admin/vehicle/route';
import routerUser from './admin/user/route';
import routerPermission from './admin/permission/route';
import routerTrip from './admin/trip/route';
import routerDriver from './admin/driver/route';
import routerCommon from './admin/common/route';
import routerCustomer from './admin/customer/route';
import routerOnlyAdmin from './admin/onlyAdmin/route';
import routerRide from './admin/ride/route';
import routerFareManagement from './admin/fare/route';
import routerEmail from './admin/email/route';
import routerNotification from './admin/notification/route';


import routerCUser from './customers/user/route';


import routerDUser from './driver/user/route';

import routerSDT from './admin/sdt/route';

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

        res.send({
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
    app.use('/admin/sdt', routerSDT);
    app.use('/admin/adm', jwtTokenPermission, validateSuperAdmin, routerOnlyAdmin);
    app.use('/admin/ride', jwtTokenPermission, routerRide);
    app.use('/admin/fare-management', jwtTokenPermission, routerFareManagement);
    app.use('/admin/email', jwtTokenPermission, routerEmail);
    app.use('/admin/notification', jwtTokenPermission, routerNotification);

    app.use('/customer/user', routerCUser);


    app.use('/driver/user', routerDUser);
};

export default api;
