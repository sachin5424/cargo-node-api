/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
import { DashboardOutlined, TeamOutlined, KeyOutlined, CarOutlined, MailOutlined, NotificationOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import Dashboard from './views/pages/Dashboard';
import Profile from './views/pages/user/Profile';
import Customer, { modules as customerModules } from './views/pages/customer/Customer';
import AssignPermission from './views/pages/roleAndPermissions/AssignPermission';
import User, { modules as userModules } from './views/pages/admin/User';
import TabsVehicle from './views/pages/tabs/Tabs';
import Category, {modules as categoryModules} from './views/pages/vehicle/Category';
import Vehicle, {modules as vehicleModules} from './views/pages/vehicle/Vehicle';
import Type, {modules as typeModules} from './views/pages/ride/Type';
import util from './utils/util';
import Driver, {modules as driverModules} from './views/pages/driver/Driver';
import Module from './views/pages/tabs/Module';
import Make, {modules as makeModules} from './views/pages/vehicle/Make';
import MakeModel, {modules as makeModelModules} from './views/pages/vehicle/MakeModel';
import Color, {modules as colorModules} from './views/pages/vehicle/Color';
import TaxiFareManagement, {modules as taxiFareManagementModules} from './views/pages/fare/TaxiFareManagement';
import Template, {modules as templateModules} from './views/pages/email/Template';
import Email, {modules as emailModules} from './views/pages/email/Email';
import Notification, {modules as notificationModules} from './views/pages/notification/Notification';
import State, {modules as stateModules} from './views/pages/sdt/State';
import District, {modules as districtModules} from './views/pages/sdt/District';
import Taluk, {modules as talukModules} from './views/pages/sdt/Taluk';
import Package, {modules as packageModules} from './views/pages/fare/Package';

const allModules = util.getModules();
const isSuperAdmin = util.isSuperAdmin();

Array.prototype.includesAny = function (arr = []) {
    return this.some(function (element) {
        return arr.includes(element);
    });
}

const routes = {
    leftNav: [
        { name: 'Dashboard', icon: () => <DashboardOutlined />, url: '/', component: Dashboard },
        { name: 'Modules', icon: () => <DashboardOutlined />, url: '/modules', component: Module },
        { name: 'Tabs', url: '/vehicles', icon: () => <CarOutlined />, component: TabsVehicle },
        {
            name: 'States, Districts & Taluks',
            baseURL: '/sdt',
            modules: [colorModules.view, makeModules.view, makeModelModules.view, categoryModules.view, vehicleModules.view ],
            icon: () => <EnvironmentOutlined />,
            subMenus: [
                { name: 'States', url: '/states', component: State, modules: [stateModules.view] },
                { name: 'Districts', url: '/districts', component: District, modules: [districtModules.view] },
                { name: 'Taluks', url: '/taluks', component: Taluk, modules: [talukModules.view] },
            ].filter(v => isSuperAdmin || v.modules?.includesAny(allModules)),
        },
        {
            name: 'Vehicle',
            baseURL: '/vehicle',
            modules: [colorModules.view, makeModules.view, makeModelModules.view, categoryModules.view, vehicleModules.view ],
            icon: () => <CarOutlined />,
            subMenus: [
                { name: 'Color', url: '/color', component: Color, modules: [colorModules.view] },
                { name: 'Make', url: '/make', component: Make, modules: [makeModules.view] },
                { name: 'Make Model', url: '/make-model', component: MakeModel, modules: [makeModelModules.view] },
                { name: 'Category', url: '/category', component: Category, modules: [categoryModules.view] },
                { name: 'Vehicle', url: '/vehicle', component: Vehicle, modules: [vehicleModules.view] },
            ].filter(v => isSuperAdmin || v.modules?.includesAny(allModules)),
        },
        {
            name: 'Ride',
            baseURL: '/ride',
            modules: [typeModules.view],
            icon: () => <CarOutlined />,
            subMenus: [
                { name: 'Type', url: '/type', component: Type, modules: [typeModules.view] },
            ].filter(v => isSuperAdmin || v.modules?.includesAny(allModules)),
        },
        {
            name: 'Fare Management',
            baseURL: '/fare-management',
            modules: [taxiFareManagementModules.view],
            icon: () => <CarOutlined />,
            subMenus: [
                { name: 'Rental Package', url: '/rental-package', component: Package, modules: [packageModules.view] },
                { name: 'Taxi Fare Management', url: '/taxi', component: TaxiFareManagement, modules: [taxiFareManagementModules.view] },
                { name: 'Cargo Fare Management', url: '/cargo', component: ()=>{return TaxiFareManagement({activeServiceType: 'cargo'})}, modules: [taxiFareManagementModules.view] },
            ].filter(v => isSuperAdmin || v.modules?.includesAny(allModules)),
        },
        { name: 'Drivers', url: '/drivers', icon: () => <TeamOutlined />, component: Driver, modules: [driverModules.view] },
        { name: 'Admins', url: '/users', icon: () => <TeamOutlined />, component: User, modules: [userModules.view] },
        { name: 'Customers', url: '/customers', icon: () => <TeamOutlined />, component: Customer, modules: [customerModules.view] },
        { name: 'User Permissions', url: '/user-permissions', icon: () => <KeyOutlined />, component: AssignPermission },
        {
            name: 'Email',
            baseURL: '/email',
            modules: [templateModules.view, emailModules.view],
            icon: () => <MailOutlined />,
            subMenus: [
                { name: 'Template', url: '/template', component: Template, modules: [templateModules.view] },
                { name: 'Email', url: '/email', component: Email, modules: [emailModules.view] },
            ].filter(v => isSuperAdmin || v.modules?.includesAny(allModules)),
        },
        { name: 'Notifications', url: '/notifications', icon: () => <NotificationOutlined />, component: Notification, modules: [notificationModules.view] },
    ].filter(v => isSuperAdmin || v.modules?.includesAny(allModules)),

    topNav: [
        {
            name: 'Your Profile',
            icon: () => <Avatar style={{ marginRight: 8 }} size={30} src="images/avatar-1.jpg" />,
            url: '/profile',
            component: Profile
        },
    ]
}

export default routes;