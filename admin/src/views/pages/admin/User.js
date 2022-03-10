/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Popconfirm, Input, Modal, Tag, Spin } from "antd";
import { AntdSelect } from "../../../utils/Antd";
import { EditOutlined, DeleteOutlined, LoadingOutlined, EyeOutlined } from "@ant-design/icons";
import service from "../../../services/admin";
import { AntdMsg } from "../../../utils/Antd";
import UploadImage from "../../components/UploadImage";
import sdtService from "../../../services/sdt";
import { AntdDatepicker } from "../../../utils/Antd";
import util from "../../../utils/util";
import { UserTypeSelect } from "../../components/ProComponent";

export const modules = {
    view: util.getModules('viewUser'),
    add: util.getModules('addUser'),
    edit: util.getModules('editUser'),
    delete: util.getModules('deleteUser'),
};

const viewAccess = modules.view;
const addAccess = modules.add;
const editAccess = modules.edit;
const deleteAccess = modules.delete;


export default function Admin() {

    const [data, setData] = useState([]);
    const [sdt, setSdt] = useState([]);
    const [loading, setLoading] = useState(true);

    const formRef = useRef();
    let [sdata, setSData] = useState({ key: '', page: 1, limit: 20, total: 0 });
    const columns = [
        {
            title: 'Name',
            dataIndex: 'firstName',
            render: (id, row) => row.firstName + ' ' + row.lastName,
        },
        {
            title: 'User Type',
            dataIndex: 'type',
            width: 150,
            render: (text) =>
                <Tag
                    color={text === 'stateAdmin'
                        ? 'geekblue'
                        : text === 'districtAdmin'
                            ? 'magenta'
                            : text === 'talukAdmin'
                                ? 'orange'
                                : ''}
                >
                    {text === 'stateAdmin'
                        ? 'State Admin'
                        : text === 'districtAdmin'
                            ? 'District Admin'
                            : text === 'talukAdmin'
                                ? 'Taluk Admin'
                                : ''}
                </Tag>

        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 200,
        },
        {
            title: 'Phone No',
            dataIndex: 'phoneNo',
            width: 100,
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
                                        title="Are you sure to delete this admin?"
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
        sdtService.listSdt('ignoreModule').then(res => { setSdt(res.result.data || []) });
    }, []);

    return (
        <>
            <div className="page-description text-white p-2" >
                <span>Admin List</span>
            </div>
            <div className="m-2 border p-2">
                <MyTable {...{ data, columns, parentSData: sdata, loading, formRef, list, searchPlaceholder: 'First Name or Last Name', addNew: addAccess }} />
            </div>
            <AddForm ref={formRef} {...{ list, sdt }} />
        </>
    );
}

const AddForm = forwardRef((props, ref) => {
    const { list, sdt } = props;
    const [ajxRequesting, setAjxRequesting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});
    const [districts, setDistricts] = useState([]);
    const [taluks, setTaluks] = useState([]);
    const [changeForm, setChangeForm] = useState(false);
    const imgRef = useRef();

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            imgRef.current = {};
            setData(dt ? { ...dt } : { isActive: true });
            handleVisible(true);
            if (!dt._id && addAccess) {
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
        data.photo = imgRef?.current?.uploadingFiles?.[0]?.base64;
        service.save(data, data._id ? editAccess : addAccess).then((res) => {
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

    const checkDistrictExist = () => sdt?.find(v => v._id === data.state)?.districts.map(v => v._id)?.includes(data.district)

    const checkTalukExist = () => sdt?.find(v => v._id === data.state)?.districts.find(v => v._id === data.district)?.taluks?.map(v => v._id)?.includes(data.taluk)

    useEffect(() => {
        const newDistricts = sdt.find(v => v._id === data.state)?.districts || [];
        setDistricts(newDistricts?.map(v => ({ value: v._id, label: v.name, taluks: v.taluks })) || [])
    }, [data.state])

    useEffect(() => {
        const newTaluks = districts?.find(v => v.value === data.district)?.taluks || [];
        setTaluks(newTaluks?.map(v => { return { value: v._id, label: v.name } }))
    }, [data.district, districts])

    useEffect(() => {
        if (!checkDistrictExist()) {
            handleChange('', 'district');
        }
    }, [data.state])

    useEffect(() => {
        if (!checkTalukExist()) {
            handleChange('', 'taluk');
        }
    }, [data.district, districts])

    return (
        <>
            <Modal
                title={(!data._id ? 'Add' : 'Edit') + ' Customer'}
                style={{ top: 20 }}
                visible={visible}
                okText="Save"
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
                                <div className="col-md-3 form-group">
                                    <label className="req">Type</label>
                                    <UserTypeSelect {...{ data, handleChange }} />
                                </div>
                                <div></div>
                                <div className="col-md-6 form-group">
                                    <label className="req">First Name</label>
                                    <Input value={data.firstName || ''} onChange={e => handleChange(e.target.value, 'firstName')} />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label className="req">Last Name</label>
                                    <Input value={data.lastName || ''} onChange={e => handleChange(e.target.value, 'lastName')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Email</label>
                                    <Input value={data.email || ''} onChange={e => handleChange(e.target.value, 'email')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Phone No.</label>
                                    <Input value={data.phoneNo || ''} onChange={e => handleChange(util.handleInteger(e.target.value), 'phoneNo')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className={data._id ? "" : "req"}>{data._id ? "Update" : "Set"} Password</label>
                                    <Input value={data.password || ''} onChange={e => handleChange(e.target.value, 'password')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">DOB</label>
                                    <AntdDatepicker format="MMMM D, YYYY" value={data.dob || new Date()} onChange={value => { handleChange(value, 'dob') }} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">State</label>
                                    <AntdSelect
                                        options={sdt.map(v => ({ value: v._id, label: v.name }))}
                                        value={data.state}
                                        onChange={v => { handleChange(v, 'state') }}
                                    />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">District</label>
                                    <AntdSelect
                                        options={districts || []}
                                        value={data.district}
                                        onChange={v => { handleChange(v, 'district') }}
                                    />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Taluk</label>
                                    <AntdSelect
                                        options={taluks || []}
                                        value={data.taluk}
                                        onChange={v => { handleChange(v, 'taluk') }}
                                    />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Zip Code</label>
                                    <Input value={data.zipcode || ''} onChange={e => { handleChange(util.handleInteger(e.target.value, 6), 'zipcode') }} />
                                </div>

                                <div className="col-md-12 form-group">
                                    <label className="req">Address</label>
                                    <Input.TextArea value={data.address || ''} onChange={e => { handleChange(e.target.value, 'address') }} />
                                </div>
                                <div className="col-md-12 form-group">
                                    <label className="req">Image</label>
                                    <UploadImage ref={imgRef} {...{ fileCount: 1, files: data.image ? [data.image] : [] }} />
                                </div>
                                <div></div>
                                <div className="col-md-3 form-group">
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