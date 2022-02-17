import { jwtTokenPermission } from '../middleware/jwtToken';
import routerVehicle from './vehicle/route';
import routerUser from './user/route';
import routerPermission from './permission/route';
import routerTrip from './trip/route';
import routerDriver from './driver/route';
import routerCommon from './common/route';
import routerCustomer from './customer/route';


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

    app.use('/vehicle', routerVehicle);
    app.use('/user', routerUser);
    app.use('/permission', routerPermission);
    app.use('/trip', routerTrip);
    app.use('/driver', jwtTokenPermission, routerDriver);
    app.use('/common', routerCommon);
    app.use('/customer', routerCustomer);
};

export default api;
