// src/app/components/Contact.tsx
'use client';

import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';

interface ContactContent {
	title: string;
	subtitle: string;
	contactInfoTitle: string;
	contactInfoSubtitle: string;
}

interface ContactDetail {
	id: number;
	type: string;
	label: string;
	value: string;
}

interface WorkingHour {
	id: number;
	dayLabel: string;
	hours: string;
}

interface ContactProps {
	content: ContactContent;
	contactDetails: ContactDetail[];
	workingHours: WorkingHour[];
}

export default function Contact({
	content,
	contactDetails,
	workingHours,
}: ContactProps) {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		subject: '',
		message: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		'idle' | 'success' | 'error'
	>('idle');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus('idle');

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				setSubmitStatus('success');
				setFormData({
					name: '',
					email: '',
					phone: '',
					subject: '',
					message: '',
				});
				setTimeout(() => setSubmitStatus('idle'), 5000);
			} else {
				setSubmitStatus('error');
			}
		} catch (error) {
			console.error('Form submission error:', error);
			setSubmitStatus('error');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const phones = contactDetails.filter((d) => d.type === 'phone');
	const emails = contactDetails.filter((d) => d.type === 'email');
	const addresses = contactDetails.filter((d) => d.type === 'address');

	return (
		<section
			id="contact"
			className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
			<div className="max-w-7xl mx-auto px-5 md:px-12 w-full py-12">
				{/* Compact Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-8">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
						{content.title.split('in')[0]}
						<span className="text-blue-600">
							in{content.title.split('in')[1]}
						</span>
					</h2>
					<p className="text-gray-600 text-base md:text-lg">
						{content.subtitle}
					</p>
				</motion.div>

				{/* Two Column Layout - Compact */}
				<div className="grid lg:grid-cols-5 gap-8">
					{/* Left Column - Contact Form (3/5) */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className="lg:col-span-3 bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid md:grid-cols-2 gap-4">
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									placeholder="Full Name"
									required
									className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
								/>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="your@email.com"
									required
									className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
								/>
							</div>

							<div className="grid md:grid-cols-2 gap-4">
								<input
									type="tel"
									name="phone"
									value={formData.phone}
									onChange={handleChange}
									placeholder="Phone number"
									required
									className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
								/>
								<input
									type="text"
									name="subject"
									value={formData.subject}
									onChange={handleChange}
									placeholder="Subject"
									required
									className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
								/>
							</div>

							<textarea
								name="message"
								value={formData.message}
								onChange={handleChange}
								placeholder="Tell us about your project..."
								required
								rows={4}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
							/>

							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
								{isSubmitting ? (
									<>Processing...</>
								) : (
									<>
										<Send className="w-5 h-5" />
										Send Message
									</>
								)}
							</button>

							{submitStatus === 'success' && (
								<p className="text-green-600 text-center text-sm">
									✓ Message sent successfully!
								</p>
							)}
							{submitStatus === 'error' && (
								<p className="text-red-600 text-center text-sm">
									✗ Failed to send. Please try again.
								</p>
							)}
						</form>
					</motion.div>

					{/* Right Column - Contact Info (2/5) */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className="lg:col-span-2 space-y-6 text-sm">
						<div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
							<h3 className="text-xl font-bold text-gray-900 mb-3">
								{content.contactInfoTitle}
							</h3>
							<p className="text-gray-600 text-xs leading-relaxed mb-4">
								{content.contactInfoSubtitle}
							</p>

							{/* Phone */}
							{phones.length > 0 && (
								<div className="space-y-2 mb-4">
									<div className="flex items-center gap-2 text-gray-900">
										<Phone className="w-4 h-4" />
										<p className="font-semibold text-sm">{phones[0].label}</p>
									</div>
									{phones.map((phone) => (
										<p key={phone.id} className="text-gray-700 text-xs ml-6">
											{phone.value}
										</p>
									))}
								</div>
							)}

							{/* Email */}
							{emails.length > 0 && (
								<div className="space-y-2 mb-4">
									<div className="flex items-center gap-2 text-gray-900">
										<Mail className="w-4 h-4" />
										<p className="font-semibold text-sm">{emails[0].label}</p>
									</div>
									{emails.map((email) => (
										<p
											key={email.id}
											className="text-gray-700 text-xs ml-6 break-all">
											{email.value}
										</p>
									))}
								</div>
							)}

							{/* Addresses */}
							{addresses.length > 0 && (
								<div className="space-y-4">
									{addresses.map((address) => (
										<div key={address.id}>
											<div className="flex items-start gap-2 text-gray-900">
												<MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
												<div>
													<p className="font-semibold text-sm">
														{address.label}
													</p>
													<p className="text-gray-700 text-xs mt-1">
														{address.value}
													</p>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Working Hours */}
						{workingHours.length > 0 && (
							<div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
								<div className="flex items-center gap-2 text-gray-900 mb-3">
									<Clock className="w-4 h-4" />
									<h4 className="font-bold text-sm">Working Hours</h4>
								</div>
								<div className="space-y-2">
									{workingHours.map((hour) => (
										<div key={hour.id} className="flex justify-between text-xs">
											<span className="text-gray-700">{hour.dayLabel}</span>
											<span className="text-gray-900 font-medium">
												{hour.hours}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</motion.div>
				</div>
			</div>
		</section>
	);
}
