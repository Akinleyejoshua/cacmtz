"use client";

import React, { useState, useEffect } from 'react';
import request from '@/app/utils/axios';
import { GalleryItem } from '@/app/types/gallery';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import Image from 'next/image';
import AdminTopNav from '@/app/components/admin-top-nav';
import styles from './page.module.css';

export default function GalleryManager() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await request.get('/gallery');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching gallery items:', error);
        } finally {
            setLoading(false);
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let imageUrl = '';
            if (selectedFile) {
                imageUrl = await convertToBase64(selectedFile);
            }

            const payload: any = {
                title,
                category
            };

            if (imageUrl) {
                payload.imageUrl = imageUrl;
            }

            if (editingItem) {
                await request.put(`/gallery/${editingItem._id}`, payload);
            } else {
                if (!selectedFile) {
                    alert("Please select an image file.");
                    return;
                }
                // For new items, imageUrl is required, and we know selectedFile is present
                payload.imageUrl = imageUrl;
                await request.post('/gallery', payload);
            }
            fetchItems();
            closeModal();
        } catch (error) {
            console.error('Error saving gallery item:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                await request.delete(`/gallery/${id}`);
                fetchItems();
            } catch (error) {
                console.error('Error deleting gallery item:', error);
            }
        }
    };

    const openModal = (item?: GalleryItem) => {
        if (item) {
            setEditingItem(item);
            setTitle(item.title);
            setCategory(item.category || '');
            setSelectedFile(null);
        } else {
            setEditingItem(null);
            setTitle('');
            setCategory('');
            setSelectedFile(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setTitle('');
        setCategory('');
        setSelectedFile(null);
    };

    return (
        <main className={styles.page} id='admin-gallery'>
            <AdminTopNav />

            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gallery Manager</h1>
                    <p className={styles.subtitle}>Manage your photo gallery collection</p>
                </div>
                <button onClick={() => openModal()} className={styles.actionBtn}>
                    <FaPlus size={14} /> Add New Photo
                </button>
            </div>

            {loading ? (
                <div className={styles.loading}>
                    Loading gallery items...
                </div>
            ) : (
                <div className={styles.grid}>
                    {items.map((item) => (
                        <div key={item._id} className={styles.card}>
                            <div className={styles.imageContainer}>
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle} title={item.title}>{item.title}</h3>
                                {item.category && (
                                    <span className={styles.badge}>
                                        {item.category}
                                    </span>
                                )}
                                <div className={styles.cardActions}>
                                    <button
                                        onClick={() => openModal(item)}
                                        className={styles.iconBtn}
                                        title="Edit"
                                    >
                                        <FaEdit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                                        title="Delete"
                                    >
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className={styles.emptyState}>
                            <FaImage size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <h3>No photos yet</h3>
                            <p>Get started by adding a new photo to your gallery.</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>
                            {editingItem ? 'Edit Photo' : 'Add New Photo'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Title</label>
                                <input
                                    type="text"
                                    required
                                    className={styles.input}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Photo title"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Image File</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className={styles.input}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setSelectedFile(e.target.files[0]);
                                        }
                                    }}
                                />
                                {editingItem && !selectedFile && (
                                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                                        Leave empty to keep current image.
                                    </p>
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Category</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="e.g. Worship, Event"
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className={styles.cancelBtn}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.saveBtn}
                                >
                                    {editingItem ? 'Save Changes' : 'Add Photo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
