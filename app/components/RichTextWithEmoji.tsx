"use client";

import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Picker from "emoji-picker-react";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({ subsets: ["latin"] });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "clean"],
    // [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "+1" }, "link"],
  ],
};

interface RichTextWithEmojiProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function RichTextWithEmoji({
  value,
  onChange,
  disabled = false,
}: RichTextWithEmojiProps) {
  const [showEmoji, setShowEmoji] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  const onEmojiClick = (emojiData: any) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection(true);
      editor.insertText(range.index, emojiData.emoji);
      editor.setSelection(range.index + emojiData.emoji.length);
      onChange(editor.root.innerHTML);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", position: "relative" }}>
      <style>
        {`
          .ql-toolbar, .ql-container {
            font-family: ${fredoka.style.fontFamily} !important;
          }
          .ql-editor {
            background: white !important;
          }
        `}
      </style>

      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: "10px",
          right: "5px",
        }}
      >
        <button type="button" onClick={() => setShowEmoji(!showEmoji)} disabled={disabled}>
          {showEmoji ? "✖️" : "🙂"}
        </button>
      </div>

      {showEmoji && !disabled && (
        <Picker skinTonesDisabled reactionsDefaultOpen onEmojiClick={onEmojiClick} />
      )}

      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        value={value}
        onChange={onChange}
        readOnly={disabled}
        style={{ fontFamily: fredoka.style.fontFamily }}
      />
    </div>
  );
}
