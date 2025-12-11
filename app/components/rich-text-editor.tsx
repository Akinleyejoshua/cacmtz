'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import {
    MdFormatBold,
    MdFormatItalic,
    MdFormatUnderlined,
    MdFormatStrikethrough,
    MdFormatAlignLeft,
    MdFormatAlignCenter,
    MdFormatAlignRight,
    MdFormatAlignJustify,
    MdFormatListBulleted,
    MdFormatListNumbered,
    MdFormatIndentDecrease,
    MdFormatIndentIncrease,
    MdLink,
    MdImage,
    MdCode,
    MdFormatQuote,
    MdHorizontalRule,
    MdFormatClear,
    MdUndo,
    MdRedo,
    MdSubscript,
    MdSuperscript,
    MdVideoLibrary,
    MdPreview,
    MdEdit,
    MdClose,
    MdCheck,
} from 'react-icons/md';
import styles from './rich-text-editor.module.css';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    isReadOnly?: boolean;
    showVariables?: boolean;
    initialContent?: string;
    templateVariables?: any[];
}

const headingOptions = [
    { label: 'Paragraph', value: 'p' },
    { label: 'Heading 1', value: 'h1' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Heading 3', value: 'h3' },
    { label: 'Heading 4', value: 'h4' },
];

const fontSizes = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px'];

export default function RichTextEditor({
    content,
    onChange,
    isReadOnly = false,
    showVariables = false,
    initialContent = '',
    templateVariables = [],
}: RichTextEditorProps) {
    const contentEditableRef = useRef<HTMLDivElement>(null);
    const [currentHeading, setCurrentHeading] = useState('p');
    const [currentFontSize, setCurrentFontSize] = useState('16px');
    const [showPreview, setShowPreview] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [mediaAlt, setMediaAlt] = useState('');
    const [mediaWidth, setMediaWidth] = useState('100%');
    const savedSelection = useRef<Range | null>(null);

    // Set initial content
    useEffect(() => {
        if (contentEditableRef.current && initialContent && !content) {
            contentEditableRef.current.innerHTML = initialContent;
        }
    }, [initialContent, content]);

    // Sync content to editor when switching from preview to edit
    useEffect(() => {
        if (!showPreview && contentEditableRef.current && content) {
            contentEditableRef.current.innerHTML = content;
        }
    }, [showPreview]);

    // Save current selection for later restoration
    const saveSelection = useCallback(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            savedSelection.current = selection.getRangeAt(0).cloneRange();
        }
    }, []);

    // Restore saved selection
    const restoreSelection = useCallback(() => {
        if (savedSelection.current) {
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(savedSelection.current);
        }
    }, []);

    const insertVariable = (variable: string) => {
        if (contentEditableRef.current && !isReadOnly) {
            contentEditableRef.current.focus();
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                const span = document.createElement('span');
                span.className = styles.variable;
                span.textContent = variable;
                span.contentEditable = 'false';
                range.insertNode(span);

                // Add space after variable
                const space = document.createTextNode('\u00A0');
                range.setStartAfter(span);
                range.insertNode(space);

                // Update content
                onChange(contentEditableRef.current.innerHTML);

                // Move cursor after the inserted variable
                range.setStartAfter(space);
                range.setEndAfter(space);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        onChange(e.currentTarget.innerHTML);
    };

    // Handle keyboard shortcuts
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // Ctrl/Cmd + B = Bold
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            execCommand('bold');
        }
        // Ctrl/Cmd + I = Italic
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            execCommand('italic');
        }
        // Ctrl/Cmd + U = Underline
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            execCommand('underline');
        }
        // Ctrl/Cmd + Z = Undo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            execCommand('undo');
        }
        // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y = Redo
        if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
            ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
            e.preventDefault();
            execCommand('redo');
        }
    };

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        contentEditableRef.current?.focus();
        if (contentEditableRef.current) {
            onChange(contentEditableRef.current.innerHTML);
        }
    };

    const handleHeadingChange = (tag: string) => {
        setCurrentHeading(tag);
        execCommand('formatBlock', `<${tag}>`);
    };

    const handleFontSizeChange = (size: string) => {
        setCurrentFontSize(size);
        document.execCommand('fontSize', false, '7');
        const fontElements = contentEditableRef.current?.querySelectorAll('font[size="7"]');
        fontElements?.forEach((element) => {
            element.removeAttribute('size');
            (element as HTMLElement).style.fontSize = size;
        });
        if (contentEditableRef.current) {
            onChange(contentEditableRef.current.innerHTML);
        }
    };

    const handleColorChange = (type: 'foreColor' | 'backColor') => {
        const input = document.createElement('input');
        input.type = 'color';
        input.value = type === 'foreColor' ? '#000000' : '#ffff00';
        input.click();
        input.addEventListener('change', () => {
            execCommand(type, input.value);
        });
    };

    // Link insertion with modal
    const openLinkModal = () => {
        saveSelection();
        const selection = window.getSelection();
        if (selection && selection.toString()) {
            setLinkText(selection.toString());
        } else {
            setLinkText('');
        }
        setLinkUrl('');
        setShowLinkModal(true);
    };

    const insertLink = () => {
        if (!linkUrl) return;

        restoreSelection();
        contentEditableRef.current?.focus();

        if (linkText && !window.getSelection()?.toString()) {
            // Insert link with custom text
            const link = document.createElement('a');
            link.href = linkUrl;
            link.textContent = linkText;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(link);
                range.setStartAfter(link);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        } else {
            // Wrap selected text with link
            execCommand('createLink', linkUrl);
            // Add target="_blank" to the created link
            const links = contentEditableRef.current?.querySelectorAll(`a[href="${linkUrl}"]`);
            links?.forEach((link) => {
                (link as HTMLAnchorElement).target = '_blank';
                (link as HTMLAnchorElement).rel = 'noopener noreferrer';
            });
        }

        if (contentEditableRef.current) {
            onChange(contentEditableRef.current.innerHTML);
        }

        setShowLinkModal(false);
        setLinkUrl('');
        setLinkText('');
    };

    // Media insertion with modal
    const openMediaModal = (type: 'image' | 'video') => {
        saveSelection();
        setMediaType(type);
        setMediaUrl('');
        setMediaAlt('');
        setMediaWidth('100%');
        setShowMediaModal(true);
    };

    const insertMedia = () => {
        if (!mediaUrl) return;

        restoreSelection();
        contentEditableRef.current?.focus();

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();

            if (mediaType === 'image') {
                const img = document.createElement('img');
                img.src = mediaUrl;
                img.alt = mediaAlt || 'Image';
                img.style.maxWidth = mediaWidth;
                img.style.height = 'auto';
                img.style.display = 'block';
                img.style.margin = '1rem auto';
                range.insertNode(img);
                range.setStartAfter(img);
            } else {
                // Video - create iframe for YouTube/Vimeo or video element
                const isYouTube = mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be');
                const isVimeo = mediaUrl.includes('vimeo.com');

                if (isYouTube || isVimeo) {
                    const iframe = document.createElement('iframe');
                    let embedUrl = mediaUrl;

                    if (isYouTube) {
                        const videoId = mediaUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                        embedUrl = `https://www.youtube.com/embed/${videoId}`;
                    } else if (isVimeo) {
                        const videoId = mediaUrl.match(/vimeo\.com\/(\d+)/)?.[1];
                        embedUrl = `https://player.vimeo.com/video/${videoId}`;
                    }

                    iframe.src = embedUrl;
                    iframe.width = '560';
                    iframe.height = '315';
                    iframe.style.maxWidth = mediaWidth;
                    iframe.style.display = 'block';
                    iframe.style.margin = '1rem auto';
                    iframe.allowFullscreen = true;
                    iframe.frameBorder = '0';
                    range.insertNode(iframe);
                    range.setStartAfter(iframe);
                } else {
                    const video = document.createElement('video');
                    video.src = mediaUrl;
                    video.controls = true;
                    video.style.maxWidth = mediaWidth;
                    video.style.height = 'auto';
                    video.style.display = 'block';
                    video.style.margin = '1rem auto';
                    range.insertNode(video);
                    range.setStartAfter(video);
                }
            }

            selection.removeAllRanges();
            selection.addRange(range);
        }

        if (contentEditableRef.current) {
            onChange(contentEditableRef.current.innerHTML);
        }

        setShowMediaModal(false);
        setMediaUrl('');
        setMediaAlt('');
    };

    return (
        <div className={styles.editorSection}>
            {showVariables && templateVariables.length > 0 && (
                <div className={styles.variablesPanel}>
                    <h4>Template Variables</h4>
                    <p>{isReadOnly ? 'Variables used:' : 'Click to insert personalized data:'}</p>
                    <div className={styles.variablesList}>
                        {templateVariables.map((variable: any) => (
                            <button
                                key={variable.value}
                                type="button"
                                className={styles.variableButton}
                                onClick={() => insertVariable(variable.value)}
                                disabled={isReadOnly}
                            >
                                {variable.label}
                            </button>
                        ))}
                    </div>

                    <div className={styles.variableExample}>
                        <strong>Example:</strong>
                        <p>
                            Hello <span className={styles.variable}>{'{{firstname}}'}</span>,
                        </p>
                        <p>Welcome to our newsletter!</p>
                    </div>
                </div>
            )}

            <div className={styles.editorContainer}>
                {!isReadOnly && (
                    <>
                        <div className={styles.editorToolbar}>
                            {/* Heading & Font Size */}
                            <select
                                className={styles.toolSelect}
                                value={currentHeading}
                                onChange={(e) => handleHeadingChange(e.target.value)}
                                title="Text Style"
                            >
                                {headingOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                className={styles.toolSelect}
                                value={currentFontSize}
                                onChange={(e) => handleFontSizeChange(e.target.value)}
                                title="Font Size"
                            >
                                {fontSizes.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>

                            <div className={styles.toolDivider} />

                            {/* Text Formatting */}
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('bold')} title="Bold (Ctrl+B)">
                                <MdFormatBold />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('italic')} title="Italic (Ctrl+I)">
                                <MdFormatItalic />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('underline')} title="Underline (Ctrl+U)">
                                <MdFormatUnderlined />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('strikeThrough')} title="Strikethrough">
                                <MdFormatStrikethrough />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('subscript')} title="Subscript">
                                <MdSubscript />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('superscript')} title="Superscript">
                                <MdSuperscript />
                            </button>

                            <div className={styles.toolDivider} />

                            {/* Colors */}
                            <button type="button" className={styles.toolButton} onClick={() => handleColorChange('foreColor')} title="Text Color">
                                <span className={styles.colorIcon}>A</span>
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => handleColorChange('backColor')} title="Highlight">
                                <span className={styles.highlightIcon}>A</span>
                            </button>

                            <div className={styles.toolDivider} />

                            {/* Alignment */}
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('justifyLeft')} title="Align Left">
                                <MdFormatAlignLeft />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('justifyCenter')} title="Align Center">
                                <MdFormatAlignCenter />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('justifyRight')} title="Align Right">
                                <MdFormatAlignRight />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('justifyFull')} title="Justify">
                                <MdFormatAlignJustify />
                            </button>

                            <div className={styles.toolDivider} />

                            {/* Lists */}
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
                                <MdFormatListBulleted />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('insertOrderedList')} title="Numbered List">
                                <MdFormatListNumbered />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('outdent')} title="Decrease Indent">
                                <MdFormatIndentDecrease />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('indent')} title="Increase Indent">
                                <MdFormatIndentIncrease />
                            </button>

                            <div className={styles.toolDivider} />

                            {/* Insert */}
                            <button type="button" className={styles.toolButton} onClick={openLinkModal} title="Insert Link">
                                <MdLink />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => openMediaModal('image')} title="Insert Image">
                                <MdImage />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => openMediaModal('video')} title="Insert Video">
                                <MdVideoLibrary />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('formatBlock', '<blockquote>')} title="Quote">
                                <MdFormatQuote />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('insertHorizontalRule')} title="Horizontal Line">
                                <MdHorizontalRule />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('formatBlock', '<pre>')} title="Code Block">
                                <MdCode />
                            </button>

                            <div className={styles.toolDivider} />

                            {/* Edit Actions */}
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('undo')} title="Undo (Ctrl+Z)">
                                <MdUndo />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('redo')} title="Redo (Ctrl+Y)">
                                <MdRedo />
                            </button>
                            <button type="button" className={styles.toolButton} onClick={() => execCommand('removeFormat')} title="Clear Formatting">
                                <MdFormatClear />
                            </button>

                            <div className={styles.toolDivider} />

                            {/* Preview Toggle */}
                            <button
                                type="button"
                                className={`${styles.toolButton} ${showPreview ? styles.active : ''}`}
                                onClick={() => setShowPreview(!showPreview)}
                                title={showPreview ? 'Edit Mode' : 'Preview Mode'}
                            >
                                {showPreview ? <MdEdit /> : <MdPreview />}
                            </button>
                        </div>
                    </>
                )}
                <div
                    ref={contentEditableRef}
                    className={styles.editor}
                    contentEditable={!isReadOnly}
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    data-placeholder="Start typing your content here..."
                />
                {/* Editor / Preview Toggle */}
                {/* {showPreview ? (
                    <div className={styles.previewContainer}>
                        <div className={styles.previewHeader}>
                            <span>Preview</span>
                            <button
                                type="button"
                                className={styles.closePreview}
                                onClick={() => setShowPreview(false)}
                            >
                                <MdEdit /> Edit
                            </button>
                        </div>
                        <div
                            className={styles.preview}
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                ) : (
                    <div
                        ref={contentEditableRef}
                        className={styles.editor}
                        contentEditable={!isReadOnly}
                        suppressContentEditableWarning
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                        data-placeholder="Start typing your content here..."
                    />
                )} */}
            </div>

            {/* Link Modal */}
            {showLinkModal && (
                <div className={styles.modalOverlay} onClick={() => setShowLinkModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Insert Link</h3>
                            <button type="button" onClick={() => setShowLinkModal(false)}>
                                <MdClose />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>URL</label>
                                <input
                                    type="url"
                                    placeholder="https://example.com"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Text (optional)</label>
                                <input
                                    type="text"
                                    placeholder="Link text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                />
                                <span className={styles.hint}>Leave empty to link selected text</span>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button type="button" className={styles.cancelBtn} onClick={() => setShowLinkModal(false)}>
                                Cancel
                            </button>
                            <button type="button" className={styles.insertBtn} onClick={insertLink} disabled={!linkUrl}>
                                <MdCheck /> Insert Link
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Media Modal */}
            {showMediaModal && (
                <div className={styles.modalOverlay} onClick={() => setShowMediaModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Insert {mediaType === 'image' ? 'Image' : 'Video'}</h3>
                            <button type="button" onClick={() => setShowMediaModal(false)}>
                                <MdClose />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>{mediaType === 'image' ? 'Image' : 'Video'} URL</label>
                                <input
                                    type="url"
                                    placeholder={mediaType === 'image'
                                        ? 'https://example.com/image.jpg'
                                        : 'https://youtube.com/watch?v=... or https://vimeo.com/...'}
                                    value={mediaUrl}
                                    onChange={(e) => setMediaUrl(e.target.value)}
                                    autoFocus
                                />
                                {mediaType === 'video' && (
                                    <span className={styles.hint}>Supports YouTube, Vimeo, or direct video URLs</span>
                                )}
                            </div>
                            {mediaType === 'image' && (
                                <div className={styles.formGroup}>
                                    <label>Alt Text (for accessibility)</label>
                                    <input
                                        type="text"
                                        placeholder="Describe the image"
                                        value={mediaAlt}
                                        onChange={(e) => setMediaAlt(e.target.value)}
                                    />
                                </div>
                            )}
                            <div className={styles.formGroup}>
                                <label>Max Width</label>
                                <select
                                    value={mediaWidth}
                                    onChange={(e) => setMediaWidth(e.target.value)}
                                >
                                    <option value="100%">Full Width (100%)</option>
                                    <option value="75%">Large (75%)</option>
                                    <option value="50%">Medium (50%)</option>
                                    <option value="25%">Small (25%)</option>
                                </select>
                            </div>
                            {mediaUrl && mediaType === 'image' && (
                                <div className={styles.mediaPreview}>
                                    <label>Preview:</label>
                                    <img src={mediaUrl} alt="Preview" style={{ maxWidth: mediaWidth }} />
                                </div>
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <button type="button" className={styles.cancelBtn} onClick={() => setShowMediaModal(false)}>
                                Cancel
                            </button>
                            <button type="button" className={styles.insertBtn} onClick={insertMedia} disabled={!mediaUrl}>
                                <MdCheck /> Insert {mediaType === 'image' ? 'Image' : 'Video'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
