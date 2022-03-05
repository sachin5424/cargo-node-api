/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useState, useEffect } from "react";
import { Tabs } from "antd";
import SdtForm from "../../components/StdForm";

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
    const [activeTab, setActiveTab] = useState('provided-loan-types');

    useEffect(() => {
        document.querySelector('.ant-tabs-content-holder').scrollTop = 0;
    }, [activeTab])


    return (
        <>
            <Tabs activeKey={activeTab} className="border overflow-y-auto" type="card" size="small" onChange={(v) => { setActiveTab(v) }} >
                <TabPane tab="Provided Loan Types" key="provided-loan-types">
                    {
                        activeTab === 'provided-loan-types'
                            ? <>
                                <SdtForm {...{}} />
                            </>
                            : null
                    }
                </TabPane>
                <TabPane tab="Product Details" key="others">
                </TabPane>
            </Tabs>
        </>
    );
})