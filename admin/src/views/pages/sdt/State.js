/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Popconfirm, Input, Modal, Tag, Spin } from "antd";
import { AntdSelect } from "../../../utils/Antd";
import { EditOutlined, DeleteOutlined, LoadingOutlined, EyeOutlined } from "@ant-design/icons";
import service from "../../../services/sdt";
import { AntdMsg } from "../../../utils/Antd";
import util from "../../../utils/util";
import District from "./District";

export const modules = {
    view: util.getModules('viewState'),
    add: util.getModules('addState'),
    edit: util.getModules('editState'),
    delete: util.getModules('deleteState'),
};

const viewAccess = modules.view;
const addAccess = modules.add;
const editAccess = modules.edit;
const deleteAccess = modules.delete;


export default function State() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const formRef = useRef();
    const districtModalRef = useRef();
    let [sdata, setSData] = useState({ key: '', page: 1, limit: 20, total: 0 });
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Districts',
            dataIndex: 'name',
            width: 100,
            render: (text, row) => <Button size="small" className="mx-1" onClick={() => { districtModalRef.current.openForm(row) }}>Districts</Button>
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
            hidden: (!addAccess && !editAccess && !deleteAccess && !viewAccess) || !util.isSuperAdmin(),
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
                                        title="Are you sure to delete this state?"
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
        service.listState(data, viewAccess).then(res => {
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
        service.deleteState(id, deleteAccess).then(res => {
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
                <span>State List</span>
            </div>
            <div className="m-2 p-2">
                <MyTable {...{ data, columns, parentSData: sdata, loading, formRef, list, searchPlaceholder: 'Name', addNew: addAccess && util.isSuperAdmin() }} />
            </div>
            <AddForm ref={formRef} {...{ list }} />
            <DistrictModal ref={districtModalRef} />
        </>
    );
}

const AddForm = forwardRef((props, ref) => {
    const { list } = props;
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

    useEffect(() => { handleChange(util.removeSpecialChars(data.name || ''), 'key'); }, [data.name]);

    const save = () => {
        setAjxRequesting(true);
        service.saveState(data, data._id ? editAccess : addAccess).then((res) => {
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
                title={(!data._id ? 'Add' : 'Edit') + ' State'}
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
                                    <label className="req">Name</label>
                                    <Input value={data.name || ''} onChange={e => handleChange(e.target.value, 'name')} />
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

const DistrictModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setData(dt ? { ...dt } : { isActive: true });
            handleVisible(true);
        }
    }));

    return (
        <>
            <Modal
                title={<>District list of <span className="text-danger">{data.name}</span></> }
                style={{ top: 20 }}
                visible={visible}
                footer={null}
                onCancel={() => { handleVisible(false); }}
                destroyOnClose
                maskClosable={false}
                width={1600}
                className="app-modal-body-overflow"
            >
                <District stateId={data._id} />
            </Modal>
        </>
    );
});