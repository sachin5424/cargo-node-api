/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, forwardRef } from 'react';
import moment from 'moment';
import {
    Select,
    DatePicker,
    Pagination,
    Tag,
    Checkbox,
    message,
    Upload,
    Modal,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export function AntdSelect(props) {
    let {
        placeholder,
        options,
        value,
        sort,
        defaultValue,
        ...rest
    } = props;

    if (!options.length > 0) {
        value = defaultValue;
    }

    if ((value && typeof value !== "object") || typeof value === 'boolean') {
        value = value + '';
    }

    if (typeof options !== "object") {
        options = [];
    }
    // if (typeof options[0] !== "object") {
    //     let ops = [...options];
    //     options = [];
    //     for (let ind in ops) {
    // options.push({ value: ops[ind], label: ops[ind] });
    //     }
    // }
    if (typeof options[0]?.value === "undefined") {
        let ops = [...options];
        options = [];
        ops.forEach(v => {
            options.push({ value: v.id || v._id, label: v.title || v.name });
        })
    }

    options.forEach(v => {
        v.value += '';
        v.label += '';
    })

    if (sort) {
        options.sort((a, b) => {
            return ('' + a.label).localeCompare(b.label);
        })
    }

    return (
        <>
            <Select
                style={{ width: '100%' }}
                placeholder={placeholder || "Select"}
                options={options}
                value={(value !== null && typeof value !== "undefined") ? (value) : undefined}
                filterOption={
                    (input, option) => {
                        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                }

                {...rest}
            >
            </Select>
        </>
    )
}

export function AntdDatepicker(props) {
    let {
        format,
        inputReadOnly,
        value,
        defaultValue,
        onChange,
        ...rest
    } = props;

    let otherProps = {};
    if (typeof value !== "undefined") {
        // otherProps.value = moment(value).format(format || 'DD MMM YYYY') ? moment(new Date(value)) : null
        otherProps.value = moment(new Date(value ? value : new Date()), format || 'DD MMM YYYY');
    }
    if (typeof defaultValue !== "undefined") {
        otherProps.defaultValue = defaultValue ? moment(new Date(defaultValue)) : null
    }
    if (typeof onChange !== "undefined") {
        otherProps.onChange = (dt) => {
            onChange(dt ? moment(dt).format('YYYY-MM-DD') : null);
        }
    }
    useEffect(() => {
        onChange(moment(value).format('YYYY-MM-DD'))
    }, [])

    return (
        <DatePicker
            format={format || 'DD MMM YYYY'}
            inputReadOnly={inputReadOnly || true}
            {...otherProps}
            {...rest}
            style={{ width: '100%' }}
        />
    )
}

export function AntdPaging(props) {
    let { onChange, total, pageSize, ...rest } = props;
    let jumpOn1st = false;
    const handlePaseSizeChange = (n, ps) => {
        jumpOn1st = true;
    }

    const handleOnChange = (n, ps) => {
        onChange(jumpOn1st ? 1 : n, ps);
        jumpOn1st = false;
    }

    return (
        <Pagination
            defaultCurrent={1}
            total={total}
            defaultPageSize={pageSize || 25}
            pageSizeOptions={[10, 20, 25, 50, 100]}
            onChange={handleOnChange}
            onShowSizeChange={handlePaseSizeChange}
            {...rest}
        />
    )
}

export function AntdTag(props) {
    const { type, ...rest } = props;
    const [tagType, setTagType] = React.useState(type);
    const types = {
        danger: '#ff4d4f',
        info: '#2db7f5',
        success: '#87d068',
        primary: '#108ee9',
    };

    React.useEffect(() => {
        setTagType(type);
    }, [type]);

    return (
        <Tag color={types[tagType]} {...rest}>{props.children}</Tag>
    )
}

export function AntdCheckbox(props) {
    const { onChange, value, children } = props;
    return (
        <div className="w-100 border p-1">
            <Checkbox className="w-100 req" checked={value === '1' ? true : false}
                onChange={(e) => { onChange(e.target.checked ? '1' : '0') }} >{children}</Checkbox>
        </div>
    );
}



export function MultiChechBox(props) {
    const { col = 3 } = props;
    const type = typeof props.value === 'object' ? 'array' : 'string';

    let [values, setValues] = useState();
    let [options, setOptions] = useState([]);

    const handleChange = (e) => {
        const val = typeof e.target.value * 1 !== 'NaN' ? e.target.value + '' : e.target.value * 1;
        if (e.target.checked) {
            values.push(val)
            setValues([...values]);
        } else {
            if (values.indexOf(val) > -1) {
                values.splice(values.indexOf(val), 1);
                setValues([...values])
            }
        }
    }

    useEffect(() => {
        if (type === 'string') {
            values = props.value ? props.value.split(',').map((v) => v * 1) : [];
            setValues([...values]);
        } else {
            setValues([...props.value]);
        }
    }, [props.value]);

    useEffect(() => {
        let opts = props.options.map((v, i) => {
            if (v.value) {
                return { value: v.value * 1, label: v.label }
            } else if (v.id) {
                return { value: v.id * 1, label: v.name || v.title || v.label }
            } else if (v._id) {
                return { value: v._id + '', label: v.name || v.title || v.label }
            }
            return null;
        });
        setOptions(opts);
    }, [props.options]);

    useEffect(() => {
        // if (type === 'string') {
        //     props.onChange(values?.join());
        // } else {
        props.onChange(values)
        // }
    }, [(values || []).join(",")])

    return (
        <div className="row mingap" >
            {
                options.map((v, i) => (
                    <div className={`col-md-${col} mb-2 form-group`} key={i}>
                        <div className="border p-1">
                            <Checkbox
                                value={typeof v.value * 1 !== 'NaN' ? v.value + '' : v.value * 1}
                                checked={values?.includes(typeof v.value * 1 !== 'NaN' ? v.value + '' : v.value * 1)}
                                onChange={handleChange}
                                className="mx-0 mr15"
                            >
                                {v.label}
                            </Checkbox>
                        </div>
                    </div>
                ))
            }
        </div>

    );
}

export function AntdMsg($msg, $type = 'success') {
    if ($msg) {
        if ($type === 'success')
            message.success($msg);
        if ($type === 'error')
            message.error($msg);
        if ($type === 'warning')
            message.warning($msg);
    }
};

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const UploadImage = forwardRef((props, ref) => {
    const { fileCount } = props;
    const fileRef = ref;
    let { files } = props;
    useEffect(() => {
        setFileList(files)
    }, [files])

    if (files.length) {
        files = files?.map((v, i) => {
            return { uid: i, url: v.url, status: 'done', name: v.name };
        });
    } else {
        files = [];
    }


    const [fileList, setFileList] = useState(files);

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
            if (!fileRef.current.uploadingFiles) {
                fileRef.current.uploadingFiles = [];
            }
            fileRef.current.uploadingFiles?.push(file);
        }, 0);
    };
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewVisible(true);
        setPreviewImage(file.url || file.preview);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <>
            <Upload
                // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                customRequest={dummyRequest}
                fileList={fileList}
                onPreview={handlePreview}
                onChange={(value) => {
                    if (value.file.status === 'removed' || value.file.status) {
                        handleChange(value)
                    }
                }}
                beforeUpload={
                    (file) => {
                        if (!file.type.includes('image/')) {
                            message.error('Invalid file type');
                            return false
                        }
                    }
                }
                onRemove={(e) => {
                    if (!fileRef.current.deletingFiles) {
                        fileRef.current.deletingFiles = [];
                    }
                    if (!e.thumbUrl) {
                        fileRef.current.deletingFiles?.push(e);
                    } else {
                        fileRef.current.uploadingFiles = fileRef.current.uploadingFiles.filter((v) => { return v.uid !== e.uid })
                    }
                }}
            >
                {fileList.length >= fileCount ? null : uploadButton}
            </Upload>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
})

export default UploadImage;