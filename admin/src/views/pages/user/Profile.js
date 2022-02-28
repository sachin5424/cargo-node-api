import { Image, Divider, Button, Drawer, Space, Spin } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import service from "../../../services/profile";
import EditProfile from "./EditProfile";
import { AntdMsg } from "../../../utils/Antd";
import { LoadingOutlined } from "@ant-design/icons";
import { If } from "../../../utils/controls";
import moment from "moment";

export default function Profile() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true)
    const drawerRef = useRef();

    const list = (data) => {
        setLoading(true);
        service.details(data).then(res => {
            setData(res.result?.data || {});
            setLoading(false);
            drawerRef.current.closeForm()
        }).catch(err => {
            setLoading(false);
            AntdMsg(err.message, 'error');
        })
    }

    useEffect(() => {
        list()
    }, []);


    return (
        <>
            <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                <EditProfileDrawer ref={drawerRef} {...{list}} />
                <div className="p-2 d-flex w-100">
                    <div className="px-3">
                        <Image className="w200" src={data.image?.url || ''} />
                        <Button type="dashed" className="w200" onClick={() => { drawerRef.current.openForm() }}>Edit Profile</Button>
                    </div>
                    <div className="px-3 w-100">
                        <h5 className="text-secondary text-bold">{data.name || ''} <span className="text-danger h6">@{data.username || ''}</span></h5>
                        <p className="text-info text-bold">{data.user_type?.title || ''}</p>
                        <Divider orientation="left">Contact Info</Divider>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="w100 text-bold">Phone: </td>
                                    <td className="text-info">{data.mobile || ''}</td>
                                </tr>
                                <tr>
                                    <td className="w100 text-bold">Address: </td>
                                    <td className="text-secondary">{data.address || ''}</td>
                                </tr>
                                <tr>
                                    <td className="w100 text-bold">Email: </td>
                                    <td className="text-info">{data.email || ''}</td>
                                </tr>
                            </tbody>
                        </table>
                        <Divider orientation="left">Basic Info</Divider>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="w100 text-bold">Birthday: </td>
                                    <td className="text-info">{moment(data.dob).format('MMMM D, YYYY')}</td>
                                </tr>
                                <tr>
                                    <td className="w100 text-bold">Gender: </td>
                                    <td className="text-secondary">{data.gender === 'male' ? 'Male' : data.gender === 'female' ? 'Female' : 'Other'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Spin>
        </>
    );
}


const EditProfileDrawer = forwardRef((props, ref) => {
    const {list} = props;
    const [visible, setVisible] = useState(false);
    useImperativeHandle(ref, () => ({
        openForm() {
            setVisible(true);
        },
        closeForm(){
            setVisible(false);
        }
    }));
    const onClose = () => {
        setVisible(false);
    };

    return (
        <>
            <Drawer
                title="Update Profile"
                placement="right"
                width={700}
                onClose={onClose}
                visible={visible}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={onClose}>
                            OK
                        </Button>
                    </Space>
                }
            >
                <If cond={visible}>
                    <EditProfile {...{callback:list}} />
                </If>
            </Drawer>
        </>
    );
});