import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TinyMce(props) {
    let { height = 400, menubar = false, plugins, toolbar, content_style, initialValue, onChange } = props;
    if (!plugins) {
        plugins = [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount forecolor backcolor textcolor'
        ];
    }
    if (!toolbar) {
        // toolbar = 'undo redo | formatselect | bold italic backcolor | forecolor emoticons | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | image link | imageupload | fullscreen';
        toolbar = 'undo redo | insert | styleselect | bold italic | fontselect fontsizeselect | alignleft aligncenter alignright alignjustify | forecolor backcolor emoticons | bullist numlist outdent indent | link unlink | image responsivefilemanager table | removeformat code help | fullscreen'
    }
    if (!content_style) {
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
                {...{ initialValue }}
                init={{
                    height, menubar, plugins, toolbar, content_style,

                    file_browser_callback_types: 'image',
                    file_picker_callback: function (cb, value, meta) {
                        const input = document.createElement("input");
                        input.setAttribute("type", "file");
                        input.setAttribute("accept", "image/*");
                        input.onchange = function () {
                            const file = this.files[0];
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = () => {cb(reader.result, {title: file.name});};
                        };
                        input.click();
                    },
                    deprecation_warnings: false
                }}
                onSelectionChange={editorContent}
            />
        </>
    );
}
