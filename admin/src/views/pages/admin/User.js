/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Popconfirm, Input, Modal, Tag, Spin, Divider } from "antd";
import { AntdSelect } from "../../../utils/Antd";
import { EditOutlined, DeleteOutlined, LoadingOutlined, EyeOutlined } from "@ant-design/icons";
import service from "../../../services/admin";
import onlyAdminService from "../../../services/onlyAdmin";
import { AntdMsg } from "../../../utils/Antd";
import UploadImage from "../../components/UploadImage";
import sdtService from "../../../services/sdt";
import { AntdDatepicker, MultiChechBox } from "../../../utils/Antd";
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
    const [modules, setModules] = useState([]);

    const formRef = useRef();
    const modulesFormRef = useRef();
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
            title: 'Modules',
            dataIndex: 'email',
            width: 100,
            render: (text, row) => (<Button size="small" type="primary" className="mx-1" onClick={() => { modulesFormRef.current.openForm(row) }}>Modules</Button>),
            hidden: !util.isSuperAdmin()
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

    const getModules = () => {
        onlyAdminService.modules(data).then(res => {
            setModules(res.result?.data || []);
        }).catch(err => {
            AntdMsg(err.message, 'error');
        }).finally(() => {
        });
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
        !util.isSuperAdmin() || getModules();
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
            {
                util.isSuperAdmin()
                    ? <ModulesForm ref={modulesFormRef} {...{ modules }} />
                    : null
            }

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
    const adharCardImgRef = useRef();
    const panCardImgRef = useRef();

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            imgRef.current = {};
            adharCardImgRef.current = {};
            panCardImgRef.current = {};

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
        data.photo = imgRef?.current?.uploadingFiles?.[0]?.base64;
        data.adharCardPhoto = adharCardImgRef?.current?.uploadingFiles?.[0]?.base64;
        data.panCardPhoto = panCardImgRef?.current?.uploadingFiles?.[0]?.base64;
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
                title={(!data._id ? 'Add' : 'Edit') + ' User'}
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
                                    <label className="req">User Name</label>
                                    <Input value={data.userName || ''} onChange={e => handleChange(util.removeSpecialChars(e.target.value), 'userName')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className={data._id ? "" : "req"}>{data._id ? "Update" : "Set"} Password</label>
                                    <Input value={data.password || ''} onChange={e => handleChange(e.target.value, 'password')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">DOB</label>
                                    <AntdDatepicker format="MMMM D, YYYY" value={data.dob || new Date()} onChange={value => { handleChange(value, 'dob') }} />
                                </div>
                                <div></div>
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
                                <div><Divider orientation="left" className="text-danger">Document Details </Divider></div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Adhar Number</label>
                                    <Input value={data.adharNo || ''} onChange={e => handleChange(e.target.value, 'adharNo')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Adhar Card photo</label>
                                    <UploadImage ref={adharCardImgRef} {...{ fileCount: 1, files: data.adharCardImage ? [data.adharCardImage] : [] }} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Pan No.</label>
                                    <Input value={data.panNo || ''} onChange={e => handleChange(e.target.value, 'panNo')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Pan Card photo</label>
                                    <UploadImage ref={panCardImgRef} {...{ fileCount: 1, files: data.panCardImage ? [data.panCardImage] : [] }} />
                                </div>
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

const ModulesForm = forwardRef((props, ref) => {
    const { modules } = props;
    const [ajxRequesting, setAjxRequesting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [userData, setUserData] = useState({});
    const [userModules, setUserModules] = useState();
    const [changeForm, setChangeForm] = useState(false);

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setUserData({ ...dt });
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

    const save = () => {
        setAjxRequesting(true);
        onlyAdminService.saveUserModules({ _id: userData._id, modules: userModules }).then((res) => {
            AntdMsg(res.message);
            handleVisible(false);
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

    const getUserModules = () => {
        setAjxRequesting(true);
        onlyAdminService.userModules({ _id: userData._id }).then(res => {
            setUserModules(res.result?.data || []);
        }).catch(err => {
            AntdMsg(err.message, 'error');
        }).finally(() => {
            setAjxRequesting(false);
        });
    }

    useEffect(() => {
        if (userData._id) {
            getUserModules();
        }
    }, [userData]);

    return (
        <>
            <Modal
                title="Assign Modules"
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
                        <fieldset>
                            <div className="row mingap">
                                <div>
                                    <div className="col-md-12 form-group">
                                        <div className="d-flex mb-2">
                                            <Button size="small" danger className="ml-auto mx-2" onClick={() => { setUserModules([]) }}> Uncheck All Modules</Button>
                                            <Button size="small" type="primary" onClick={() => { setUserModules([...modules?.map(v => v?.key)]) }}> Check All Modules</Button>
                                        </div>
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <MultiChechBox options={modules?.map(v => ({ _id: v.key, label: v.title }))} value={userModules} onChange={v => { (!v?.length || setUserModules(v)) }} />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </Spin>
            </Modal>
        </>
    );
});