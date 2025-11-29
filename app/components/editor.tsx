"use client";

import React, { useState, useRef } from "react";
import styles from "./editor.module.css";
// Importing icons
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaHeading,
  FaQuoteRight,
  FaLink,
  FaImage,
  FaListUl,
  FaListOl,
  FaCode,
  FaVideo,
  FaTable,
} from "react-icons/fa";
import { MdHorizontalRule, MdPreview, MdEdit } from "react-icons/md";
import { GoTasklist } from "react-icons/go";
import { BiCodeBlock } from "react-icons/bi";

interface EditorProps {
  placeholder?: string;
  defaultValue?: string;
  onContentChange: (content: string) => void;
  height?: string;
}

export default function Editor({
  placeholder = "Enter your content here... Use markdown formatting",
  defaultValue = "",
  onContentChange,
  height = "500px",
}: EditorProps) {
  const [content, setContent] = useState(defaultValue);
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange(newContent);
  };

  const insertMarkdown = (
    before: string,
    after: string = "",
    placeholderText: string = ""
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // If text is selected, use it; otherwise use the placeholder
    const selectedText = content.substring(start, end) || placeholderText;
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    const newContent = beforeText + before + selectedText + after + afterText;
    setContent(newContent);
    onContentChange(newContent);

    // Restore cursor position and focus
    setTimeout(() => {
      textarea.focus();
      // If we inserted a placeholder (no selection), select the placeholder text
      if (start === end && placeholderText) {
         textarea.setSelectionRange(
           start + before.length,
           start + before.length + placeholderText.length
         );
      } else {
         // Just place cursor after insertion
         textarea.setSelectionRange(
           start + before.length + selectedText.length + after.length,
           start + before.length + selectedText.length + after.length
         );
      }
    }, 0);
  };

  const markdownTools = [
    { icon: <FaBold />, title: "Bold", insert: "**", after: "**", placeholder: "bold text" },
    { icon: <FaItalic />, title: "Italic", insert: "_", after: "_", placeholder: "italic text" },
    { icon: <FaStrikethrough />, title: "Strikethrough", insert: "~~", after: "~~", placeholder: "text" },
    { icon: <MdHorizontalRule />, title: "Horizontal Rule", insert: "\n---\n", after: "", placeholder: "" },
    { icon: <FaHeading />, title: "Heading (H2)", insert: "## ", after: "", placeholder: "Heading" },
    { icon: <FaCode />, title: "Inline Code", insert: "`", after: "`", placeholder: "code" },
    { icon: <BiCodeBlock />, title: "Code Block", insert: "```\n", after: "\n```", placeholder: "code block" },
    { icon: <FaQuoteRight />, title: "Blockquote", insert: "> ", after: "", placeholder: "quote" },
    { icon: <FaLink />, title: "Link", insert: "[", after: "](url)", placeholder: "link text" },
    { icon: <FaImage />, title: "Image", insert: "![", after: "](https://example.com/image.png)", placeholder: "alt text" },
    { icon: <FaVideo />, title: "Video", insert: "[[video: ", after: "]]", placeholder: "https://example.com/video.mp4" },
    { icon: <FaTable />, title: "Table", insert: "\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n", after: "", placeholder: "" },
    { icon: <FaListUl />, title: "Unordered List", insert: "- ", after: "", placeholder: "item" },
    { icon: <FaListOl />, title: "Ordered List", insert: "1. ", after: "", placeholder: "item" },
    { icon: <GoTasklist />, title: "Task List", insert: "- [ ] ", after: "", placeholder: "task" },
  ];

  const renderMarkdown = (text: string): string => {
    let html = text;

    // 1. Escape HTML (Security)
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // -----------------------------------------------------------------------
    // IMAGE FORMATTER
    // -----------------------------------------------------------------------
    // Pattern: ![Alt Text](URL)
    // $1 = Alt Text, $2 = URL
    html = html.replace(
      /!\[([^\]]*)\]\(([^\)]+)\)/g, 
      '<img src="$2" alt="$1" class="markdown-image" />'
    );

    // -----------------------------------------------------------------------
    // VIDEO FORMATTER (Custom Syntax)
    // -----------------------------------------------------------------------
    // Pattern: [[video: URL]]
    // $1 = URL
    html = html.replace(
      /\[\[video:\s*([^\]]+)\]\]/g,
      '<div class="video-wrapper"><video controls src="$1" class="markdown-video">Your browser does not support the video tag.</video></div>'
    );

    // ... rest of the formatters (Bold, headers, etc) ...
    
    // Code Blocks
    html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
    // Inline Code
    html = html.replace(/`([^`]+)`/g, "<code class='inline-code'>$1</code>");
    // Bold
    html = html.replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>");
    // Italic
    html = html.replace(/_([^_]+)_/g, "<em>$1</em>");
    // Strikethrough
    html = html.replace(/~~([^~]+)~~/g, "<del>$1</del>");
    // Horizontal Rule
    html = html.replace(/^---$/gm, "<hr />");
    // Headings
    html = html.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*?)$/gm, "<h1>$1</h1>");
    // Blockquote
    html = html.replace(/^> (.*?)$/gm, "<blockquote>$1</blockquote>");
    // Links (Must be AFTER images, or it might break image syntax)
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Line breaks
    html = html.replace(/\n/g, "<br />");

    return html;
};

  return (
    <div className={styles.editorContainer}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolButtons}>
          {markdownTools.map((tool, index) => (
            <button
              key={index}
              className={styles.toolButton}
              title={tool.title}
              onClick={() => insertMarkdown(tool.insert, tool.after, tool.placeholder)}
              type="button"
            >
              {tool.icon}
            </button>
          ))}
        </div>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${!preview ? styles.active : ""}`}
            onClick={() => setPreview(false)}
            type="button"
            title="Edit mode"
          >
            <MdEdit style={{ marginRight: "4px" }} /> Edit
          </button>
          <button
            className={`${styles.viewBtn} ${preview ? styles.active : ""}`}
            onClick={() => setPreview(true)}
            type="button"
            title="Preview mode"
          >
            <MdPreview style={{ marginRight: "4px" }} /> Preview
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className={styles.editorContent} style={{ height }}>
        {!preview ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            placeholder={placeholder}
            className={styles.textarea}
          />
        ) : (
          <div
            className={`${styles.preview} markdown-body`}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        )}
      </div>

      {/* Info Footer */}
      <div className={styles.footer}>
        <span className={styles.charCount}>
          {content.length} character{content.length !== 1 ? "s" : ""}
        </span>
        <span className={styles.info}>Markdown formatting supported</span>
      </div>
    </div>
  );
}