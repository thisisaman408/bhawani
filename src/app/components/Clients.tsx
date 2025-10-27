// src/app/components/Clients.tsx
'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Image from 'next/image';

interface Client {
	id: number;
	name: string;
	logoUrl: string;
}

interface Testimonial {
	id: number;
	quote: string;
	authorName: string;
	authorPosition?: string;
}

interface ClientsProps {
	clients: Client[];
	testimonials: Testimonial[];
}

export default function Clients({ clients, testimonials }: ClientsProps) {
	return (
		<section
			id="clients"
			className="relative py-24 md:py-32 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50">
			<div className="max-w-7xl mx-auto px-5 md:px-12">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16">
					<h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
						Our <span className="text-red-600">Clients</span>
					</h2>
					<p className="text-gray-600 text-xl max-w-3xl mx-auto">
						Companies who trust our expertise and services
					</p>
				</motion.div>

				{/* Client Logos Grid - Clean & Simple */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-24">
					{clients.map((client, idx) => (
						<motion.div
							key={client.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: idx * 0.08 }}
							className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center justify-center border border-gray-200">
							<div className="relative w-full h-20">
								<Image
									src={client.logoUrl}
									alt={client.name}
									fill
									className="object-contain"
									sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
								/>
							</div>
						</motion.div>
					))}
				</div>

				{/* Testimonials Section */}
				<div className="mt-20">
					<motion.h3
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">
						What Our Clients Say
					</motion.h3>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{testimonials.map((testimonial, idx) => (
							<motion.div
								key={testimonial.id}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: idx * 0.1 }}
								className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 relative">
								{/* Quote Icon */}
								<div className="absolute top-6 right-6">
									<Quote className="w-10 h-10 text-blue-600/20" />
								</div>

								{/* Quote Text */}
								<p className="text-gray-700 text-lg leading-relaxed mb-6">
									&quot;{testimonial.quote}&quot;
								</p>

								{/* Author */}
								<div className="border-t border-gray-200 pt-4">
									<p className="font-bold text-gray-900 text-lg">
										{testimonial.authorName}
									</p>
									{testimonial.authorPosition && (
										<p className="text-gray-600 text-sm">
											{testimonial.authorPosition}
										</p>
									)}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
