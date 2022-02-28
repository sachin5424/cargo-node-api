import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TinyMce(props) {
    let {height=400, menubar=false, plugins, toolbar, content_style, initialValue, onChange } = props;
    if(!plugins){
        plugins = [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
        ];
    }
    if(!toolbar){
        toolbar = 'undo redo | formatselect | ' +
        'bold italic backcolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help';
    }
    if(!content_style){
        content_style = 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }';
    }

    const editorRef = useRef(null);
    const editorContent = () => {
        if (editorRef.current) {
            onChange(editorRef.current.getContent())
        }
    };
    return (
        <>
            <Editor 
                onInit={(evt, editor) => editorRef.current = editor}
                {...{initialValue}}
                init={{ height, menubar, plugins, toolbar, content_style }}
                onSelectionChange={editorContent}
            />
        </>
    );
}
