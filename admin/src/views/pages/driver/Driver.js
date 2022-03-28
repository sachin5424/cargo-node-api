/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Popconfirm, Input, Modal, Tag, Spin, Divider } from "antd";
import { AntdSelect } from "../../../utils/Antd";
import { EditOutlined, DeleteOutlined, LoadingOutlined, EyeOutlined } from "@ant-design/icons";
import service from "../../../services/driver";
import { AntdMsg } from "../../../utils/Antd";
import UploadImage from "../../components/UploadImage";
import sdtService from "../../../services/sdt";
import commonService from "../../../services/common";
import vehicleService from "../../../services/vehicle";
import { AntdDatepicker } from "../../../utils/Antd";
import util from "../../../utils/util";
import moment from "moment";
import Wallet from "./Wallet";

export const modules = {
    view: util.getModules('viewDriver'),
    add: util.getModules('addDriver'),
    edit: util.getModules('editDriver'),
    delete: util.getModules('deleteDriver'),
};

const viewAccess = modules.view;
const addAccess = modules.add;
const editAccess = modules.edit;
const deleteAccess = modules.delete;


export default function Driver({ vehicleData, setVisible: setVisibleParent }) {

    const [data, setData] = useState();
    const [sdt, setSdt] = useState([]);
    const [loading, setLoading] = useState(true);
    const [vehicles, setVehicles] = useState([]);
    const [serviceType, setServiceType] = useState([]);
    const [filters, setFilters] = useState([
        {
            type: 'dropdown',
            key: 'isApproved',
            className: "w200 mx-1",
            placeholder: 'Approval Status',
            options: [
                { id: 0, name: 'Not Approved' },
                { id: 1, name: 'Approved' },
            ]
        }
    ]);

    const formRef = useRef();
    const walletModalRef = useRef();
    let [sdata, setSData] = useState({ key: '', page: 1, limit: 20, total: 0, vehicleId: vehicleData?._id });
    const columns = [
        {
            title: 'Driver Id',
            dataIndex: 'driverId',
            width: 200,
        },
        {
            title: 'Name',
            dataIndex: 'name',
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
            title: 'Wallet',
            dataIndex: 'walletDetails',
            hidden: !util.getModules('viewWallet'),
            width: 100,
            render: (walletDetails, row) => (
                <Button size="small" type="primary" className="mx-1" onClick={() => { walletModalRef.current.openForm(row) }}>Wallet  ({walletDetails?.[0]?.amount})</Button>
            )
        },
        {
            title: 'Approval Status',
            dataIndex: 'isApproved',
            width: 120,
            render: isApproved => {
                if (isApproved) {
                    return <Tag color='green'>Approved</Tag>
                } else {
                    return <Tag color='red'>Not Approved</Tag>
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
                                        title="Are you sure to delete this driver?"
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
        if (serviceType.length > 0) {
            setFilters([...filters, {
                type: 'dropdown',
                key: 'serviceType',
                placeholder: 'Service Type',
                className: "w200 mx-1",
                options: serviceType
            }]);
        }
    }, [serviceType]);

    useEffect(() => {
        list();
        sdtService.listSdt('ignoreModule').then(res => { setSdt(res.result.data || []) });
        // vehicleService.listAll({}, 'viewVehicle').then(res => { setVehicles(res.result.data || []) });
        commonService.listServiceType().then(res => { setServiceType(res.result.data); });
    }, []);

    useEffect(() => {
        if (vehicleData && typeof data === "object") {
            formRef.current.openForm(data?.[0] ? data?.[0] : { vehicle: vehicleData._id, isActive: true, isApproved: false });
        }
    }, [data]);

    return (
        <>

            {
                !vehicleData
                    ? <>
                        <div className="page-description text-white p-2" >
                            <span>Driver List</span>
                        </div>
                        <div className="m-2 border p-2">
                            <MyTable {...{ data, columns, filters, parentSData: sdata, loading, formRef, list, searchPlaceholder: 'First Name or Last Name or Driver Id', addNew: false }} />
                        </div>
                    </>
                    : null
            }
            <AddForm ref={formRef} {...{ list, sdt, vehicles, setVisibleParent }} />
            <WalletModal ref={walletModalRef} />
        </>
    );
}

export const AddForm = forwardRef((props, ref) => {
    const { list, sdt, vehicles, setVisibleParent } = props;
    const [ajxRequesting, setAjxRequesting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});
    const [districts, setDistricts] = useState([]);
    const [taluks, setTaluks] = useState([]);
    const [changeForm, setChangeForm] = useState(false);
    const imgRef = useRef();
    const licenceImgRef = useRef();
    const adharCardImgRef = useRef();
    const panCardImgRef = useRef();
    const badgeImgRef = useRef();

    const handleVisible = (val) => {
        setVisible(val);
        if (setVisibleParent && !val) {
            setVisibleParent(false);
        }
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            if (!dt) {
                dt = {};
            }
            imgRef.current = {};
            licenceImgRef.current = {};
            adharCardImgRef.current = {};
            panCardImgRef.current = {};
            badgeImgRef.current = {};

            dt.dob = moment(dt.dob).format('YYYY-MM-DD');
            setData(dt ? { ...dt } : { isActive: true, isApproved: false });
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
        data.drivingLicencePhoto = licenceImgRef?.current?.uploadingFiles?.[0]?.base64;
        data.adharCardPhoto = adharCardImgRef?.current?.uploadingFiles?.[0]?.base64;
        data.panCardPhoto = panCardImgRef?.current?.uploadingFiles?.[0]?.base64;
        data.badgePhoto = badgeImgRef?.current?.uploadingFiles?.[0]?.base64;

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

    const checkDistrictExist = () => sdt?.find(v => v._id === data.state)?.districts.map(v => v._id)?.includes(data.district);

    const checkTalukExist = () => sdt?.find(v => v._id === data.state)?.districts.find(v => v._id === data.district)?.taluks?.map(v => v._id)?.includes(data.taluk);

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

    return (
        <>
            <Modal
                title={(!data._id ? 'Add' : 'Edit') + ' Driver'}
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
                                <div><Divider orientation="left" className="text-danger">Vehicle</Divider></div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Vehicle</label>
                                    {/* <AntdSelect options={vehicles} disabled value={data.vehicle} onChange={v => { handleChange(v, 'vehicle') }} /> */}
                                    <Input value={data?.vehicleDetails?.name || ''} disabled />
                                </div>
                                <div><Divider orientation="left" className="text-danger">Personal Details </Divider></div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Driver Id</label>
                                    <Input value={data.driverId || ''} onChange={e => handleChange(util.handleInteger(e.target.value), 'driverId')} />
                                </div>
                                {/* <div></div> */}
                                <div className="col-md-9 form-group">
                                    <label className="req">Name</label>
                                    <Input value={data.name || ''} onChange={e => handleChange(e.target.value, 'name')} />
                                </div>
                                <div></div>
                                {/* <div className="col-md-6 form-group">
                                    <label className="req">Last Name</label>
                                    <Input value={data.lastName || ''} onChange={e => handleChange(e.target.value, 'lastName')} />
                                </div> */}
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

                                <div><Divider orientation="left" className="text-danger">Driving Licence Details </Divider></div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Driving Licence Number</label>
                                    <Input value={data.drivingLicenceNumber || ''} onChange={e => handleChange(e.target.value, 'drivingLicenceNumber')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Driving Licence Number Expiry Date</label>
                                    <AntdDatepicker format="MMMM D, YYYY" value={data.drivingLicenceNumberExpiryDate || new Date()} onChange={value => { handleChange(value, 'drivingLicenceNumberExpiryDate') }} />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label className="req">Driving Licence photo</label>
                                    <UploadImage ref={licenceImgRef} {...{ fileCount: 1, files: data.drivingLicenceImage ? [data.drivingLicenceImage] : [] }} />
                                </div>
                                <div><Divider orientation="left" className="text-danger">Adhar Details </Divider></div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Adhar Number</label>
                                    <Input value={data.adharNo || ''} onChange={e => handleChange(e.target.value, 'adharNo')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Adhar Card photo</label>
                                    <UploadImage ref={adharCardImgRef} {...{ fileCount: 1, files: data.adharCardImage ? [data.adharCardImage] : [] }} />
                                </div>
                                <div><Divider orientation="left" className="text-danger">Pan Card Details </Divider></div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Pan No.</label>
                                    <Input value={data.panNo || ''} onChange={e => handleChange(e.target.value, 'panNo')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Pan Card photo</label>
                                    <UploadImage ref={panCardImgRef} {...{ fileCount: 1, files: data.panCardImage ? [data.panCardImage] : [] }} />
                                </div>
                                <div><Divider orientation="left" className="text-danger">Badge Details </Divider></div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Badge No.</label>
                                    <Input value={data.badgeNo || ''} onChange={e => handleChange(e.target.value, 'badgeNo')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Badge photo</label>
                                    <UploadImage ref={badgeImgRef} {...{ fileCount: 1, files: data.badgeImage ? [data.badgeImage] : [] }} />
                                </div>
                                <div><Divider orientation="left" className="text-danger">Status </Divider></div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Approval Status</label>
                                    <AntdSelect
                                        options={[{ value: true, label: "Approved" }, { value: false, label: "Not Approved" }]}
                                        value={data.isApproved}
                                        onChange={v => { handleChange(v, 'isApproved') }}
                                    />
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

export const WalletModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setData({...dt});
            handleVisible(true);
        }
    }));

    useEffect(()=>{
        console.log('data--', data);
    }, [data]);


    return (
        <>
            <Modal
                title={<>Wallet History of <span className="text-danger">{data.name}</span></>}
                style={{ top: 20 }}
                visible={visible}
                onCancel={() => { handleVisible(false); }}
                destroyOnClose
                maskClosable={false}
                width={1200}
                footer={null}
                className="app-modal-body-overflow"
            >
                <Wallet driverId={data._id} />
            </Modal>
        </>
    );
});