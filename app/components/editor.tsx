"use client";

import React, { useState, useRef } from "react";
import styles from "./editor.module.css";

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
  height = "400px",
}: EditorProps) {
  const [content, setContent] = useState(defaultValue);
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange(newContent);
  };

  const insertMarkdown = (before: string, after: string = "", placeholder: string = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    const newContent = beforeText + before + selectedText + after + afterText;
    setContent(newContent);
    onContentChange(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selectedText.length;
      textarea.focus();
    }, 0);
  };

  const markdownTools = [
    { label: "B", title: "Bold", insert: "**", after: "**" },
    { label: "I", title: "Italic", insert: "_", after: "_" },
    { label: "S", title: "Strikethrough", insert: "~~", after: "~~" },
    { label: "H1", title: "Heading 1", insert: "# ", after: "" },
    { label: "H2", title: "Heading 2", insert: "## ", after: "" },
    { label: "H3", title: "Heading 3", insert: "### ", after: "" },
    { label: "Code", title: "Inline Code", insert: "`", after: "`" },
    { label: "Quote", title: "Blockquote", insert: "> ", after: "" },
    { label: "Link", title: "Link", insert: "[", after: "](url)" },
    { label: "Image", title: "Image", insert: "![alt](", after: ")" },
    { label: "List", title: "Unordered List", insert: "- ", after: "" },
    { label: "Number", title: "Ordered List", insert: "1. ", after: "" },
  ];

  const renderMarkdown = (text: string): string => {
    let html = text;

    // Escape HTML
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

    // Inline code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Bold
    html = html.replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>");

    // Italic
    html = html.replace(/_([^_]+)_/g, "<em>$1</em>");

    // Strikethrough
    html = html.replace(/~~([^~]+)~~/g, "<del>$1</del>");

    // Headers
    html = html.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*?)$/gm, "<h1>$1</h1>");

    // Blockquotes
    html = html.replace(/^> (.*?)$/gm, "<blockquote>$1</blockquote>");

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />');

    // Line breaks
    html = html.replace(/\n\n/g, "</p><p>");
    html = "<p>" + html + "</p>";
    html = html.replace(/<p><\/p>/g, "");

    // Lists
    html = html.replace(/^- (.*?)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>.*?<\/li>)/, "<ul>$1</ul>");
    html = html.replace(/^1\. (.*?)$/gm, "<li>$1</li>");

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
              onClick={() => insertMarkdown(tool.insert, tool.after)}
              type="button"
            >
              {tool.label}
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
            ✏️ Edit
          </button>
          <button
            className={`${styles.viewBtn} ${preview ? styles.active : ""}`}
            onClick={() => setPreview(true)}
            type="button"
            title="Preview mode"
          >
            👁️ Preview
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
            className={styles.preview}
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
