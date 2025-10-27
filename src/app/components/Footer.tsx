// src/app/components/Footer.tsx
'use client';

import {
	Facebook,
	Instagram,
	Linkedin,
	Mail,
	MapPin,
	Phone,
	Twitter,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Service {
	id: number;
	title: string;
	slug: string;
}

interface ContactDetail {
	id: number;
	type: string;
	label: string;
	value: string;
}

interface SocialLink {
	id: number;
	platform: string;
	url: string;
	iconName: string;
}

interface FooterContent {
	companyTagline: string;
	copyrightText: string;
}

interface FooterProps {
	services: Service[];
	contactDetails: ContactDetail[];
	socialLinks: SocialLink[];
	content: FooterContent;
}

const socialIcons = {
	Facebook: Facebook,
	Twitter: Twitter,
	Linkedin: Linkedin,
	Instagram: Instagram,
};

export default function Footer({
	services,
	contactDetails,
	socialLinks,
	content,
}: FooterProps) {
	const phones = contactDetails.filter((d) => d.type === 'phone');
	const emails = contactDetails.filter((d) => d.type === 'email');
	const address = contactDetails.find(
		(d) => d.type === 'address' && d.label.includes('Mansurchak')
	);

	const handleServiceClick = (serviceId: number) => {
		// Scroll to services section
		const servicesSection = document.getElementById('services');
		if (servicesSection) {
			servicesSection.scrollIntoView({ behavior: 'smooth' });

			// After scroll, highlight the clicked service
			setTimeout(() => {
				const serviceCard = document.getElementById(`service-${serviceId}`);
				if (serviceCard) {
					// Add highlight animation
					serviceCard.classList.add('ring-4', 'ring-blue-500', 'scale-105');
					serviceCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

					// Remove highlight after 2 seconds
					setTimeout(() => {
						serviceCard.classList.remove(
							'ring-4',
							'ring-blue-500',
							'scale-105'
						);
					}, 2000);
				}
			}, 800);
		}
	};

	return (
		<footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16">
			<div className="max-w-7xl mx-auto px-5 md:px-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
					{/* Company Info */}
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<div className="w-16 h-16 bg-white rounded-lg p-2">
								<Image
									src="/logo.png"
									alt="Bhawani Construction"
									width={64}
									height={64}
									className="w-full h-full object-contain"
								/>
							</div>
						</div>
						<p className="text-gray-400 text-sm leading-relaxed">
							{content.companyTagline}
						</p>

						{/* Social Links */}
						<div className="flex gap-3 pt-4">
							{socialLinks.map((social) => {
								const Icon =
									socialIcons[social.iconName as keyof typeof socialIcons];
								return Icon ? (
									<a
										key={social.id}
										href={social.url}
										target="_blank"
										rel="noopener noreferrer"
										className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
										<Icon className="w-5 h-5" />
									</a>
								) : null;
							})}
						</div>
					</div>

					{/* Our Services */}
					<div>
						<h3 className="text-lg font-bold mb-4">Our Services</h3>
						<ul className="space-y-2">
							{services.map((service) => (
								<li key={service.id}>
									<button
										onClick={() => handleServiceClick(service.id)}
										className="text-gray-400 hover:text-white transition-colors text-sm text-left">
										{service.title}
									</button>
								</li>
							))}
						</ul>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-lg font-bold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="#home"
									className="text-gray-400 hover:text-white transition-colors text-sm">
									Home
								</a>
							</li>
							<li>
								<a
									href="#about"
									className="text-gray-400 hover:text-white transition-colors text-sm">
									About Us
								</a>
							</li>
							<li>
								<a
									href="#projects"
									className="text-gray-400 hover:text-white transition-colors text-sm">
									Projects
								</a>
							</li>
							<li>
								<a
									href="#clients"
									className="text-gray-400 hover:text-white transition-colors text-sm">
									Clients
								</a>
							</li>
							<li>
								<a
									href="#contact"
									className="text-gray-400 hover:text-white transition-colors text-sm">
									Contact Us
								</a>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="text-lg font-bold mb-4">Contact Info</h3>
						<div className="space-y-4">
							{/* Address */}
							{address && (
								<div className="flex items-start gap-3">
									<MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
									<div>
										<p className="font-semibold text-sm">Address:</p>
										<p className="text-gray-400 text-sm">{address.value}</p>
									</div>
								</div>
							)}

							{/* Phone */}
							{phones.length > 0 && (
								<div className="flex items-start gap-3">
									<Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
									<div>
										<p className="font-semibold text-sm">Phone:</p>
										{phones.map((phone) => (
											<p key={phone.id} className="text-gray-400 text-sm">
												{phone.value}
											</p>
										))}
									</div>
								</div>
							)}

							{/* Email */}
							{emails.length > 0 && (
								<div className="flex items-start gap-3">
									<Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
									<div>
										<p className="font-semibold text-sm">Email:</p>
										{emails.map((email) => (
											<p
												key={email.id}
												className="text-gray-400 text-sm break-all">
												{email.value}
											</p>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-gray-800 pt-8 text-center">
					<p className="text-gray-400 text-sm">{content.copyrightText}</p>
				</div>
			</div>
		</footer>
	);
}
