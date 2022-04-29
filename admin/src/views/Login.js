import { Input, Button, Spin } from 'antd';
import { UserOutlined, LockOutlined, LoadingOutlined, EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import auth from '../services/auth';
import { AntdMsg } from '../utils/Antd';
import util from '../utils/util';

export default function Login() {
    const [userName, setUserName] = useState(/* 'superadmin@test.com' */);
    const [password, setPassword] = useState(/* '123456' */);
    const [ajxRequesting, setAjxRequesting] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const login = () => {
        setAjxRequesting(true);

        auth.login({ email: userName, password: password }).then(res => {
            AntdMsg(res.message);
            util.setUserData(res.data);
            window.location.reload();
        }).catch((err) => {
            if (typeof err.message !== 'string') {
                AntdMsg(err.message[Object.keys(err.message)[0]][0], 'error');
            } else {
                AntdMsg(err.message, 'error')
            }
        }).finally(() => {
            setAjxRequesting(false)
        })
    }

    return (
        <Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
            <div className="d-flex h100vh bg-light1">
                <div className="w280 mx-auto mt-5 border p-4 bg-white1 h280">
                    <form onSubmit={e => { e.preventDefault(); login() }} autoComplete="off" spellCheck="false">
                        <h5 className="text-secondary text-center">Cargo Admin Panel</h5>
                        <div className="ant-image w-100 mb-3">
                            <img className="ant-image-img w60 h40 mx-auto" src="images/logo-thumb.png" alt="Logo" />
                        </div>
                        <Input className="mb-2"
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            value={userName}
                            onChange={(e) => { setUserName(e.target.value) }}
                            placeholder="Username" />
                        <Input className="mb-2"
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            type={!passwordVisible ? "password" : "text"}
                            suffix={<Button type="text" shape="circle" icon={<EyeOutlined />} onClick={() => setPasswordVisible(!passwordVisible)} />}
                            placeholder="Password" />
                        <Button className="login-form-button w-100" type="primary" htmlType="submit" onClick={login}>Log in</Button>
                    </form>
                </div>
            </div>
        </Spin>
    );
};