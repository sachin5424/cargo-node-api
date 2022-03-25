/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Input, Modal, Tag, Spin, Image } from "antd";
import { AntdSelect } from "../../../utils/Antd";
import { EditOutlined, LoadingOutlined, EyeOutlined } from "@ant-design/icons";
import service from "../../../services/ride";
import { AntdMsg } from "../../../utils/Antd";
import util from "../../../utils/util";
import driverService from "../../../services/driver";

export const modules = {
    view: util.getModules('viewWallet'),
    add: util.getModules('addWallet'),
    edit: util.getModules('editWallet'),
    delete: util.getModules('deleteWallet'),
};

const viewAccess = modules.view;
const addAccess = modules.add;
const editAccess = modules.edit;
const deleteAccess = modules.delete;


export default function Wallet() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drivers, setDrivers] = useState([]);

    const formRef = useRef();
    let [sdata, setSData] = useState({ key: '', page: 1, limit: 20, total: 0 });
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            width: 80,
            render: isActive => {
                if (isActive) {
                    return <Tag color='green'>Active</Tag>
                } else {
                    return <Tag color='red'>Inactive</Tag>
                }
            },
        },
        {
            title: 'Action',
            width: 60,
            hidden: !addAccess && !editAccess && !deleteAccess && !viewAccess,
            render: (text, row) => (
                <>
                    {
                        <Button size="small" className="mx-1" onClick={() => { formRef.current.openForm(row) }}>
                            <span className="d-flex">
                                <EyeOutlined />
                            </span>
                        </Button>
                    }
                </>
            ),
        },
    ].filter(item => !item.hidden);

    const list = (data) => {
        if (typeof data === 'undefined') {
            data = sdata;
        }
        setLoading(true);
        service.listRideType(data, viewAccess).then(res => {
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
        driverService.listAll({}, 'viewDriver').then(res => { setDrivers(res.result.data); });
    }, []);

    return (
        <>
            <div className="page-description text-white p-2" >
                <span>Ride Type List</span>
            </div>
            <div className="m-2 border p-2">
                <MyTable {...{ data, columns, parentSData: sdata, loading, formRef, list, searchPlaceholder: 'Name or Slug', addNew: addAccess }} />
            </div>
            <AddForm ref={formRef} {...{ list, drivers }} />
        </>
    );
}

const AddForm = forwardRef((props, ref) => {
    const { list, drivers } = props;
    const [ajxRequesting, setAjxRequesting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});
    const [changeForm, setChangeForm] = useState(false);

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setData(dt ? { ...dt } : { isActive: true });
            handleVisible(true);
            if (!dt?._id && addAccess) {
                setChangeForm(true);
            } else if (dt._id && editAccess) {
                setChangeForm(true);
            } else {
                setChangeForm(false);
            }
        }
    }));

    const handleChange = (v, k) => { setData({ ...data, [k]: v }); }

    const save = () => {
        setAjxRequesting(true);
        service.saveRideType(data, data._id ? editAccess : addAccess).then((res) => {
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
                title={(!data._id ? 'Add' : 'Edit') + ' Wallet'}
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
                                    <label className="req">Driver</label>
                                    <AntdSelect options={drivers || []} value={data?.driver} onChange={v => { handleChange(v, 'driver') }} />
                                </div>
                                <div className="col-md-12 form-group">
                                    <label className="req">Type</label>
                                    <AntdSelect
                                        options={[{ label: 'debit', name: 'Debit' }, { label: 'credit', name: 'Credit' }]}
                                        value={data?.type} onChange={v => { handleChange(v, 'type') }} />
                                </div>
                                <div className="col-md-12 form-group">
                                    <label className="req">Amount</label>
                                    <Input value={data.amount || ''} onChange={e => handleChange(util.handleInteger(e.target.value), 'amount')} />
                                </div>
                                <div className="col-md-12 form-group">
                                    <label className="req">Description</label>
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