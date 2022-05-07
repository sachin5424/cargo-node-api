/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Input, Modal, Tag, Spin } from "antd";
import { AntdSelect } from "../../../utils/Antd";
import { LoadingOutlined } from "@ant-design/icons";
import service from "../../../services/driver";
import { AntdMsg } from "../../../utils/Antd";
import util from "../../../utils/util";
import moment from "moment";

export const modules = {
    view: util.getModules('viewDriver'),
};

const viewAccess = modules.view;


export default function Logins({driverId}) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    let [sdata, setSData] = useState({ key: '', page: 1, limit: 20, total: 0, driverId });
    const columns = [
        {
            title: 'Login Time',
            dataIndex: 'loginTime',
            width: 300,
            render: (text) => ( moment(text).calendar())
        },
        {
            title: 'Logout Time',
            dataIndex: 'logoutTime',
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
                <MyTable {...{ data, columns, parentSData: sdata, loading, list, addNew: false }} />
            </div>
        </>
    );
}