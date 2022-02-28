import React, { useState, Fragment } from 'react';
import { Menu, Image } from 'antd';
import routes from '../../Route';
import { Link, useLocation } from 'react-router-dom';
import { PoweroffOutlined, MenuOutlined } from '@ant-design/icons';
import util from '../../utils/util';
import { Moon, Sun } from '../components/svgIcons';
import { If } from '../../utils/controls';
const { SubMenu } = Menu;

export default function Sider() {
    let location = useLocation();
    const [selectedKey, setSelectedKey] = useState(location.pathname);
    const [theme, setTheme] = useState(typeof util.getTheme === 'undefined' ? util.setTheme('light') : util.getTheme());


    const handleClick = e => {
        setSelectedKey(e.key);
    };

    const handleTheme = ($theme) => {
        setTheme($theme);
        util.setTheme($theme);
    }

    return (
        <>
            <Menu
                onClick={handleClick}
                selectedKeys={selectedKey}
                mode="horizontal"
            // theme="dark"
            >
                <Menu.Item id="menu-bar-logo" key="mail" style={{width: 256}}>
                    <Image preview={false} style={{ height: '24px' }} src="images/logo-thumb.png" />
                </Menu.Item>
                <Menu.Item key="menu" className="mr-auto" onClick={()=>{
                    document.querySelector('#left-menu-bar')?.classList?.toggle('d-none')
                    document.querySelector('#menu-bar-logo')?.classList?.toggle('d-none')
                    }}>
                    <MenuOutlined />
                </Menu.Item>

                <Menu.Item key="light" icon={
                    <>
                        <If cond={theme === 'light'}>
                            <Sun />
                        </If>
                        <If cond={theme === 'dark'}>
                            <Moon />
                        </If>
                    </>
                }
                    onClick={() => {
                        handleTheme(theme === 'light' ? 'dark' : 'light')
                    }
                    }>
                </Menu.Item>
                {
                    routes.topNav.map((v, i) => (
                        <Fragment key={i}>
                            {v.subMenus?.length ?
                                <SubMenu key={v.name.replace(/ /g, '')} icon={<v.icon />} title={v.name}>
                                    {
                                        v.subMenus.map((subMenu) => (
                                            <Menu.Item key={subMenu.url}>
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
                <Menu.Item key="logout" icon={<PoweroffOutlined />} onClick={() => { util.logout() }}>
                    Logout
                </Menu.Item>

            </Menu>
        </>
    )
}