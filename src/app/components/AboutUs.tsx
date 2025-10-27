// src/app/components/AboutUs.tsx
'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface Statistic {
	id: number;
	statValue: string;
	statLabel: string;
}

interface AboutUsProps {
	sectionTitle: string;
	tagline: string;
	mainHeading: string;
	description: string;
	mainImageUrl: string;
	accentImage1Url?: string;
	accentImage2Url?: string;
	statistics: Statistic[];
}

// Counter Animation Component
function AnimatedCounter({ value }: { value: string }) {
	const ref = useRef<HTMLHeadingElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.5 });

	// Extract number from string like "10+" or "50+"
	const numericValue = parseInt(value.replace(/\D/g, ''), 10);
	const suffix = value.replace(/[0-9]/g, '');

	const motionValue = useMotionValue(0);
	const springValue = useSpring(motionValue, {
		damping: 60,
		stiffness: 100,
	});
	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		if (isInView) {
			motionValue.set(numericValue);
		}
	}, [isInView, motionValue, numericValue]);

	useEffect(() => {
		springValue.on('change', (latest) => {
			setDisplayValue(Math.floor(latest));
		});
	}, [springValue]);

	return (
		<h4
			ref={ref}
			className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-3">
			{displayValue}
			{suffix}
		</h4>
	);
}

export default function AboutUs({
	sectionTitle,
	tagline,
	mainHeading,
	description,
	mainImageUrl,
	accentImage1Url,
	accentImage2Url,
	statistics,
}: AboutUsProps) {
	return (
		<section
			id="about"
			className="relative py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
			{/* Decorative Background Elements */}
			<div className="absolute top-20 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl" />
			<div className="absolute bottom-20 left-0 w-96 h-96 bg-amber-100 rounded-full opacity-20 blur-3xl" />

			<div className="relative max-w-7xl mx-auto px-5 md:px-12">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-20">
					<h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
						{sectionTitle.split(' ')[0]}{' '}
						<span className="text-blue-600">
							{sectionTitle.split(' ')[1] || ''}
						</span>
					</h2>
					<p className="text-gray-600 text-xl">{tagline}</p>
				</motion.div>

				{/* Main Content Grid */}
				<div className="grid md:grid-cols-12 gap-8 lg:gap-12 mb-24">
					{/* Left: Main Image */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="md:col-span-5 relative">
						<div className="relative h-[500px] md:h-[650px] rounded-3xl overflow-hidden shadow-2xl group">
							<Image
								src={mainImageUrl}
								alt="Bhawani Construction Building"
								fill
								sizes="(max-width: 768px) 100vw, 42vw"
								className="object-cover group-hover:scale-105 transition-transform duration-700"
								priority
							/>
							<div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
						</div>

						{accentImage1Url && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.3 }}
								className="absolute -bottom-10 -right-10 w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white hidden md:block">
								<Image
									src={accentImage1Url}
									alt="Team"
									fill
									sizes="256px"
									className="object-cover"
								/>
							</motion.div>
						)}
					</motion.div>

					{/* Right: Content */}
					<div className="md:col-span-7 flex flex-col justify-center space-y-8">
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="space-y-6">
							<h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-700 leading-tight">
								{mainHeading}
							</h3>
							<p className="text-gray-700 text-lg md:text-xl leading-relaxed">
								{description}
							</p>
						</motion.div>

						{accentImage2Url && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.4 }}
								className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl">
								<Image
									src={accentImage2Url}
									alt="Construction Site"
									fill
									sizes="(max-width: 768px) 100vw, 58vw"
									className="object-cover"
								/>
							</motion.div>
						)}
					</div>
				</div>

				{/* Statistics Grid with Animated Counters */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
					{statistics.map((stat, index) => (
						<motion.div
							key={stat.id}
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{
								duration: 0.5,
								delay: index * 0.1,
								type: 'spring',
								stiffness: 100,
							}}
							whileHover={{ scale: 1.05, y: -5 }}
							className="relative bg-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all group">
							<div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-amber-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity" />

							<AnimatedCounter value={stat.statValue} />

							<p className="text-gray-700 font-semibold text-sm md:text-base">
								{stat.statLabel}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
