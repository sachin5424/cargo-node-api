/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Input, Modal, Spin } from "antd";
import { LoadingOutlined, EyeOutlined, MailOutlined, SendOutlined } from "@ant-design/icons";
import service from "../../../services/email";
import customerService from "../../../services/customer";
import driverService from "../../../services/driver";
import adminService from "../../../services/admin";
import { AntdMsg, AntdSelect } from "../../../utils/Antd";
import util from "../../../utils/util";
import TinyMce from "../../components/TinyMce";

export const modules = {
    view: util.getModules('viewSentEmail'),
    add: util.getModules('sendEmail'),
};

const viewAccess = modules.view;
const addAccess = modules.add;


export default function Email() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [admins, setAdmins] = useState([]);

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
            width: 60,
            hidden: !addAccess && !viewAccess,
            render: (text, row) => (
                <>
                    {
                        viewAccess
                            ? <Button size="small" className="mx-1" onClick={() => { formRef.current.openForm({ ...text }) }}>
                                <span className="d-flex">
                                    <EyeOutlined />
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
        });
    }

    useEffect(() => {
        list();
        service.listAllTeplates('viewEmailTemplate').then(res => {
            setTemplates([...(res.result.data || []), { _id: 'custom', subject: 'Custom' }]);
        }).catch(err => {
            AntdMsg('Email templates are not loaded! Contact super admin if you have any permission error', 'error');
        });
        customerService.listAll('viewCustomer').then(res => {
            setCustomers(res.result.data || []);
        }).catch(err => {
            AntdMsg('Customers are not loaded! Contact super admin if you have any permission error', 'error');
        });
        driverService.listAll({}, 'viewDriver').then(res => {
            setDrivers(res.result.data || []);
        }).catch(err => {
            AntdMsg('Drivers are not loaded! Contact super admin if you have any permission error', 'error');
        });
        adminService.listAll({}, 'viewAdmin').then(res => {
            setAdmins(res.result.data || []);
        }).catch(err => {
            AntdMsg('Admin are not loaded! Contact super admin if you have any permission error', 'error');
        });

    }, []);

    return (
        <>
            <div className="page-description text-white p-2" >
                <span>Sent Email List</span>
            </div>
            <div className="m-2 border p-2">
                <MyTable {...{ data, columns, parentSData: sdata, loading, formRef, list, searchPlaceholder: 'Title or Key', addNew: addAccess, addNewIcon: MailOutlined, addNewText: 'Compose Email' }} />
            </div>
            <AddForm ref={formRef} {...{ list, templates, customers, drivers, admins }} />
        </>
    );
}

const AddForm = forwardRef((props, ref) => {
    const { list, templates, customers, drivers, admins } = props;
    const [ajxRequesting, setAjxRequesting] = useState(false);
    const [visible, setVisible] = useState(false);
    let [data, setData] = useState({});
    const [changeForm, setChangeForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [userSelectMode, setUserSelectMode] = useState('multiple');

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setData(dt ? { ...dt } : { deletable: true });
            handleVisible(true);
            if (!dt?._id && addAccess) {
                setChangeForm(true);
            } else if (dt._id) {
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
        service.saveTeplate(data, addAccess).then((res) => {
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

    useEffect(() => {
        if (data.to === 'manyCustomers') {
            setUsers(customers.map(v => ({ _id: v.email, title: v.firstName + ' ' + v?.lastName + ` - (${v.email})` })) || []);
        } else if (data.to === 'manyDrivers') {
            setUsers(drivers.map(v => ({ _id: v.email, title: v.name + ` - (${v.email})` })) || []);
        } else if (data.to === 'manyAdmins') {
            setUsers(admins.map(v => ({ _id: v.email, title: v.firstName + ' ' + v?.lastName + ` - (${v.email})` })) || []);
        } else if (data.to === 'custom') {
            setUsers([]);
        } else {
            setUsers([]);
        }
    }, [data.to]);

    useEffect(() => {
        if (data.to === 'custom') {
            setUserSelectMode('tags');
        } else {
            setUserSelectMode('multiple');
        }
    }, [data.to]);

    useEffect(() => {
        handleChange(null, 'emailIds');
    }, [users]);

    useEffect(() => {
        console.log('emailIds', data.emailIds);
    }, [data.emailIds]);

    return (
        <>
            <Modal
                title={'Send Email'}
                style={{ top: 20 }}
                visible={visible}
                okText={<div className="d-flex">Send <SendOutlined className="my-auto mx-1"/></div>}
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

                                <div className="col-md-4 form-group">
                                    <label className="req">Email Template</label>
                                    <AntdSelect
                                        options={templates.map(v => ({ _id: v._id, title: v.subject })) || []}
                                        value={data.template}
                                        onChange={v => { handleChange(v, 'template') }}
                                    />
                                </div>
                                <div></div>
                                <div className="col-md-4 form-group">
                                    <label className="req">Send To</label>
                                    <AntdSelect
                                        options={[
                                            { _id: 'manyCustomers', title: 'Many Customers' },
                                            { _id: 'manyDrivers', title: 'Many Drivers' },
                                            { _id: 'manyAdmins', title: 'Many Admins' },
                                            { _id: 'allCustomers', title: 'All Customers' },
                                            { _id: 'allDrivers', title: 'All Drivers' },
                                            { _id: 'allAdmins', title: 'All Admins' },
                                            { _id: 'custom', title: 'Custom' }
                                        ]}
                                        value={data.to}
                                        onChange={v => { handleChange(v, 'to') }}
                                    />
                                </div>
                                {
                                    ['manyCustomers', 'manyDrivers', 'manyAdmins', 'custom'].includes(data.to)
                                        ? <div className="col-md-8 form-group">
                                            <label className="req">{data.to === 'custom' ? 'Enter Emails' : 'Select Users'}</label>
                                            <AntdSelect
                                                mode={userSelectMode}
                                                placeholder={data.to === 'custom' ? 'Enter Emails' : 'Select Users'}
                                                options={users || []}
                                                value={data.emailIds}
                                                onChange={v => { handleChange(v, 'emailIds') }}
                                            />
                                        </div>
                                        : null
                                }


                                {
                                    data.template === 'custom'
                                        ? <>
                                            <div></div>
                                            <div className="col-md-12 form-group">
                                                <label className="req">Subject</label>
                                                <Input value={data.subject || ''} onChange={e => { handleChange(e.target.value, 'subject') }} />
                                            </div>
                                            <div className="col-md-12 form-group">
                                                <label className="req">Template Design</label>
                                                <TinyMce {...{ height: 700 }} initialValue={data.html || ''} onChange={v => { handleChange(v, 'html', false) }} />
                                            </div>
                                        </>
                                        : null
                                }


                            </div>
                        </fieldset>
                    </form>
                </Spin>
            </Modal>
        </>
    );
});