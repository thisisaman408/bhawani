// src/app/components/Services.tsx
'use client';

import { motion } from 'framer-motion';
import { Building2, Factory, Flame, Home, Sun, Wrench } from 'lucide-react';
import Image from 'next/image';

interface Service {
	id: number;
	title: string;
	description: string;
	iconName: string;
	imageUrl: string;
}

interface ServicesProps {
	sectionTitle: string;
	tagline: string;
	services: Service[];
}

const iconMap = {
	factory: Factory,
	building: Building2,
	fire: Flame,
	home: Home,
	wrench: Wrench,
	sun: Sun,
};

export default function Services({
	sectionTitle,
	tagline,
	services,
}: ServicesProps) {
	return (
		<section
			id="services"
			className="relative py-24 md:py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
			{/* Decorative Background */}
			<div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl" />
			<div className="absolute bottom-0 left-0 w-96 h-96 bg-red-100 rounded-full opacity-20 blur-3xl" />

			<div className="relative max-w-7xl mx-auto px-5 md:px-12">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16">
					<h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
						{sectionTitle.split(' ')[0]}{' '}
						<span className="text-red-600">{sectionTitle.split(' ')[1]}</span>
					</h2>
					<p className="text-gray-600 text-xl max-w-3xl mx-auto">{tagline}</p>
				</motion.div>

				{/* Services Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{services.map((service, index) => {
						const IconComponent =
							iconMap[service.iconName as keyof typeof iconMap] || Factory;

						return (
							<motion.div
								key={service.id}
								id={`service-${service.id}`}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{
									duration: 0.5,
									delay: index * 0.1,
								}}
								whileHover={{ y: -10 }}
								className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
								{/* Image with Overlay */}
								<div className="relative h-56 overflow-hidden">
									<Image
										src={service.imageUrl}
										alt={service.title}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										className="object-cover group-hover:scale-110 transition-transform duration-500"
									/>
									{/* Gradient Overlay */}
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

									{/* Floating Icon */}
									<motion.div
										initial={{ scale: 0 }}
										whileInView={{ scale: 1 }}
										viewport={{ once: true }}
										transition={{
											type: 'spring',
											stiffness: 200,
											delay: index * 0.1 + 0.2,
										}}
										className="absolute top-6 left-6 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:bg-red-500 transition-colors duration-300">
										<IconComponent className="w-8 h-8 text-red-600 group-hover:text-white transition-colors duration-300" />
									</motion.div>
								</div>

								{/* Content */}
								<div className="p-6">
									<h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
										{service.title}
									</h3>
									<p className="text-gray-600 leading-relaxed">
										{service.description}
									</p>
								</div>

								{/* Bottom Accent Bar */}
								<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
