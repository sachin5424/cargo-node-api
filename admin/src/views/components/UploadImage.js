import React, { forwardRef, useState } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

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
    let { files } = props;
    if(files.length){
        files = files?.map((v, i) => {
            // if ( v ) {
                return { uid: i, url: v.url, status: 'done', name: v.name };
            // }
        });
    } else{
        files = [];
    }

    const fileRef = ref;
    const [fileList, setFileList] = useState( files );

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(async() => {
            onSuccess("ok");
            if (!fileRef.current.uploadingFiles) {
                fileRef.current.uploadingFiles = [];
            }
            const base64 = await getBase64(file);
            fileRef.current.uploadingFiles?.push({uid: file.uid, base64: base64});
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
                    if (value.file.status === 'removed' || value.file.status ) {
                        handleChange(value)
                    }
                }}
                onRemove={(e) => {
                    if (!fileRef.current.deletingFiles) {
                        fileRef.current.deletingFiles = [];
                    }
                    if (!e.thumbUrl) {
                        fileRef.current.deletingFiles?.push(e.name);
                    } else {
                        fileRef.current.uploadingFiles = fileRef.current.uploadingFiles?.filter((v) => { return v.uid !== e.uid })
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