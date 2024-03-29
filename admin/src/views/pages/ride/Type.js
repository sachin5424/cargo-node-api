/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Input, Modal, Tag, Spin, Image } from "antd";
import { AntdSelect } from "../../../utils/Antd";
import { EditOutlined, LoadingOutlined, EyeOutlined } from "@ant-design/icons";
import service from "../../../services/ride";
import { AntdMsg, MultiChechBox } from "../../../utils/Antd";
import UploadImage from "../../components/UploadImage";
import util from "../../../utils/util";
import commonService from "../../../services/common";
import vehicleService from "../../../services/vehicle";

export const modules = {
    view: util.getModules('viewRideType'),
    add: util.getModules('addRideType'),
    edit: util.getModules('editRideType'),
    delete: util.getModules('deleteRideType'),
};

const viewAccess = modules.view;
const addAccess = modules.add;
const editAccess = modules.edit;
const deleteAccess = modules.delete;


export default function Type() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serviceType, setServiceType] = useState([]);
    const [filters, setFilters] = useState([]);
    const [vehicleCategories, setVehicleCategories] = useState([]);

    const formRef = useRef();
    let [sdata, setSData] = useState({ key: '', page: 1, limit: 20, total: 0 });
    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            width: 100,
            render: (v) => (<Image height={30} preview={{ mask: "View" }} src={v?.url} />)
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: 200,
        },
        {
            title: 'Allowed Vehicle Categories',
            dataIndex: 'allowedVehicleCategoriesDetails',
            render: (data, row) => (
                data.map((v, i) => {
                    return <Tag color={
                        i % 4 === 0
                            ? 'blue'
                            : i % 4 === 1
                                ? 'gold'
                                : i % 4 === 2
                                    ? 'cyan'
                                    : 'pink'
                    } key={i}>{v.name}</Tag>
                })
            )
        },
        {
            title: 'Service Type',
            dataIndex: 'serviceType',
            width: 100,
            render: serviceType => {
                if (serviceType.key === 'cargo') {
                    return <Tag color="magenta">{serviceType.name}</Tag>
                } else {
                    return <Tag color="orange">{serviceType.name}</Tag>
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
            width: 60,
            hidden: !addAccess && !editAccess && !deleteAccess && !viewAccess,
            render: (text, row) => (
                <>
                    {
                        editAccess
                            ? <Button size="small" className="mx-1" onClick={() => { formRef.current.openForm({serviceType: sdata?.serviceType, ...text }) }}>
                                <span className="d-flex">
                                    <EditOutlined />
                                </span>
                            </Button>
                            : null
                    }

                    {
                        !editAccess && viewAccess
                            ? <Button size="small" className="mx-1" onClick={() => { formRef.current.openForm({serviceType: sdata?.serviceType, ...text }) }}>
                                <span className="d-flex">
                                    <EyeOutlined />
                                </span>
                            </Button>
                            : null
                    }

                    {/* {
                        deleteAccess
                            ? <Button type="danger" size="small">
                                <span className="d-flex">
                                    <Popconfirm
                                        title="Are you sure to delete this ride type?"
                                        onConfirm={() => deleteConfirm(row._id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <DeleteOutlined />
                                    </Popconfirm>
                                </span>
                            </Button>
                            : null
                    } */}


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

    // const deleteConfirm = (id) => {
    //     service.deleteRideType(id, deleteAccess).then(res => {
    //         AntdMsg(res.message);
    //         list();
    //     }).catch(err => {
    //         AntdMsg(err.message, 'error');
    //     })
    // }

    useEffect(() => {
        list();
        commonService.listServiceType().then(res=>{setServiceType(res.result.data);});
        vehicleService.listAllCategory({}, 'viewVehicleCategory').then(res=>{setVehicleCategories(res.result.data);});
    }, []);

    useEffect(()=>{
        setFilters([
            {
                type: 'dropdown',
                key: 'serviceType',
                placeholder: 'Service Type',
                className: "w200 mx-1",
                options: serviceType
            }
        ]);
    }, [serviceType]);

    return (
        <>
            <div className="page-description text-white p-2" >
                <span>Ride Type List</span>
            </div>
            <div className="m-2 border p-2">
                <MyTable {...{ data, columns, parentSData: sdata, filters, loading, formRef, list, searchPlaceholder: 'Name or Slug', addNew: false }} />
            </div>
            <AddForm ref={formRef} {...{ list, serviceType, vehicleCategories }} />
        </>
    );
}

const AddForm = forwardRef((props, ref) => {
    const { list, serviceType, vehicleCategories } = props;
    const [ajxRequesting, setAjxRequesting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});
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

    // useEffect(() => { handleChange(util.removeSpecialChars(data.name || ''), 'key'); }, [data.name]);

    const save = () => {
        setAjxRequesting(true);
        data.photo = imgRef?.current?.uploadingFiles?.[0]?.base64;
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
                title={(!data._id ? 'Add' : 'Edit') + ' Ride Type'}
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
                                <div className="col-md-6 form-group">
                                    <label className="req">Service Type</label>
                                    <AntdSelect
                                        options={serviceType}
                                        value={data?.serviceType?._id}
                                        disabled={data._id}
                                        onChange={v => { /*handleChange(v, 'serviceType')*/ }}
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label className="req">Name</label>
                                    <Input value={data.name || ''} onChange={e => handleChange(e.target.value, 'name')} />
                                </div>
                                <div className="col-md-12 form-group">
                                    <label className="req">Vehicle Categories</label>
                                    <MultiChechBox options={vehicleCategories} value={data.allowedVehicleCategories} onChange={v => { (!v?.length || handleChange(v, 'allowedVehicleCategories')) }} />

                                </div>
                                <div className="col-md-12 form-group">
                                    <label className="req">Image</label>
                                    <UploadImage ref={imgRef} {...{ fileCount: 1, files: data.image ? [data.image] : [] }} />
                                </div>
                                <div></div>

                                <div className="col-md-4 form-group">
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