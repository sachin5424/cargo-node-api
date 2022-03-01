import { DashboardOutlined, TeamOutlined, DribbbleOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import Dashboard from './views/pages/Dashboard';
import Profile from './views/pages/user/Profile';
import Customer from './views/pages/customer/Customer';
import AssignPermission from './views/pages/roleAndPermissions/AssignPermission';

let routes = {
    leftNav: [
        { name: 'Dashboard', icon: () => <DashboardOutlined />, url: '/', component: Dashboard },
        // {
        //     name: 'Master Users',
        //     baseURL: '/master-users',
        //     icon: () => <AppstoreOutlined />,
        //     // modules: [masterUserModules.view, masterUserTypeModules.view],
        //     subMenus: [
        //         // { name: 'User Types', url: '/types', /* module: masterUserTypeModules.view, */ component: Usertype },
        //         { name: 'Master Users', url: '', /* module: masterUserModules.view,  */component: MasterUser },
        //     ]
        // },
        { name: 'Customers', url: '/customers/', icon: () => <TeamOutlined />, component: Customer },
        { name: 'Assign Permission', url: '/assign-permission/', icon: () => <DribbbleOutlined />, component: AssignPermission },
    ],

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