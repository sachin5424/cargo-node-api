/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useState, useEffect } from "react";
import { useHistory, } from "react-router-dom";
import { Tabs } from "antd";
import util from "../../../utils/util";
import Module from "./Module";


const components = [
    { component: Module, name: 'Module', key: 'module' },
];


export default function Tabstest() {

    return (
        <>
            {/* <div className="page-description text-white p-2" >
                <span>Bank List</span>
            </div> */}
            <div className="m-21 border p-2">
                <Detail />
            </div>
        </>
    );
}

const Detail = forwardRef(() => {
    const { TabPane } = Tabs;
    const history = useHistory();
    const [activeTab, setActiveTab] = useState(util.queryStringToJSON(history.location?.search)?.tab || components[0].key);

    useEffect(() => {
        history.push({ search: `?tab=${activeTab}` });
        document.querySelector('.ant-tabs-content-holder').scrollTop = 0;
    }, [activeTab]);


    return (
        <>
            <Tabs activeKey={activeTab} className="border overflow-y-auto" type="card" size="small" onChange={(v) => { setActiveTab(v) }} >
                {
                    components.map(v => (
                        <TabPane tab={v.name} key={v.key}>
                            {
                                activeTab === v.key
                                    ? <v.component />
                                    : null
                            }
                        </TabPane>
                    ))
                }
            </Tabs>
        </>
    );
})