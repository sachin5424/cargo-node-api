/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Input, Modal, Spin, Popconfirm } from "antd";
import { EditOutlined, LoadingOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import service from "../../../services/email";
import { AntdMsg } from "../../../utils/Antd";
import util from "../../../utils/util";
import TinyMce from "../../components/TinyMce";

export const modules = {
    view: util.getModules('viewEmailTemplate'),
    add: util.getModules('addEmailTemplate'),
    edit: util.getModules('editEmailTemplate'),
    delete: util.getModules('deleteEmailTemplate'),
};

const viewAccess = modules.view;
const addAccess = modules.add;
const editAccess = modules.edit;
const deleteAccess = modules.delete;


export default function Template() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const formRef = useRef();
    let [sdata, setSData] = useState({ key: '', page: 1, limit: 20, total: 0 });
    const columns = [
        {
            title: 'Subject',
            dataIndex: 'subject',
        },
        {
            title: 'Key',
            dataIndex: 'key',
            width: 200,
        },
        {
            title: 'Action',
            width: 100,
            hidden: !addAccess && !editAccess && !deleteAccess && !viewAccess,
            render: (text, row) => (
                <>
                    {
                        editAccess
                            ? <Button size="small" className="mx-1" onClick={() => { formRef.current.openForm({...text }) }}>
                                <span className="d-flex">
                                    <EditOutlined />
                                </span>
                            </Button>
                            : null
                    }

                    {
                        !editAccess && viewAccess
                            ? <Button size="small" className="mx-1" onClick={() => { formRef.current.openForm({...text }) }}>
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
        service.listTeplates(data, viewAccess).then(res => {
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
        service.deleteTeplates(id, deleteAccess).then(res => {
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
                <span>Email Template List</span>
            </div>
            <div className="m-2 border p-2">
                <MyTable {...{ data, columns, parentSData: sdata, loading, formRef, list, searchPlaceholder: 'Title or Key', addNew: addAccess }} />
            </div>
            <AddForm ref={formRef} {...{ list }} />
        </>
    );
}

const AddForm = forwardRef((props, ref) => {
    const { list } = props;
    const [ajxRequesting, setAjxRequesting] = useState(false);
    const [visible, setVisible] = useState(false);
    let [data, setData] = useState({});
    const [changeForm, setChangeForm] = useState(false);

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setData(dt ? { ...dt } : { deletable: true });
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

    const handleChange = (v, k, updateState = true) => {
        if (changeForm) {
            updateState ? setData({ ...data, [k]: v }) : data = { ...data, [k]: v }
        }
    }

    const save = () => {
        setAjxRequesting(true);
        service.saveTeplate(data, data._id ? editAccess : addAccess).then((res) => {
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

    useEffect(() => { !data.deletable || handleChange(util.removeSpecialChars(data.subject || ''), 'key'); }, [data.subject]);

    return (
        <>
            <Modal
                title={(!data._id ? 'Add' : 'Edit') + ' Email Template'}
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
                                    <label className="req">Subject</label>
                                    <Input value={data.subject || ''} onChange={e => { handleChange(e.target.value, 'subject') }} />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label className="req">Key</label>
                                    <Input value={data.key || ''} disabled={!data.deletable} onChange={e => { !data.deletable || handleChange(util.removeSpecialChars(e.target.value), 'key') }} />
                                </div>
                                <div className="col-md-12 form-group">
                                    <label className="req">Template Design</label>
                                    <TinyMce {...{ height: 700 }} initialValue={data.html || ''} onChange={v => { handleChange(v, 'html', false) }} />
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </Spin>
            </Modal>
        </>
    );
});