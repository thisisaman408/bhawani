// src/app/components/FeaturedProjects.tsx
'use client';

import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	MapPin,
	User,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface Project {
	id: number;
	name: string;
	category: string;
	imageUrl: string;
	location: string;
	description?: string;
	completionYear?: number;
	clientName?: string;
}

interface FeaturedProjectsProps {
	projects: Project[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
	const [showFullGallery, setShowFullGallery] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const pinnedSectionRef = useRef<HTMLDivElement>(null);
	const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

	const projectsPerPage = 2;
	const totalPages = Math.ceil(projects.length / projectsPerPage);

	// GSAP Scroll Pin
	useEffect(() => {
		if (showFullGallery) return;

		const ctx = gsap.context(() => {
			const projectElements = gsap.utils.toArray('.pinned-project');

			projectElements.forEach((element, i) => {
				if (i < 3) {
					const st = ScrollTrigger.create({
						trigger: element as HTMLElement,
						start: 'top top',
						pin: true,
						pinSpacing: false,
						end: () => `+=${window.innerHeight}`,
					});
					scrollTriggersRef.current.push(st);
				}
			});
		}, pinnedSectionRef);

		return () => {
			ctx.revert();
		};
	}, [showFullGallery]);

	const handleViewAll = () => {
		scrollTriggersRef.current.forEach((st) => st.kill());
		scrollTriggersRef.current = [];
		ScrollTrigger.getAll().forEach((st) => st.kill());

		setTimeout(() => {
			setShowFullGallery(true);

			setTimeout(() => {
				const projectsSection = document.getElementById('projects');
				if (projectsSection) {
					projectsSection.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					});
				}
			}, 150);
		}, 100);
	};

	const goToNextPage = () => {
		setCurrentPage((prev) => {
			const newPage = Math.min(prev + 1, totalPages - 1);
			scrollToProjects();
			return newPage;
		});
	};

	const goToPreviousPage = () => {
		setCurrentPage((prev) => {
			const newPage = Math.max(prev - 1, 0);
			scrollToProjects();
			return newPage;
		});
	};

	const scrollToProjects = () => {
		setTimeout(() => {
			const projectsSection = document.getElementById('projects');
			if (projectsSection) {
				projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}, 100);
	};

	const gradientBackgrounds = [
		'bg-gradient-to-br from-blue-50 to-white',
		'bg-gradient-to-br from-purple-50 to-white',
		'bg-gradient-to-br from-amber-50 to-white',
	];

	if (showFullGallery) {
		const currentProjects = projects.slice(
			currentPage * projectsPerPage,
			(currentPage + 1) * projectsPerPage
		);

		return (
			<section
				id="projects"
				className="relative min-h-screen bg-white py-24 md:py-32">
				<div className="max-w-7xl mx-auto px-5 md:px-12">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center mb-16">
						<p className="text-amber-600 text-sm font-bold uppercase tracking-wider mb-2">
							COMPLETE PORTFOLIO
						</p>
						<h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
							All <span className="text-blue-600">Projects</span>
						</h2>
					</motion.div>

					<div className="space-y-32">
						{currentProjects.map((project, idx) => {
							const isEven = idx % 2 === 0;

							return (
								<motion.div
									key={project.id}
									initial={{ opacity: 0, y: 50 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, delay: idx * 0.2 }}
									className={`grid lg:grid-cols-2 gap-12 items-center ${
										isEven ? '' : 'lg:grid-flow-dense'
									}`}>
									<div className={`relative ${isEven ? '' : 'lg:col-start-2'}`}>
										<div className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
											<Image
												src={project.imageUrl}
												alt={project.name}
												fill
												sizes="(max-width: 1024px) 100vw, 50vw"
												className="object-cover group-hover:scale-105 transition-transform duration-700"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

											<div className="absolute bottom-6 left-6">
												<span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-bold rounded-full">
													{project.category}
												</span>
											</div>
										</div>
									</div>

									<div
										className={`space-y-6 ${
											isEven ? '' : 'lg:col-start-1 lg:row-start-1'
										}`}>
										<h3 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
											{project.name}
										</h3>

										<div className="flex items-center gap-2 text-gray-600">
											<MapPin className="w-5 h-5" />
											<p className="text-lg">{project.location}</p>
										</div>

										{project.description && (
											<p className="text-gray-700 text-lg leading-relaxed">
												{project.description}
											</p>
										)}

										<div className="flex flex-wrap gap-6">
											{project.completionYear && (
												<div className="flex items-center gap-2">
													<div className="p-2 bg-blue-100 rounded-lg">
														<Calendar className="w-5 h-5 text-blue-600" />
													</div>
													<div>
														<p className="text-xs text-gray-500 uppercase">
															Year
														</p>
														<p className="text-sm font-bold text-gray-900">
															{project.completionYear}
														</p>
													</div>
												</div>
											)}
											{project.clientName && (
												<div className="flex items-center gap-2">
													<div className="p-2 bg-amber-100 rounded-lg">
														<User className="w-5 h-5 text-amber-600" />
													</div>
													<div>
														<p className="text-xs text-gray-500 uppercase">
															Client
														</p>
														<p className="text-sm font-bold text-gray-900">
															{project.clientName}
														</p>
													</div>
												</div>
											)}
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>

					{/* Bottom Pagination */}
					<div className="flex items-center justify-center gap-8 mt-20">
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							onClick={goToPreviousPage}
							disabled={currentPage === 0}
							className="p-4 bg-white border-2 border-gray-300 rounded-full hover:border-blue-600 hover:bg-blue-50 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
							<ChevronLeft className="w-6 h-6 text-gray-700" />
						</motion.button>

						<div className="flex items-center gap-3">
							<span className="text-2xl font-bold text-blue-600">
								{String(currentPage + 1).padStart(2, '0')}
							</span>
							<span className="text-gray-400 text-xl">/</span>
							<span className="text-xl text-gray-600">
								{String(totalPages).padStart(2, '0')}
							</span>
						</div>

						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							onClick={goToNextPage}
							disabled={currentPage === totalPages - 1}
							className="p-4 bg-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
							<ChevronRight className="w-6 h-6 text-white" />
						</motion.button>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section id="projects" ref={pinnedSectionRef} className="relative">
			<div className="max-w-7xl mx-auto px-5 md:px-12 py-24">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-16">
					<p className="text-amber-600 text-sm font-bold uppercase tracking-wider mb-2">
						01 FEATURED
					</p>
					<h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
						Featured <span className="text-blue-600">Projects</span>
					</h2>
				</motion.div>
			</div>

			{projects.slice(0, 3).map((project, idx) => (
				<div
					key={project.id}
					className={`pinned-project min-h-screen flex items-center ${gradientBackgrounds[idx]}`}>
					<div className="max-w-7xl mx-auto px-5 md:px-12 w-full">
						<div className="grid lg:grid-cols-2 gap-12 items-center">
							<motion.div
								initial={{ opacity: 0, x: -50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								className="relative">
								<div className="relative h-[500px] md:h-[700px] rounded-3xl overflow-hidden shadow-2xl">
									<Image
										src={project.imageUrl}
										alt={project.name}
										fill
										sizes="(max-width: 1024px) 100vw, 50vw"
										className="object-cover"
										priority={idx === 0}
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

									<div className="absolute bottom-6 left-6">
										<span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-bold rounded-full">
											{project.category}
										</span>
									</div>
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: 50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								className="space-y-8">
								<h3 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
									{project.name}
								</h3>

								<div className="flex items-center gap-2 text-gray-600">
									<MapPin className="w-5 h-5" />
									<p className="text-lg">{project.location}</p>
								</div>

								{project.description && (
									<p className="text-gray-700 text-lg leading-relaxed">
										{project.description}
									</p>
								)}

								<div className="flex flex-wrap gap-6">
									{project.completionYear && (
										<div className="flex items-center gap-2">
											<div className="p-2 bg-blue-100 rounded-lg">
												<Calendar className="w-5 h-5 text-blue-600" />
											</div>
											<div>
												<p className="text-xs text-gray-500 uppercase">Year</p>
												<p className="text-sm font-bold">
													{project.completionYear}
												</p>
											</div>
										</div>
									)}
								</div>
							</motion.div>
						</div>
					</div>
				</div>
			))}

			<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white">
				<motion.button
					onClick={handleViewAll}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className="relative group">
					<motion.div
						animate={{ scale: [1, 1.2, 1] }}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
						className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-30"
					/>

					<div className="relative px-12 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xl rounded-full shadow-2xl">
						View All Projects →
					</div>
				</motion.button>
			</div>
		</section>
	);
}
