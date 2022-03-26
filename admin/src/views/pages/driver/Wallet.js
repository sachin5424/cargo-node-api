/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Input, Modal, Tag, Spin, Image } from "antd";
import { AntdSelect } from "../../../utils/Antd";
import { LoadingOutlined, EyeOutlined } from "@ant-design/icons";
import service from "../../../services/driver";
import { AntdMsg } from "../../../utils/Antd";
import util from "../../../utils/util";

export const modules = {
    view: util.getModules('viewWallet'),
    add: util.getModules('addWallet'),
};

const viewAccess = modules.view;
const addAccess = modules.add;


export default function Wallet({driverId}) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const filters = [
        {
            type: 'dropdown',
            key: 'transactionMethod',
            placeholder: 'Transction Method',
            className: "w200 mx-1",
            options: [{_id: 'byAdmin', title: "By Admin"}, {_id: "paytm", title: "Paytm"}]
        },
        {
            type: 'dropdown',
            key: 'transactionType',
            placeholder: 'Transction Type',
            className: "w200 mx-1",
            options: [{_id: 'debit', title: "Debit"}, {_id: "credit", title: "Credit"}]
        },
        {
            type: 'dropdown',
            key: 'status',
            placeholder: 'Status',
            className: "w200 mx-1",
            options: [{_id: 'pending', title: "Pending"}, {_id: "failed", title: "Failed"}, {_id: "completed", title: "Completed"}]
        },
    ];

    const formRef = useRef();
    let [sdata, setSData] = useState({ key: '', page: 1, limit: 20, total: 0, driverId });
    const columns = [
        {
            title: 'Transaction Id',
            dataIndex: 'transactionId',
            width: 150
        },
        {
            title: 'Transaction Method',
            dataIndex: 'transactionMethod',
            width: 150,
            render: transactionMethod => {
                if (transactionMethod === 'byAdmin') {
                    return <Tag color='magenta'>By Admin</Tag>
                } else if(transactionMethod === 'paytm') {
                    return <Tag color='yellow'>Paytm</Tag>
                } else {
                    return <Tag color=''>{transactionMethod}</Tag>
                }
            },
        },
        {
            title: 'Transaction Type',
            dataIndex: 'transactionType',
            width: 150,
            render: transactionType => {
                if (transactionType === 'credit') {
                    return <Tag color='green'>Credit</Tag>
                } else if(transactionType === 'debit') {
                    return <Tag color='red'>Debit</Tag>
                }
            },
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            width: 150
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: 80,
            render: status => {
                if (status === 'completed') {
                    return <Tag color='green'>completed</Tag>
                } else if(status === 'pending') {
                    return <Tag color='yellow'>Pending</Tag>
                } else if(status === 'failed') {
                    return <Tag color='red'>Failed</Tag>
                }
            },
        },
        {
            width: 10,
        },
    ].filter(item => !item.hidden);

    const list = (data) => {
        if (typeof data === 'undefined') {
            data = sdata;
        }
        setLoading(true);
        service.listWalletHistory(data, viewAccess).then(res => {
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
                <MyTable {...{ data, columns, filters, parentSData: sdata, loading, formRef, list, searchPlaceholder: 'Transaction Id', addNew: addAccess }} />
            </div>
            <AddForm ref={formRef} {...{ list, driverId }} />
        </>
    );
}

const AddForm = forwardRef((props, ref) => {
    const { list, driverId } = props;
    const [ajxRequesting, setAjxRequesting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});
    const [changeForm, setChangeForm] = useState(false);

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setData({ driverId });
            handleVisible(true);
            if (addAccess) {
                setChangeForm(true);
            }
        }
    }));

    const handleChange = (v, k) => { setData({ ...data, [k]: v }); }

    const save = () => {
        setAjxRequesting(true);
        service.saveWalletHistory(data, addAccess).then((res) => {
            AntdMsg(res.message);
            handleVisible(false);
            list();
        }).catch(err => {
            if (typeof err.message === 'object') {
                let dt = err.message[Object.keys(err.message)[0]];
                AntdMsg(dt, 'error');
            } else {
                AntdMsg(err.message, 'error');
            }
        }).finally(() => {
            setAjxRequesting(false);
        })

    }

    return (
        <>
            <Modal
                title={'Add Wallet History'}
                style={{ top: 20 }}
                visible={visible}
                okText="Save"
                onOk={save}
                okButtonProps={{ disabled: ajxRequesting || (!changeForm), style: { display: !changeForm ? 'none' : 'inline-block' } }}
                onCancel={() => { handleVisible(false); }}
                destroyOnClose
                maskClosable={false}
                width={400}
                className="app-modal-body-overflow"
            >
                <Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                    <form onSubmit={e => { e.preventDefault(); save() }} autoComplete="off" spellCheck="false">
                        <fieldset className="" disabled={!changeForm}>
                            <div className="row mingap">
                                <div className="col-md-12 form-group">
                                    <label className="req">Transaction Type</label>
                                    <AntdSelect
                                        options={[{ _id: 'debit', name: 'Debit' }, { _id: 'credit', name: 'Credit' }]}
                                        value={data?.transactionType} onChange={v => { handleChange(v, 'transactionType') }} />
                                </div>
                                <div className="col-md-12 form-group">
                                    <label className="req">Amount</label>
                                    <Input value={data.amount || ''} onChange={e => handleChange(util.handleInteger(e.target.value), 'amount')} />
                                </div>
                                <div className="col-md-12 form-group">
                                    <label className="">Description</label>
                                    <Input.TextArea value={data.description || ''} onChange={e => handleChange(e.target.value, 'description')} />
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </Spin>
            </Modal>
        </>
    );
});