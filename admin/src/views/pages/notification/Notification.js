/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Input, Modal, Spin, Popconfirm } from "antd";
import { EditOutlined, LoadingOutlined, EyeOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";
import service from "../../../services/notification";
import customerService from "../../../services/customer";
import driverService from "../../../services/driver";
import sdtService from "../../../services/sdt";
import commonService from "../../../services/common";
import adminService from "../../../services/admin";
import { AntdMsg, AntdSelect } from "../../../utils/Antd";
import util from "../../../utils/util";

export const modules = {
    view: util.getModules('viewNotification'),
    add: util.getModules('addNotification'),
    edit: util.getModules('editNotification'),
    delete: util.getModules('deleteNotification'),
};

const viewAccess = modules.view;
const addAccess = modules.add;
const editAccess = modules.edit;
const deleteAccess = modules.delete;


export default function Notification() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [sdt, setSdt] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);

    const formRef = useRef();
    let [sdata, setSData] = useState({ key: '', page: 1, limit: 20, total: 0 });
    const columns = [
        {
            title: 'To',
            dataIndex: 'to',
        },
        {
            title: 'State',
            dataIndex: 'stateDetails',
            width: 200,
            render: (data) => data?.name
        },
        {
            title: 'District',
            dataIndex: 'districtDetails',
            width: 200,
            render: (data) => data?.name
        },
        {
            title: 'Taluk',
            dataIndex: 'talukDetails',
            width: 200,
            render: (data) => data?.name
        },
        {
            title: 'Action',
            width: 100,
            hidden: !addAccess && !editAccess && !deleteAccess && !viewAccess,
            render: (text, row) => (
                <>
                    {
                        editAccess
                            ? <Button size="small" className="mx-1" onClick={() => { formRef.current.openForm({ ...text }) }}>
                                <span className="d-flex">
                                    <EditOutlined />
                                </span>
                            </Button>
                            : null
                    }

                    {
                        !editAccess && viewAccess
                            ? <Button size="small" className="mx-1" onClick={() => { formRef.current.openForm({ ...text }) }}>
                                <span className="d-flex">
                                    <EyeOutlined />
                                </span>
                            </Button>
                            : null
                    }

                    {
                        row.deletable && deleteAccess
                            ? <Button type="danger" size="small">
                                <span className="d-flex">
                                    <Popconfirm
                                        title="Are you sure to delete this email template?"
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
        service.list(data, viewAccess).then(res => {
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
        service.delete(id, deleteAccess).then(res => {
            AntdMsg(res.message);
            list();
        }).catch(err => {
            AntdMsg(err.message, 'error');
        })
    }

    useEffect(() => {
        list();
        customerService.listAll('viewCustomer').then(res => {
            setCustomers(res.result.data || []);
        }).catch(err => {
            AntdMsg('Customers are not loaded! Contact super admin if you have any permission error', 'error');
        });
        driverService.listAll({}, 'viewDriver').then(res => {
            setDrivers(res.result.data || []);
        }).catch(err => {
            AntdMsg('Drivers are not loaded! Contact super admin if you have any permission error', 'error');
        });
        adminService.listAll({}, 'viewAdmin').then(res => {
            setAdmins(res.result.data || []);
        }).catch(err => {
            AntdMsg('Admin are not loaded! Contact super admin if you have any permission error', 'error');
        });
        sdtService.listSdt('ignoreModule').then(res => { setSdt(res.result.data || []) });
        commonService.listServiceType().then(res => { setServiceTypes(res.result.data); });
    }, []);

    return (
        <>
            <div className="page-description text-white p-2" >
                <span>Email Template List</span>
            </div>
            <div className="m-2 border p-2">
                <MyTable {...{ data, columns, parentSData: sdata, loading, formRef, list, searchPlaceholder: 'Title or Key', addNew: addAccess, addNewIcon: SendOutlined, addNewText: 'Send New' }} />
            </div>
            <AddForm ref={formRef} {...{ list, sdt, customers, drivers, admins, serviceTypes }} />
        </>
    );
}


const AddForm = forwardRef((props, ref) => {
    const { list, sdt, customers, drivers, admins, serviceTypes } = props;
    const [ajxRequesting, setAjxRequesting] = useState(false);
    const [visible, setVisible] = useState(false);
    let [data, setData] = useState({});
    const [changeForm, setChangeForm] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [taluks, setTaluks] = useState([]);

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setData(dt ? { ...dt } : { deletable: true });
            handleVisible(true);
            if (!dt?._id && addAccess) {
                setChangeForm(true);
            } else if (dt._id) {
                setChangeForm(true);
            } else {
                setChangeForm(false);
            }
        }
    }));

    const handleChange = (v, k, updateState = true) => {
        if (changeForm) {
            updateState ? setData({ ...data, [k]: v }) : data = { ...data, [k]: v }
        }
    }

    const save = () => {
        setAjxRequesting(true);
        service.save(data, addAccess).then((res) => {
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
        });
    }

    useEffect(() => {
        if (data.to === 'manyCustomers') {
            setAllUsers(customers.map(v => (
                { _id: v._id, title: v.firstName + ' ' + v?.lastName + ` - (${v.email})`, state: v.state, district: v.district, taluk: v.taluk }
            )) || []);
        } else if (data.to === 'manyDrivers') {
            setAllUsers(drivers.map(v => (
                { _id: v._id, title: v.firstName + ' ' + v?.lastName + ` - (${v.email})`, state: v.state, district: v.district, taluk: v.taluk, serviceType: v?.vehicleDetails?.serviceType }
            )) || []);
        } else if (data.to === 'manyAdmins') {
            setAllUsers(admins.map(v => (
                { _id: v._id, title: v.firstName + ' ' + v?.lastName + ` - (${v.email})`, state: v.state, district: v.district, taluk: v.taluk }
            )) || []);
        } else {
            setAllUsers([]);
        }
    }, [data.to]);

    useEffect(() => { setUsers(allUsers); }, [allUsers]);

    useEffect(() => {
        handleChange(null, 'userIds');
    }, [users]);

    const checkDistrictExist = () => sdt?.find(v => v._id === data.state)?.districts.map(v => v._id)?.includes(data.district);
    const checkTalukExist = () => sdt?.find(v => v._id === data.state)?.districts.find(v => v._id === data.district)?.taluks?.map(v => v._id)?.includes(data.taluk);
    useEffect(() => { const newDistricts = sdt.find(v => v._id === data.state)?.districts || []; setDistricts(newDistricts?.map(v => ({ value: v._id, label: v.name, taluks: v.taluks })) || []); }, [data.state]);
    useEffect(() => { const newTaluks = districts?.find(v => v.value === data.district)?.taluks || []; setTaluks(newTaluks?.map(v => { return { value: v._id, label: v.name } })); }, [data.district, districts]);
    useEffect(() => { if (!checkDistrictExist()) { handleChange(null, 'district'); } }, [data.state]);
    useEffect(() => { if (!checkTalukExist()) { handleChange(null, 'taluk'); } }, [data.district, districts]);

    useEffect(() => {
        if (data.taluk) {
            setUsers(allUsers.filter(v => {
                if (data.serviceType && v.serviceType) {
                    return v?.taluk === data?.taluk && v.serviceType === data.serviceType;
                } else {
                    return v?.taluk === data?.taluk
                }
            }));
        } else if (data.district) {
            setUsers(allUsers.filter(v => {
                if (data.serviceType && v.serviceType) {
                    return v?.district === data?.district && v.serviceType === data.serviceType;
                } else {
                    return v?.district === data?.district;
                }
            }));
        } else if (data.state) {
            setUsers(allUsers.filter(v => {
                if (data.serviceType && v.serviceType) {
                    return v?.state === data?.state && v.serviceType === data.serviceType;
                } else {
                    return v?.state === data?.state;
                }
            }));
        } else if (data.serviceType) {
            setUsers(allUsers.filter(v => {
                if (v.serviceType) {
                    return v.serviceType === data.serviceType;
                } else {
                    return true;
                }
            }));
        } else {
            setUsers(allUsers);
        }
    }, [data.serviceType, data.state, data.district, data.taluk, allUsers]);

    return (
        <>
            <Modal
                title={'Send Email'}
                style={{ top: 20 }}
                visible={visible}
                okText={<div className="d-flex">Send <SendOutlined className="my-auto mx-1" /></div>}
                onOk={save}
                okButtonProps={{ disabled: ajxRequesting || (!changeForm), style: { display: !changeForm ? 'none' : 'inline-block' } }}
                onCancel={() => { handleVisible(false); }}
                destroyOnClose
                maskClosable={false}
                width={1200}
                className="app-modal-body-overflow"
            >
                <Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                    <form onSubmit={e => { e.preventDefault(); save() }} autoComplete="off" spellCheck="false">
                        <fieldset className="" disabled={!changeForm}>
                            <div className="row mingap">

                                <div className="col-md-4 form-group">
                                    <label className="req">State</label>
                                    <AntdSelect
                                        placeholder="All States"
                                        allowClear
                                        options={sdt.map(v => ({ value: v._id, label: v.name }))}
                                        value={data.state}
                                        onChange={v => { handleChange(v, 'state') }}
                                    />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">District</label>
                                    <AntdSelect
                                        placeholder="All Districts"
                                        allowClear
                                        options={districts || []}
                                        value={data.district}
                                        onChange={v => { handleChange(v, 'district') }}
                                    />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Taluk</label>
                                    <AntdSelect
                                        placeholder="All Taluks"
                                        allowClear
                                        options={taluks || []}
                                        value={data.taluk}
                                        onChange={v => { handleChange(v, 'taluk') }}
                                    />
                                </div>
                                <div></div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Send To</label>
                                    <AntdSelect
                                        options={[
                                            { _id: 'manyCustomers', title: 'Many Customers' },
                                            { _id: 'manyDrivers', title: 'Many Drivers' },
                                            { _id: 'manyAdmins', title: 'Many Admins' },
                                            { _id: 'allCustomers', title: 'All Customers' },
                                            { _id: 'allDrivers', title: 'All Drivers' },
                                            { _id: 'allAdmins', title: 'All Admins' },
                                        ]}
                                        value={data.to}
                                        onChange={v => { handleChange(v, 'to') }}
                                    />
                                </div>
                                {
                                    ['manyDrivers', 'allDrivers'].includes(data.to)
                                        ? <div className="col-md-4 form-group">
                                            <label className="req">Service Type</label>
                                            <AntdSelect
                                                allowClear
                                                placeholder="All Service Types"
                                                options={serviceTypes || []}
                                                value={data.serviceType}
                                                onChange={v => { handleChange(v, 'serviceType') }}
                                            />
                                        </div>
                                        : null
                                }
                                {
                                    ['manyCustomers', 'manyDrivers', 'manyAdmins'].includes(data.to)
                                        ? <div className="col-md-12 form-group">
                                            <label className="req">Select Users</label>
                                            <AntdSelect
                                                mode={'multiple'}
                                                placeholder={'Select Users'}
                                                options={users || []}
                                                value={data.userIds}
                                                onChange={v => { handleChange(v, 'userIds') }}
                                            />
                                        </div>
                                        : null
                                }
                                <div className="col-md-12 form-group">
                                    <label className="req">Content</label>
                                    <Input.TextArea value={data.content} onChange={e => { handleChange(e.target.value, 'content') }} />
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </Spin>
            </Modal>
        </>
    );
});