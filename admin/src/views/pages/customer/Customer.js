/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Popconfirm, Input, Modal, Tag, Spin } from "antd";
import { AntdSelect } from "../../../utils/Antd";
import { EditOutlined, DeleteOutlined, LoadingOutlined, EyeOutlined } from "@ant-design/icons";
import service from "../../../services/customer";
import { AntdMsg } from "../../../utils/Antd";
import UploadImage from "../../components/UploadImage";

export default function Customer() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)
    const formRef = useRef();
    let [sdata, setSData] = useState({ key: '', page: 1, limit: 20, total: 0 });
    const columns = [
        {
            title: 'Name',
            dataIndex: 'firstName',
            render: (id, row) => row.firstName + ' ' + row.lastName,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 150,
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
            key: 'action',
            width: 150,
            render: (text, row) => (
                <>
                    <Button size="small" className="mx-1" onClick={() => { formRef.current.openForm(text) }}>
                        <span className="d-flex">
                            <EditOutlined />
                        </span>
                    </Button>
                    <Button size="small" className="mx-1" onClick={() => { formRef.current.openForm(text) }}>
                        <span className="d-flex">
                            <EyeOutlined />
                        </span>
                    </Button>
                    <Button type="danger" size="small">
                        <span className="d-flex">
                            <Popconfirm
                                title="Are you sure to delete this bank?"
                                onConfirm={() => deleteConfirm(row.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <DeleteOutlined />
                            </Popconfirm>
                        </span>
                    </Button>
                </>
            ),
        },
    ].filter(item => !item.hidden);

    const list = (data) => {
        if (typeof data === 'undefined') {
            data = sdata;
        }
        setLoading(true);
        service.list(data).then(res => {
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
        service.delete(id).then(res => {
            AntdMsg(res.message);
            list();
        }).catch(err => {
            AntdMsg(err.message, 'error');
        })
    }

    useEffect(() => {
        list();
    }, []);

    return (
        <>
            <div className="page-description text-white p-2" >
                <span>Bank List</span>
            </div>
            <div className="m-2 border p-2">
                <MyTable {...{ data, columns, parentSData: sdata, loading, formRef, list }} />
            </div>
            <AddForm ref={formRef} {...{ list }} />
        </>
    );
}

const AddForm = forwardRef((props, ref) => {
    const { list } = props;
    const [ajxRequesting, setAjxRequesting] = useState(false)
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState({});
    const [changeForm, setChangeForm] = useState(false);
    const imgRef = useRef();

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            imgRef.current = {};
            setData(dt ? { ...dt, } : { status: '1' });
            handleVisible(true);
        }
    }));

    const handleChange = (v, k) => {
        // if (changeForm) {
            setData({ ...data, [k]: v });
        // }
    }

    const save = () => {
        setAjxRequesting(true);
        let fd = new FormData();
        for (const [key, value] of Object.entries(data)) {
            fd.append(key, value);
        }
        service.save(fd).then((res) => {
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
                title={(!data._id ? 'Add' : 'Edit') + ' Customer'}
                style={{ top: 20 }}
                visible={visible}
                okText="Save"
                onOk={save}
                okButtonProps={{ disabled: ajxRequesting }}
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
                                <div className="col-md-3 form-group">
                                    <label className="req">First Name</label>
                                    <Input value={data.firstName || ''} onChange={e => handleChange(e.target.value, 'firstName')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Last Name</label>
                                    <Input value={data.lastName || ''} onChange={e => handleChange(e.target.value, 'lastName')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Email</label>
                                    <Input value={data.email || ''} onChange={e => handleChange(e.target.value, 'email')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Phone No.</label>
                                    <Input value={data.phoneNo || ''} onChange={e => handleChange(e.target.value, 'phoneNo')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">State</label>
                                    <Input value={data.state || ''} onChange={e => handleChange(e.target.value, 'state')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">District</label>
                                    <Input value={data.district || ''} onChange={e => handleChange(e.target.value, 'district')} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label className="req">Taluk</label>
                                    <Input value={data.taluk || ''} onChange={e => handleChange(e.target.value, 'taluk')} />
                                </div>
                                <div className="col-md-12 form-group">
                                    <label className="req">Address</label>
                                    <UploadImage ref={imgRef} {...{ fileCount: 1, files: data.image ? [data.image] : [] }} />
                                </div>
                                <div className="col-md-12 form-group">
                                    <button type="button" onClick={()=>{
                                        console.log(imgRef.current)
                                    }}>CCC</button>
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
})