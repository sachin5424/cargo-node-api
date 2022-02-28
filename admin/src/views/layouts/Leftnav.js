import React, { useState, Fragment } from 'react';
import { Menu } from 'antd';
import routes from '../../Route';
import { Link, useLocation } from 'react-router-dom';

const { SubMenu } = Menu;

export default function Sider() {
    let location = useLocation();
    const [selectedKey, setSelectedKey] = useState(location.pathname);

    const handleClick = e => {
        setSelectedKey(e.key);
    };

    return (
        <>
             <Menu
                onClick={handleClick}
                style={{ width: 256 }}
                defaultOpenKeys={['sub1']}
                selectedKeys={selectedKey}
                mode="inline"
                // theme="dark"
                id="left-menu-bar"
            >
                {
                    routes.leftNav.map((v, i) => (
                        <Fragment key={i}>
                            {v.subMenus?.length ?
                                <SubMenu key={v.name.replace(/ /g, '')} icon={<v.icon />} title={v.name}>
                                    {
                                        v.subMenus.map((subMenu) => (
                                            <Menu.Item key={subMenu.module || subMenu.url}>
                                                <Link className="text-d-none" to={(v.baseURL || '') + subMenu.url}>{subMenu.name}</Link>
                                            </Menu.Item>
                                        ))
                                    }
                                </SubMenu> :
                                <Menu.Item key={v.url} icon={<v.icon />}>
                                    <Link className="text-d-none" to={v.url}>{v.name}</Link>    
                                </Menu.Item>
                            }
                        </Fragment>
                    ))
                }
            </Menu>
        </>
    )
}