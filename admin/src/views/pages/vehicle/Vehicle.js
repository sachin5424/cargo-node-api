/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Popconfirm, Input, Modal, Tag, Spin, Image, Divider } from "antd";
import { AntdSelect, MultiChechBox } from "../../../utils/Antd";
import { EditOutlined, DeleteOutlined, LoadingOutlined, EyeOutlined } from "@ant-design/icons";
import service from "../../../services/vehicle";
import commonService from "../../../services/common";
import rideService from "../../../services/ride";
import { AntdMsg } from "../../../utils/Antd";
import UploadImage from "../../components/UploadImage";
import util from "../../../utils/util";

export const modules = {
    view: util.getModules('viewVehicle'),
    add: util.getModules('addVehicle'),
    edit: util.getModules('editVehicle'),
    delete: util.getModules('deleteVehicle'),
};

const viewAccess = modules.view;
const addAccess = modules.add;
const editAccess = modules.edit;
const deleteAccess = modules.delete;


export default function Vehicle() {

    const [data, setData] = useState([]);
    const [serviceType, setServiceType] = useState([]);
    const [rideTypes, setRideTypes] = useState();
    const [loading, setLoading] = useState(true);

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
        },
        {
            title: 'Vehicle Number',
            dataIndex: 'vehicleNumber',
            width: 200,
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
        commonService.listServiceType().then(res => { setServiceType(res.result.data); });
        rideService.listAllRideType({}, 'viewRideType').then(res => { setRideTypes(res.result.data); })
    }, []);

    return (
        <>
            <div className="page-description text-white p-2" >
                <span>Vehicle List</span>
            </div>
            <div className="m-2 border p-2">
                <MyTable {...{ data, columns, parentSData: sdata, loading, formRef, list, searchPlaceholder: 'Name or Slug', addNew: addAccess }} />
            </div>
            <AddForm ref={formRef} {...{ list, serviceType, rideTypes }} />
        </>
    );
}

const AddForm = forwardRef((props, ref) => {
    const { list, serviceType, rideTypes: parRideTypes } = props;
    const [ajxRequesting, setAjxRequesting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});
    const [rideTypes, setRideTypes] = useState([]);
    const [vehicleCategories, setVehicleCategories] = useState([]);
    const [changeForm, setChangeForm] = useState(false);
    const primaryImgRef = useRef();
    const otherImgRef = useRef();

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            primaryImgRef.current = {};
            otherImgRef.current = {};
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

    useEffect(() => { handleChange(util.removeSpecialChars(data.name || ''), 'slug'); }, [data.name]);
    useEffect(() => {
        const newRideTypes = parRideTypes?.filter(v => {
            if (v.serviceType._id === data.serviceType) {
                return v.serviceType
            }
        });

        setRideTypes(newRideTypes || []);
    }, [data.serviceType]);

    useEffect(() => {
        handleChange([], 'rideTypes');
    }, [rideTypes]);

    useEffect(() => {
        let newVehicleCategories = parRideTypes?.filter(v => data.rideTypes?.includes(v._id));
        newVehicleCategories = newVehicleCategories?.map(v => v.allowedVehicleCategoriesDetails)?.flat(1);
        newVehicleCategories = newVehicleCategories?.filter((value, index, self) =>
            index === self.findIndex((t) => t._id === value._id)
        );

        setVehicleCategories(newVehicleCategories);
    }, [rideTypes, data.rideTypes]);

    useEffect(() => {
        if(Array.isArray(vehicleCategories) && vehicleCategories.length > 0){
            const flagUpdate = vehicleCategories?.filter(v => v._id === data.vehicleCategory);
            if (flagUpdate?.length === 0) { handleChange('', 'vehicleCategory'); }
        }
    }, [vehicleCategories]);

    const save = () => {
        console.log(otherImgRef.current);
        setAjxRequesting(true);
        data.primaryPhoto = primaryImgRef?.current?.uploadingFiles?.[0]?.base64;
        data.otherPhotos = otherImgRef?.current?.uploadingFiles?.map(v=>v.base64);
        data.deletingFiles = otherImgRef?.current?.deletingFiles;
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

    return (
        <>
            <Modal
                title={(!data._id ? 'Add' : 'Edit') + ' Vehicle'}
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
                                    <label className="req">Service Type</label>
                                    <AntdSelect options={serviceType} value={data.serviceType} onChange={v => { handleChange(v, 'serviceType') }} />
                                </div>
                                {
                                    rideTypes?.length
                                        ? <div className="col-md-6 form-group">
                                            <label className="req">Ride Types</label>
                                            <MultiChechBox options={rideTypes} {...{ col: 4 }} value={data.rideTypes} onChange={v => { (!v?.length || handleChange(v, 'rideTypes')) }} />
                                        </div>
                                        : null
                                }

                                {
                                    vehicleCategories?.length
                                        ? <div className="col-md-3 form-group">
                                            <label className="req">Vehicle Categories</label>
                                            <AntdSelect options={vehicleCategories} value={ data.vehicleCategory || ''} onChange={v => { handleChange(v, 'vehicleCategory') }} />
                                        </div>
                                        : null
                                }

                                <Divider />
                                <div className="col-md-4 form-group">
                                    <label className="req">Name</label>
                                    <Input value={data.name || ''} onChange={e => handleChange(e.target.value, 'name')} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Vehicle Number</label>
                                    <Input value={data.vehicleNumber || ''} onChange={e => handleChange(e.target.value, 'vehicleNumber')} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Available Seats</label>
                                    <Input value={data.availableSeats || ''} onChange={e => handleChange(util.handleInteger(e.target.value, 2), 'availableSeats')} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Available Capacity</label>
                                    <Input value={data.availableCapacity || ''} onChange={e => handleChange(e.target.value, 'availableCapacity')} />
                                </div>
                                <div></div>
                                <div className="col-md-2 form-group">
                                    <label className="req">Primary Image</label>
                                    <UploadImage ref={primaryImgRef} {...{ fileCount: 1, files: data.image ? [data.image] : [] }} />
                                </div>
                                <div className="col-md-10 form-group">
                                    <label className="req">Images</label>
                                    <UploadImage ref={otherImgRef} {...{ fileCount: 4, files: data.otherPhotos ? data.otherPhotos : [] }} />
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