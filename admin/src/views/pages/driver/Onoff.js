/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import MyTable from "../../components/MyTable";
import service from "../../../services/driver";
import { AntdMsg } from "../../../utils/Antd";
import util from "../../../utils/util";
import moment from "moment";

export const modules = {
    view: util.getModules('viewDriver'),
};

const viewAccess = modules.view;


export default function Onoff({loginId, driverId}) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    let [sdata, setSData] = useState({ key: '', page: 1, limit: 20, total: 0, driverId, loginId });
    const columns = [
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            // width: 300,
            render: (text) => ( moment(text).calendar())
        },
        {
            title: 'End Time',
            dataIndex: 'endTime',
        },
    ].filter(item => !item.hidden);

    const list = (data) => {
        if (typeof data === 'undefined') {
            data = sdata;
        }
        setLoading(true);
        service.listOnOff(data, viewAccess).then(res => {
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
        </>
    );
}