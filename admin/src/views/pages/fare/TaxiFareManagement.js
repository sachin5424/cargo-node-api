/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Popconfirm, Input, Modal, Tag, Spin, Divider } from "antd";
import { AntdSelect } from "../../../utils/Antd";
import { EditOutlined, DeleteOutlined, LoadingOutlined, EyeOutlined } from "@ant-design/icons";
import service from "../../../services/admin";
import commonService from "../../../services/common";
import rideService from "../../../services/ride";
import { AntdMsg } from "../../../utils/Antd";
import sdtService from "../../../services/sdt";
import util from "../../../utils/util";

export const modules = {
    view: util.getModules('viewFareManagement'),
    add: util.getModules('addFareManagement'),
    edit: util.getModules('addFareManagement'),
    delete: util.getModules('deleteFareManagement'),
};

const viewAccess = modules.view;
const addAccess = modules.add;
const editAccess = modules.edit;
const deleteAccess = modules.delete;


export default function TaxiFareManagement({ activeServiceType = 'taxi' }) {

    const [data, setData] = useState([]);
    const [sdt, setSdt] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [rideTypes, setRideTypes] = useState([]);

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
        commonService.listServiceType().then(res => setServiceTypes(res.result.data || []));
        rideService.listAllRideType({}, 'viewRideType').then(res => setRideTypes(res.result.data || []));
    }, []);

    return (
        <>
            <div className="page-description text-white p-2" >
                <span>Admin List</span>
            </div>
            <div className="m-2 border p-2">
                <MyTable {...{ data, columns, parentSData: sdata, loading, formRef, list, searchPlaceholder: 'First Name or Last Name', addNew: addAccess }} />
            </div>
            <AddForm ref={formRef} {...{ list, sdt, activeServiceType, serviceTypes, rideTypes }} />
        </>
    );
}

const AddForm = forwardRef((props, ref) => {
    const { list, sdt, activeServiceType, serviceTypes, rideTypes } = props;
    const [ajxRequesting, setAjxRequesting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});
    const [districts, setDistricts] = useState([]);
    const [taluks, setTaluks] = useState([]);
    const [changeForm, setChangeForm] = useState(false);
    const [activeRideTypes, setActiveRideTypes] = useState([]);
    const [activeVehicleCategories, setActiveVehicleCategories] = useState([]);

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            if (!dt) {
                dt = { isActive: true, serviceType: serviceTypes?.find(v => v.key === activeServiceType)?._id };
                dt.perKMCharges = [{}];
            }
            setData({ ...dt });
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

    const handleChange = (v, k) => {
        let varDt = data;
        let keys = k.split('.');
        for (let i = 0; i < keys.length; i++) {
            if (i + 1 === keys.length) {
                varDt[keys[i]] = v;
            } else {
                if (typeof varDt[keys[i]] === 'undefined') {
                    if (parseInt(keys[i + 1]) * 1 >= 0) {
                        varDt[keys[i]] = [];
                    } else {
                        varDt[keys[i]] = {};
                    }
                } varDt = varDt[keys[i]];
            }
        }
        setData({ ...data });
    }

    const save = () => {
        setAjxRequesting(true);
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

    useEffect(() => {
        setActiveRideTypes(rideTypes.filter(v => v.serviceType?.key === activeServiceType));
    }, [rideTypes]);

    useEffect(() => {
        const tempVC = activeRideTypes.find(v => v._id === data.rideType)?.allowedVehicleCategoriesDetails || [];
        if (!tempVC.find(v => v._id === data.vehicleCategory)) {
            handleChange('', 'vehicleCategory');
        }
        setActiveVehicleCategories(tempVC);
    }, [data.rideType, activeRideTypes]);

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
                title={(!data._id ? 'Add' : 'Edit') + ' Fare Management'}
                style={{ top: 20 }}
                visible={visible}
                okText="Save"
                onOk={save}
                okButtonProps={{ disabled: ajxRequesting || (!changeForm), style: { display: !changeForm ? 'none' : 'inline-block' } }}
                onCancel={() => { handleVisible(false); }}
                destroyOnClose
                maskClosable={false}
                width={900}
                className="app-modal-body-overflow"
            >
                <Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                    <form onSubmit={e => { e.preventDefault(); save() }} autoComplete="off" spellCheck="false">
                        <fieldset className="" disabled={!changeForm}>
                            <div className="row mingap">
                                <div className="col-md-4 form-group">
                                    <label className="req">Service Type</label>
                                    <AntdSelect
                                        options={serviceTypes}
                                        value={data.serviceType}
                                        onChange={v => { handleChange(v, 'serviceType') }}
                                        disabled
                                    />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Ride Type</label>
                                    <AntdSelect
                                        options={activeRideTypes}
                                        value={data.rideType}
                                        onChange={v => { handleChange(v, 'rideType') }}
                                    />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Vehicle Category</label>
                                    <AntdSelect
                                        options={activeVehicleCategories}
                                        value={data.vehicleCategory}
                                        onChange={v => { handleChange(v, 'vehicleCategory') }}
                                    />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">State</label>
                                    <AntdSelect
                                        options={sdt.map(v => ({ value: v._id, label: v.name }))}
                                        value={data.state}
                                        onChange={v => { handleChange(v, 'state') }}
                                    />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">District</label>
                                    <AntdSelect
                                        options={districts || []}
                                        value={data.district}
                                        onChange={v => { handleChange(v, 'district') }}
                                    />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Taluk</label>
                                    <AntdSelect
                                        options={taluks || []}
                                        value={data.taluk}
                                        onChange={v => { handleChange(v, 'taluk') }}
                                    />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Base Fare</label>
                                    <Input value={data.baseFare || ''} onChange={e => handleChange(util.handleFloat(e.target.value), 'baseFare')} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Booking Fare</label>
                                    <Input value={data.bookingFare || ''} onChange={e => handleChange(util.handleFloat(e.target.value), 'bookingFare')} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Per Minute Fare</label>
                                    <Input value={data.perMinuteFare || ''} onChange={e => handleChange(util.handleFloat(e.target.value), 'perMinuteFare')} />
                                </div>
                                <div></div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Cancel Charge</label>
                                    <Input value={data.cancelCharge || ''} onChange={e => handleChange(util.handleFloat(e.target.value), 'cancelCharge')} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Waiting Charge(Per Minute)</label>
                                    <Input value={data.waitingCharge || ''} onChange={e => handleChange(util.handleFloat(e.target.value), 'waitingCharge')} />
                                </div>
                                <div></div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Admin Commission Type</label>
                                    <AntdSelect
                                        options={[{ _id: 'flat', title: 'FLAT' }, { _id: 'percentage', title: 'PERCENTAGE' }]}
                                        value={data.adminCommissionType}
                                        onChange={v => { handleChange(v, 'adminCommissionType') }}
                                    />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Admin Commission Value</label>
                                    <Input value={data.adminCommissionValue || ''} onChange={e => handleChange(util.handleFloat(e.target.value), 'adminCommissionValue')} />
                                </div>
                                <div><Divider orientation="left">Per KM Charge</Divider></div>
                                <PerKMCharges {...{ perKMCharges: data.perKMCharges, handleChange }} />
                            </div>
                        </fieldset>
                    </form>
                </Spin>
            </Modal>
        </>
    );
});

function PerKMCharges({ perKMCharges: data, handleChange }) {

    return (
        <>
            <div className="col-md-2 form-group">
                <label className="req">Min KM</label><h4></h4>
            </div>
            <div className="col-md-2 form-group">
                <label className="req">Max KM</label>
            </div>
            <div className="col-md-4 form-group">
                <label className="req">Per KM Charge</label>
            </div>
            <div></div>
            {
                data?.map((v, i) => (
                    <React.Fragment key={i}>
                        <div className="col-md-2 form-group">
                            <Input placeholder="Min KM" value={i === 0 ? 0 : (data[i - 1].maxKM)} disabled />
                        </div>
                        <div className="col-md-2 form-group">
                            <Input placeholder="Max KM" value={v.maxKM || ''} onChange={(e) => { handleChange(util.handleInteger(e.target.value), `perKMCharges.${i}.maxKM`) }} />
                        </div>
                        <div className="col-md-4 form-group">
                            <Input placeholder="Per KM Charge" value={v.charge || ''} onChange={(e) => { handleChange(util.handleFloat(e.target.value), `perKMCharges.${i}.charge`) }} />
                        </div>
                        <div className="col-md-4 form-group">
                            {
                                i + 1 === data.length
                                    ? <Button type="dashed" onClick={() => {
                                        if (v.maxKM && v.maxKM > (i === 0 ? 0 : (data[i - 1].maxKM)) && v.charge ) {
                                            handleChange([...data, {}], 'perKMCharges');
                                        } else{
                                            AntdMsg(`Max KM must be greater than ${  i === 0 ? 0 : (data[i - 1].maxKM)} and Per KM charge is required`, 'error');
                                        }
                                    }}>Add</Button>
                                    : null
                            }
                            {
                                i + 1 === data.length && i !== 0
                                    ? <Button type="dashed" className="mx-2" danger onClick={() => {
                                        data.pop();
                                        handleChange([...data], 'perKMCharges');
                                    }}>Remove</Button>
                                    : null
                            }
                        </div>
                    </React.Fragment>
                ))
            }
        </>
    );
}