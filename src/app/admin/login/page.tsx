'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLogin() {
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const response = await fetch('/api/admin/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password }),
			});

			if (response.ok) {
				router.push('/admin');
				router.refresh();
			} else {
				setError('Invalid password');
			}
		} catch (err) {
			setError('Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
			<div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
				<h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
					Admin Access
				</h1>

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter admin password"
							required
						/>
					</div>

					{error && (
						<div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
							{error}
						</div>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium">
						{loading ? 'Logging in...' : 'Login'}
					</button>
				</form>
			</div>
		</div>
	);
}
