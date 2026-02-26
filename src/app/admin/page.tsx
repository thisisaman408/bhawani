'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface MediaItem {
	id: number | string;
	section: string;
	label: string;
	currentUrl: string | null;
	type: 'image' | 'video' | 'text' | 'link' | 'info';
	field: string;
	table: string;
}

interface EditingItem {
	id: number | string;
	newUrl: string;
}

export default function AdminPanel() {
	const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState<EditingItem | null>(null);
	const [saving, setSaving] = useState(false);
	const [notification, setNotification] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);

	useEffect(() => {
		fetchAllMedia();
	}, []);

	const fetchAllMedia = async () => {
		try {
			const response = await fetch('/api/admin/media');
			const data = await response.json();
			if (response.ok && Array.isArray(data)) {
				setMediaItems(data);
			} else {
				showNotification(
					'error',
					data.details || data.error || 'Failed to load media'
				);
			}
			setLoading(false);
		} catch (error) {
			showNotification('error', 'Failed to load media: Network error');
			setLoading(false);
		}
	};

	const showNotification = (type: 'success' | 'error', message: string) => {
		setNotification({ type, message });
		setTimeout(() => setNotification(null), 3000);
	};

	const handleEdit = (id: number | string, currentUrl: string) => {
		setEditing({ id, newUrl: currentUrl || '' });
	};

	const handleCancel = () => {
		setEditing(null);
	};

	const handleSave = async (item: MediaItem) => {
		if (!editing) return;

		// Validation based on type
		if (item.type === 'image' || item.type === 'video') {
			const cloudinaryRegex = /^https:\/\/res\.cloudinary\.com\/.+/;
			if (!cloudinaryRegex.test(editing.newUrl)) {
				showNotification('error', 'Invalid Cloudinary URL');
				return;
			}
		}

		if (item.type === 'link') {
			const urlRegex = /^https?:\/\/.+/;
			if (!urlRegex.test(editing.newUrl)) {
				showNotification('error', 'Invalid URL');
				return;
			}
		}

		if (item.type === 'text' && editing.newUrl.trim().length === 0) {
			showNotification('error', 'Text cannot be empty');
			return;
		}

		setSaving(true);
		try {
			const endpoint = getEndpoint(item);
			const bodyKey =
				item.type === 'text' || item.type === 'link' ? 'value' : 'url';

			const response = await fetch(endpoint, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					field: item.field,
					[bodyKey]: editing.newUrl,
				}),
			});

			if (response.ok) {
				setMediaItems((prev) =>
					prev.map((m) =>
						m.id === item.id ? { ...m, currentUrl: editing.newUrl } : m
					)
				);
				showNotification('success', 'Content updated successfully');
				setEditing(null);
			} else {
				showNotification('error', 'Failed to update content');
			}
		} catch (error) {
			showNotification('error', 'An error occurred');
		} finally {
			setSaving(false);
		}
	};

	const getEndpoint = (item: MediaItem) => {
		if (item.table === 'about_us_content') return '/api/admin/about';
		if (item.table === 'services') return `/api/admin/services/${item.id}`;
		if (item.table === 'featured_projects')
			return `/api/admin/projects/${item.id}`;
		if (item.table === 'clients') return `/api/admin/clients/${item.id}`;
		if (item.table === 'footer_content') return '/api/admin/footer';
		if (item.table === 'social_links')
			return `/api/admin/social-links/${item.id}`;
		return '';
	};

	const groupedItems = mediaItems.reduce((acc, item) => {
		if (!acc[item.section]) acc[item.section] = [];
		acc[item.section].push(item);
		return acc;
	}, {} as Record<string, MediaItem[]>);

	const handleLogout = async () => {
		await fetch('/api/admin/logout', { method: 'POST' });
		window.location.href = '/admin/login';
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-gray-600">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			{/* Header */}
			<div className="max-w-6xl mx-auto px-4 mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Admin Panel - Media Management
					</h1>
					<p className="text-gray-600 mt-2">
						Update images, videos, and content across all website sections
					</p>
				</div>
				<button
					onClick={handleLogout}
					className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
					Logout
				</button>
			</div>

			{/* Notification */}
			{notification && (
				<div className="max-w-6xl mx-auto px-4 mb-4">
					<div
						className={`p-4 rounded-lg ${
							notification.type === 'success'
								? 'bg-green-50 text-green-800'
								: 'bg-red-50 text-red-800'
						}`}>
						{notification.message}
					</div>
				</div>
			)}

			{/* Sections */}
			<div className="max-w-6xl mx-auto px-4 space-y-8">
				{Object.entries(groupedItems).map(([section, items]) => (
					<div key={section} className="bg-white rounded-lg shadow-sm p-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-6 uppercase border-b pb-3">
							{section}
						</h2>
						<div className="space-y-6">
							{items.map((item) => (
								<div
									key={item.id}
									className="border border-gray-200 rounded-lg p-4">
									{/* Label */}
									<div className="flex items-center justify-between mb-3">
										<h3 className="font-medium text-gray-900">{item.label}</h3>
										<span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
											{item.type.toUpperCase()}
										</span>
									</div>

									{/* Info Type - Read Only */}
									{item.type === 'info' ? (
										<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
											<p className="text-sm text-blue-800">{item.currentUrl}</p>
										</div>
									) : (
										<>
											{/* Preview */}
											{item.currentUrl && (
												<div className="mb-4">
													{item.type === 'image' ? (
														<div className="relative w-full h-48 bg-gray-100 rounded">
															<img
																src={item.currentUrl}
																alt={item.label}
																className="w-full h-48 object-cover rounded"
															/>
														</div>
													) : item.type === 'video' ? (
														<video
															src={item.currentUrl}
															className="w-full h-48 rounded object-cover"
															controls
														/>
													) : item.type === 'text' ? (
														<div className="p-4 bg-gray-50 rounded border border-gray-200">
															<p className="text-gray-700 text-sm">
																{item.currentUrl}
															</p>
														</div>
													) : (
														<div className="p-4 bg-gray-50 rounded border border-gray-200">
															<a
																href={item.currentUrl}
																target="_blank"
																rel="noopener noreferrer"
																className="text-blue-600 hover:underline text-sm break-all">
																{item.currentUrl}
															</a>
														</div>
													)}
												</div>
											)}

											{/* Current URL/Value */}
											<div className="mb-3">
												<label className="text-sm text-gray-600 block mb-1">
													Current {item.type === 'text' ? 'Value' : 'URL'}:
												</label>
												{item.type === 'text' ? (
													<p className="text-sm text-gray-800">
														{item.currentUrl || 'No value set'}
													</p>
												) : (
													<a
														href={item.currentUrl || '#'}
														target="_blank"
														rel="noopener noreferrer"
														className="text-sm text-blue-600 hover:underline break-all">
														{item.currentUrl || 'No URL set'}
													</a>
												)}
											</div>

											{/* Edit Mode */}
											{editing?.id === item.id ? (
												<div>
													<label className="text-sm text-gray-600 block mb-2">
														{item.type === 'text' ? 'New Value:' : 'New URL:'}
													</label>
													{item.type === 'text' ? (
														<textarea
															value={editing.newUrl}
															onChange={(e) =>
																setEditing({
																	...editing,
																	newUrl: e.target.value,
																})
															}
															placeholder="Enter new text..."
															rows={3}
															className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
														/>
													) : (
														<input
															type="url"
															value={editing.newUrl}
															onChange={(e) =>
																setEditing({
																	...editing,
																	newUrl: e.target.value,
																})
															}
															placeholder={
																item.type === 'image' || item.type === 'video'
																	? 'https://res.cloudinary.com/...'
																	: 'https://...'
															}
															className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
														/>
													)}
													<div className="flex gap-2">
														<button
															onClick={() => handleSave(item)}
															disabled={saving}
															className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm font-medium">
															{saving ? 'Saving...' : 'Save'}
														</button>
														<button
															onClick={handleCancel}
															disabled={saving}
															className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium">
															Cancel
														</button>
													</div>
												</div>
											) : (
												<button
													onClick={() =>
														handleEdit(item.id, item.currentUrl || '')
													}
													className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium">
													Change {item.type === 'text' ? 'Text' : 'URL'}
												</button>
											)}
										</>
									)}
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
