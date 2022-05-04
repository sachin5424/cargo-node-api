/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Popconfirm, Input, Modal, Tag, Spin, Image } from "antd";
import { AntdSelect } from "../../../utils/Antd";
import { EditOutlined, DeleteOutlined, LoadingOutlined, EyeOutlined } from "@ant-design/icons";
import service from "../../../services/fare";
import commonService from "../../../services/common";
import { AntdMsg } from "../../../utils/Antd";
import util from "../../../utils/util";

export const modules = {
    view: util.getModules('viewPackage'),
    add: util.getModules('addPackage'),
    edit: util.getModules('editPackage'),
    delete: util.getModules('deletePackage'),
};

const viewAccess = modules.view;
const addAccess = modules.add;
const editAccess = modules.edit;
const deleteAccess = modules.delete;


export default function Package() {

    const [data, setData] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState([]);

    const formRef = useRef();
    let [sdata, setSData] = useState({ key: '', page: 1, limit: 20, total: 0 });
    const columns = [
        {
            title: 'Service Name',
            dataIndex: 'name',
        },
        {
            title: 'Distance',
            dataIndex: 'distance',
            width: 100,
        },
        {
            title: 'Time',
            dataIndex: 'time',
            width: 100,
        },
        {
            title: 'Service Type',
            dataIndex: 'serviceTypeDetails',
            width: 100,
            render: (data, row) => {
                if(data?.key === 'cargo'){
                    return <Tag color='cyan'>{data?.name}</Tag>
                } else if(data?.key === 'taxi'){
                    return <Tag color='purple'>{data?.name}</Tag>
                } else {
                    return <Tag>{data?.name}</Tag>
                }
            },
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
            width: 90,
            hidden: !addAccess && !editAccess && !deleteAccess && !viewAccess,
            render: (text, row) => (
                <>
                    {
                        editAccess
                            ? <Button size="small" className="mx-1" onClick={() => { formRef.current.openForm(text) }}>
                                <span className="d-flex">
                                    <EditOutlined />
                                </span>
                            </Button>
                            : null
                    }

                    {
                        !editAccess && viewAccess
                            ? <Button size="small" className="mx-1" onClick={() => { formRef.current.openForm(text) }}>
                                <span className="d-flex">
                                    <EyeOutlined />
                                </span>
                            </Button>
                            : null
                    }

                    {
                        deleteAccess
                            ? <Button type="danger" size="small">
                                <span className="d-flex">
                                    <Popconfirm
                                        title="Are you sure to delete this package?"
                                        onConfirm={() => deleteConfirm(row._id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <DeleteOutlined />
                                    </Popconfirm>
                                </span>
                            </Button>
                            : null
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
        service.listPackage(data, viewAccess).then(res => {
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

    const deleteConfirm = (id) => {
        service.deletePackage(id, deleteAccess).then(res => {
            AntdMsg(res.message);
            list();
        }).catch(err => {
            AntdMsg(err.message, 'error');
        })
    }

    useEffect(() => {
        setFilters([
            {
                type: 'dropdown',
                key: 'serviceType',
                placeholder: 'Service Type',
                className: "w200 mx-1",
                options: serviceTypes
            },
        ]);
    }, [serviceTypes]);

    useEffect(() => {
        list();
        commonService.listServiceType().then(res => { setServiceTypes(res.result.data); });
    }, []);

    return (
        <>
            <div className="page-description text-white p-2" >
                <span>Package List</span>
            </div>
            <div className="m-2 border p-2">
                <MyTable {...{ data, columns, filters, parentSData: sdata, loading, formRef, list, searchPlaceholder: 'Name or Slug', addNew: addAccess }} />
            </div>
            <AddForm ref={formRef} {...{ list, serviceTypes }} />
        </>
    );
}

const AddForm = forwardRef((props, ref) => {
    const { list, serviceTypes } = props;
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
        service.savePackage(data, data._id ? editAccess : addAccess).then((res) => {
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
                title={(!data._id ? 'Add' : 'Edit') + ' Package'}
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
                                    <label className="req">Service Type</label>
                                    <AntdSelect options={serviceTypes} value={data.serviceType} onChange={v => { handleChange(v, 'serviceType') }} />
                                </div>
                                <div className="col-md-12 form-group">
                                    <label className="req">Package Name</label>
                                    <Input value={data.name || ''} onChange={e => handleChange(e.target.value, 'name')} />
                                </div>
                                <div className="col-md-12 form-group">
                                    <label className="req">Distance (In KM)</label>
                                    <Input value={data.distance || ''} onChange={e => handleChange(util.handleFloat(e.target.value), 'distance')} />
                                </div>
                                <div className="col-md-12 form-group">
                                    <label className="req">Time (In Hour)</label>
                                    <Input value={data.time || ''} onChange={e => handleChange(util.handleFloat(e.target.value), 'time')} />
                                </div>
                                <div className="col-md-12 form-group">
                                    <label className="req">Status</label>
                                    <AntdSelect
                                        options={[{ value: true, label: "Active" }, { value: false, label: "Inactive" }]}
                                        value={data.isActive}
                                        onChange={v => { handleChange(v, 'isActive') }}
                                    />
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </Spin>
            </Modal>
        </>
    );
});