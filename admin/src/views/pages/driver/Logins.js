/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Modal, Button } from "antd";
import service from "../../../services/driver";
import { AntdMsg } from "../../../utils/Antd";
import util from "../../../utils/util";
import moment from "moment";
import Onoff from "./Onoff";

export const modules = {
    view: util.getModules('viewDriver'),
};

const viewAccess = modules.view;


export default function Logins({ driverId }) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    let [sdata, setSData] = useState({ key: '', page: 1, limit: 20, total: 0, driverId });
    // const filters = [
    //     {
    //         type: 'datePicker',
    //         key: 'from',
    //         className: "w200 mx-1",
    //         placeholder: 'From',
    //     },
    //     {
    //         type: 'datePicker',
    //         key: 'to',
    //         className: "w200 mx-1",
    //         placeholder: 'To',
    //     },
    // ];
    const onoffModalRef = useRef();
    const columns = [
        {
            title: 'Login Time',
            dataIndex: 'loginTime',
            width: 300,
            render: (text) => (moment(text).calendar())
        },
        {
            title: 'Logout Time',
            dataIndex: 'logoutTime',
        },
        {
            title: 'Logins',
            dataIndex: '',
            width: 100,
            render: (walletDetails, row) => (
                <Button size="small" type="default" className="mx-1" onClick={() => { onoffModalRef.current.openForm(row) }}>On / Off</Button>
            )
        },
    ].filter(item => !item.hidden);

    const list = (data) => {
        if (typeof data === 'undefined') {
            data = sdata;
        }
        setLoading(true);
        service.listLogins(data, viewAccess).then(res => {
            let dt = data;
            dt.total = res.result?.total || 0;
            setSData({ ...dt });
            setData(res.result?.data || []);
        }).catch(err => {
            AntdMsg(err.message, 'error');
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        list();
    }, []);

    return (
        <>
            {/* <div className="page-description text-white p-2" >
                <span>Wallet History List</span>
            </div> */}
            <div className="m-2 border p-2">
                <MyTable {...{ data, columns, parentSData: sdata, loading, list, addNew: false, allowSearch: false }} />
            </div>
            <OnoffModal ref={onoffModalRef} />
        </>
    );
}

const OnoffModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setData({ ...dt });
            handleVisible(true);
        }
    }));

    return (
        <>
            <Modal
                title={<>On / Off History</>}
                style={{ top: 20 }}
                visible={visible}
                onCancel={() => { handleVisible(false); }}
                destroyOnClose
                maskClosable={false}
                width={500}
                footer={null}
                className="app-modal-body-overflow"
            >
                <Onoff {...{ driverId: data.driver, loginId: data._id }} />
            </Modal>
        </>
    );
});