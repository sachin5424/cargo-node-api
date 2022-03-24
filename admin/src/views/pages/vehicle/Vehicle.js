/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Popconfirm, Input, Modal, Tag, Spin, Image, Divider } from "antd";
import { AntdSelect, MultiChechBox, AntdDatepicker } from "../../../utils/Antd";
import { EditOutlined, DeleteOutlined, LoadingOutlined, EyeOutlined } from "@ant-design/icons";
import service from "../../../services/vehicle";
import commonService from "../../../services/common";
import rideService from "../../../services/ride";
import sdtService from "../../../services/sdt";
import { AntdMsg } from "../../../utils/Antd";
import UploadImage from "../../components/UploadImage";
import util from "../../../utils/util";
import moment from "moment";
import Driver from "../driver/Driver";

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
    const [makes, setMakes] = useState();
    const [colors, setColors] = useState([]);
    const [sdt, setSdt] = useState([]);

    const formRef = useRef();
    const driverFormRef = useRef();
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
            title: 'Driver',
            dataIndex: '',
            width: 80,
            hidden: ! util.getModules('viewDriver'),
            render: (isActive, row) => {
                return <Button size="small" className="mx-1" onClick={() => { driverFormRef.current.openForm(row) }}>
                    <span className="d-flex">
                        Driver
                    </span>
                </Button>
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
                                        title="Are you sure to delete this vehicle?"
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
        rideService.listAllRideType({}, 'viewRideType').then(res => { setRideTypes(res.result.data); });
        service.listAllMake({ models: 1, active: 1, modelActive: 1 }, 'viewMake').then(res => { setMakes(res.result.data); });
        service.listAllColor({}, 'viewColor').then(res => { setColors(res.result.data); });
        sdtService.listSdt('ignoreModule').then(res => { setSdt(res.result.data || []) });
    }, []);

    return (
        <>
            <div className="page-description text-white p-2" >
                <span>Vehicle List</span>
            </div>
            <div className="m-2 border p-2">
                <MyTable {...{ data, columns, parentSData: sdata, loading, formRef, list, searchPlaceholder: 'Name', addNew: addAccess }} />
            </div>
            <AddForm ref={formRef} {...{ list, serviceType, rideTypes, makes, colors, sdt }} />
            <AddFormDriver ref={driverFormRef} />
        </>
    );
}

const AddForm = forwardRef((props, ref) => {
    const { list, serviceType, rideTypes: parRideTypes, makes, colors, sdt } = props;
    const [ajxRequesting, setAjxRequesting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});
    const [rideTypes, setRideTypes] = useState([]);
    const [vehicleCategories, setVehicleCategories] = useState([]);
    const [changeForm, setChangeForm] = useState(false);
    const [models, setModels] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [taluks, setTaluks] = useState([]);
    const primaryImgRef = useRef();
    const otherImgRef = useRef();
    const registrationImgRef = useRef();
    const insuranceImgRef = useRef();
    const permitImgRef = useRef();
    const pollutionImgRef = useRef();

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            primaryImgRef.current = {};
            otherImgRef.current = {};
            registrationImgRef.current = {};
            insuranceImgRef.current = {};
            permitImgRef.current = {};
            pollutionImgRef.current = {};
            dt.registrationExpiryDate = moment(dt.registrationExpiryDate).format('YYYY-MM-DD');
            dt.insuranceExpiryDate = moment(dt.insuranceExpiryDate).format('YYYY-MM-DD');
            dt.permitExpiryDate = moment(dt.permitExpiryDate).format('YYYY-MM-DD');
            dt.pollutionExpiryDate = moment(dt.pollutionExpiryDate).format('YYYY-MM-DD');
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
        const newModels = makes?.find(v => data.make === v._id)?.models || [];
        setModels([...newModels]);
    }, [data.make]);

    useEffect(() => {
        if (!models?.map(v => v._id)?.includes(data?.model)) {
            handleChange('', 'model');
        }
    }, [models]);

    useEffect(() => {
        handleChange(
            (makes?.find(v => v._id === data.make)?.name || '')
            + " - " + (models?.find(v => v._id === data.model)?.name || '')
            , 'name');
    }, [data.make, data.model]);


    useEffect(() => {
        if (Array.isArray(vehicleCategories) && vehicleCategories.length > 0) {
            const flagUpdate = vehicleCategories?.filter(v => v._id === data.vehicleCategory);
            if (flagUpdate?.length === 0) { handleChange('', 'vehicleCategory'); }
        }
    }, [vehicleCategories]);

    const checkDistrictExist = () => sdt?.find(v => v._id === data.state)?.districts.map(v => v._id)?.includes(data.district)
    const checkTalukExist = () => sdt?.find(v => v._id === data.state)?.districts.find(v => v._id === data.district)?.taluks?.map(v => v._id)?.includes(data.taluk)
    useEffect(() => {
        const newDistricts = sdt.find(v => v._id === data.state)?.districts || [];
        setDistricts(newDistricts?.map(v => ({ value: v._id, label: v.name, taluks: v.taluks })) || [])
    }, [data.state]);
    useEffect(() => {
        const newTaluks = districts?.find(v => v.value === data.district)?.taluks || [];
        setTaluks(newTaluks?.map(v => { return { value: v._id, label: v.name } }))
    }, [data.district, districts]);
    useEffect(() => {
        if (!checkDistrictExist()) {
            handleChange('', 'district');
        }
    }, [data.state]);
    useEffect(() => {
        if (!checkTalukExist()) {
            handleChange('', 'taluk');
        }
    }, [data.district, districts]);

    const save = () => {
        setAjxRequesting(true);
        data.primaryPhoto = primaryImgRef?.current?.uploadingFiles?.[0]?.base64;
        data.otherPhotos = otherImgRef?.current?.uploadingFiles?.map(v => v.base64);
        data.registrationPhoto = registrationImgRef?.current?.uploadingFiles?.[0]?.base64;
        data.insurancePhoto = insuranceImgRef?.current?.uploadingFiles?.[0]?.base64;
        data.permitPhoto = permitImgRef?.current?.uploadingFiles?.[0]?.base64;
        data.pollutionPhoto = pollutionImgRef?.current?.uploadingFiles?.[0]?.base64;
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
                                <div><Divider orientation="left" className="text-danger">Service Type </Divider></div>
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
                                            <AntdSelect options={vehicleCategories} value={data.vehicleCategory || ''} onChange={v => { handleChange(v, 'vehicleCategory') }} />
                                        </div>
                                        : null
                                }

                                <div><Divider orientation="left" className="text-danger">Make Details </Divider></div>

                                <div className="col-md-3 form-group">
                                    <label className="req">Make</label>
                                    <AntdSelect options={makes} value={data.make || ''} onChange={v => { handleChange(v, 'make') }} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Model</label>
                                    <AntdSelect options={models} value={data.model || ''} onChange={v => { handleChange(v, 'model') }} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Color</label>
                                    <AntdSelect options={colors} value={data.color || ''} onChange={v => { handleChange(v, 'color') }} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Manufacturing Year</label>
                                    <AntdDatepicker picker="year" format="YYYY" getFormat="YYYY" disableUpcomingDate={true} value={data.manufacturingYear || new Date()} onChange={value => { handleChange(value, 'manufacturingYear') }} />
                                </div>

                                <div><Divider orientation="left" className="text-danger">Basic Details</Divider></div>

                                <div className="col-md-3 form-group">
                                    <label className="req">Name</label>
                                    <Input value={data.name || ''} onChange={e => handleChange(e.target.value, 'name')} disabled />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Vehicle Number</label>
                                    <Input value={data.vehicleNumber || ''} onChange={e => handleChange(e.target.value, 'vehicleNumber')} />
                                </div>
                                {
                                    serviceType?.find(v => v._id === data.serviceType)?.key === 'taxi'
                                        ? <div className="col-md-3 form-group">
                                            <label className="req">Available Seats</label>
                                            <Input value={data.availableSeats || ''} onChange={e => handleChange(util.handleInteger(e.target.value, 2), 'availableSeats')} />
                                        </div>
                                        : null
                                }
                                {
                                    serviceType?.find(v => v._id === data.serviceType)?.key === 'cargo'
                                        ? <div className="col-md-3 form-group">
                                            <label className="req">Available Capacity (in tons)</label>
                                            <Input value={data.availableCapacity || ''} onChange={e => handleChange(e.target.value, 'availableCapacity')} />
                                        </div>
                                        : null
                                }
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
                                <div></div>
                                <div className="col-md-2 form-group">
                                    <label className="req">Primary Image</label>
                                    <UploadImage ref={primaryImgRef} {...{ fileCount: 1, files: data.image ? [data.image] : [] }} />
                                </div>
                                <div className="col-md-10 form-group">
                                    <label className="req">Images</label>
                                    <UploadImage ref={otherImgRef} {...{ fileCount: 4, files: data.otherPhotos ? data.otherPhotos : [] }} />
                                </div>

                                <div><Divider orientation="left" className="text-danger">Registration</Divider></div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Registration Number</label>
                                    <Input value={data.registrationNumber || ''} onChange={e => handleChange(e.target.value, 'registrationNumber')} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Registration Expiry Date</label>
                                    <AntdDatepicker format="MMMM D, YYYY" disablePastDate={true} value={data.registrationExpiryDate || new Date()} onChange={value => { handleChange(value, 'registrationExpiryDate') }} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Registration Image</label>
                                    <UploadImage ref={registrationImgRef} {...{ fileCount: 1, files: data.registrationImage ? [data.registrationImage] : [] }} />
                                </div>

                                <div><Divider orientation="left" className="text-danger">Insurance</Divider></div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Insurance Number</label>
                                    <Input value={data.insuranceNumber || ''} onChange={e => handleChange(e.target.value, 'insuranceNumber')} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Insurance Expiry Date</label>
                                    <AntdDatepicker format="MMMM D, YYYY" disablePastDate={true} value={data.insuranceExpiryDate || new Date()} onChange={value => { handleChange(value, 'insuranceExpiryDate') }} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Insurance Image</label>
                                    <UploadImage ref={insuranceImgRef} {...{ fileCount: 1, files: data.insuranceImage ? [data.insuranceImage] : [] }} />
                                </div>

                                <div><Divider orientation="left" className="text-danger">Permit</Divider></div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Permit Number</label>
                                    <Input value={data.permitNumber || ''} onChange={e => handleChange(e.target.value, 'permitNumber')} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Permit Expiry Date</label>
                                    <AntdDatepicker format="MMMM D, YYYY" disablePastDate={true} value={data.permitExpiryDate || new Date()} onChange={value => { handleChange(value, 'permitExpiryDate') }} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Permit Image</label>
                                    <UploadImage ref={permitImgRef} {...{ fileCount: 1, files: data.permitImage ? [data.permitImage] : [] }} />
                                </div>

                                <div><Divider orientation="left" className="text-danger">Pollution Certificate</Divider></div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Pollution Certificate Number</label>
                                    <Input value={data.pollutionNumber || ''} onChange={e => handleChange(e.target.value, 'pollutionNumber')} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Pollution Certificate Expiry Date</label>
                                    <AntdDatepicker format="MMMM D, YYYY" disablePastDate={true} value={data.pollutionExpiryDate || new Date()} onChange={value => { handleChange(value, 'pollutionExpiryDate') }} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Pollution Certificate Image</label>
                                    <UploadImage ref={pollutionImgRef} {...{ fileCount: 1, files: data.pollutionImage ? [data.pollutionImage] : [] }} />
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

const AddFormDriver = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setData(dt);
            setVisible(true);
        }
    }));


    return (
        <>
            <Modal
                style={{ top: 20 }}
                visible={visible}
                onCancel={() => { setVisible(false); }}
                destroyOnClose
                maskClosable={false}
                width={200}
                // bodyStyle={{display: "none"}}
                closable={false}
                footer={null}
            >
                <Spin spinning={true} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>Loading</Spin>
                <Driver {...{vehicleData: data, setVisible}} />
            </Modal>
        </>
    );
});