/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
import { DashboardOutlined, TeamOutlined, KeyOutlined, CarOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import Dashboard from './views/pages/Dashboard';
import Profile from './views/pages/user/Profile';
import Customer, { modules as customerModules } from './views/pages/customer/Customer';
import AssignPermission from './views/pages/roleAndPermissions/AssignPermission';
import User, { modules as userModules } from './views/pages/admin/User';
import TabsVehicle from './views/pages/vehicle/Tabs';
import Category, {modules as categoryModules} from './views/pages/vehicle/Category';
import util from './utils/util';

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
        { name: 'Tabs', url: '/vehicles', icon: () => <CarOutlined />, component: TabsVehicle },
        {
            name: 'Vehicle',
            baseURL: '/vehicle',
            icon: () => <CarOutlined />,
            subMenus: [
                { name: 'Category', url: '/category', component: Category, modules: [categoryModules.view] },
            ].filter(v => isSuperAdmin || v.modules?.includesAny(allModules)),
        },
        { name: 'Admins', url: '/users', icon: () => <TeamOutlined />, component: User, modules: [userModules.view] },
        { name: 'Customers', url: '/customers', icon: () => <TeamOutlined />, component: Customer, modules: [customerModules.view] },
        { name: 'User Permissions', url: '/user-permissions', icon: () => <KeyOutlined />, component: AssignPermission },
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