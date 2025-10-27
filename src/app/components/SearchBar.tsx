// src/app/components/SearchBar.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const CATEGORIES = [
	'ALL',
	'FABRICATION',
	'CIVIL',
	'SOLAR',
	'ROOFING',
	'FIREPROOFING',
];

export default function SearchBar() {
	const [category, setCategory] = useState('ALL');
	const [searchQuery, setSearchQuery] = useState('');

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5 }}
			className="bg-white px-5 py-4 border-b border-gray-200 sticky top-0 z-20 shadow-sm">
			<div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
				{/* Category Dropdown */}
				<select
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					className="px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white cursor-pointer">
					{CATEGORIES.map((cat) => (
						<option key={cat} value={cat}>
							{cat}
						</option>
					))}
				</select>

				{/* Search Input */}
				<div className="flex-1 relative">
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="FIND YOUR NEXT PROJECT"
						className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
					/>
					<button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors">
						<svg
							className="w-5 h-5 text-gray-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</button>
				</div>

				{/* Voice Search */}
				<button className="sm:w-auto p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
					<svg
						className="w-5 h-5 text-gray-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
						/>
					</svg>
				</button>
			</div>
		</motion.div>
	);
}
