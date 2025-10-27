// src/app/components/Hero.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface Project {
	id: number;
	name: string;
	category: string;
	imageUrl: string;
	videoUrl: string;
}

interface HeroProps {
	title: string;
	subtitle: string;
	ctaText: string;
	ctaLink: string;
	projects: Project[];
}

export default function Hero({
	title,
	subtitle,

	ctaLink,
	projects,
}: HeroProps) {
	const [activeProject, setActiveProject] = useState(0);
	const [isVideoReady, setIsVideoReady] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	// Only show first 5 projects
	const displayProjects = projects.slice(0, 5);

	useEffect(() => {
		if (displayProjects.length === 0) return;

		const duration = 4000;
		const switchInterval = setInterval(() => {
			setActiveProject((prev) => (prev + 1) % displayProjects.length);
		}, duration);

		return () => {
			clearInterval(switchInterval);
		};
	}, [displayProjects.length, activeProject]);

	useEffect(() => {
		const timer = setTimeout(() => setIsVideoReady(true), 500);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (videoRef.current && isVideoReady) {
			videoRef.current.load();
			videoRef.current.play().catch(() => {});
		}
	}, [activeProject, isVideoReady]);

	const currentProject = displayProjects[activeProject] || null;

	return (
		<section
			id="home"
			className="relative h-screen w-full overflow-hidden bg-black">
			{/* Background Video */}
			{isVideoReady && currentProject && (
				<div className="absolute inset-0 z-0">
					<video
						ref={videoRef}
						key={currentProject.id}
						autoPlay
						loop
						muted
						playsInline
						preload="auto"
						poster={currentProject.imageUrl}
						className="absolute inset-0 w-full h-full object-cover">
						<source src={currentProject.videoUrl} type="video/mp4" />
					</video>
					<div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/80" />
				</div>
			)}

			{/* Content */}
			<div className="relative z-10 flex h-full flex-col justify-between px-5 py-6 md:px-12 md:py-8">
				{/* Main Content */}
				<div className="flex-1 flex flex-col justify-center space-y-6 max-w-3xl pt-20">
					<AnimatePresence mode="wait">
						<motion.div
							key={activeProject}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.4 }}>
							<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 drop-shadow-2xl">
								{currentProject?.name || title}
							</h1>
							<p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed drop-shadow-xl">
								{subtitle}
							</p>
						</motion.div>
					</AnimatePresence>

					<motion.a
						href={ctaLink}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg rounded-xl shadow-2xl">
						Explore Our Projects
						<svg
							className="ml-2 w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2.5}
								d="M17 8l4 4m0 0l-4 4m4-4H3"
							/>
						</svg>
					</motion.a>
				</div>
				{/* Project Cards - Fixed Container to Prevent Cut */}

				<div className="relative pb-4">
					<div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 md:justify-center">
						<div className="flex items-end gap-4 px-2 md:px-0">
							{displayProjects.map((project, idx) => (
								<motion.button
									key={project.id}
									onClick={() => {
										setActiveProject(idx);
									}}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: idx * 0.1 + 0.5 }}
									className="flex-shrink-0">
									<div className="flex flex-col gap-2 w-56">
										<div
											className={`relative w-56 h-32 rounded-xl overflow-hidden shadow-xl transition-all duration-300 ${
												activeProject === idx
													? 'ring-4 ring-amber-500 shadow-2xl'
													: 'opacity-80 hover:opacity-100'
											}`}>
											<Image
												src={project.imageUrl}
												alt={project.name}
												fill
												sizes="224px"
												className="object-cover"
												priority={idx < 3}
											/>

											{activeProject === idx && (
												<motion.div
													layoutId="activeIndicator"
													className="absolute top-3 right-3 w-3 h-3 bg-amber-500 rounded-full shadow-lg ring-2 ring-white"
													transition={{
														type: 'spring',
														stiffness: 500,
														damping: 30,
													}}
												/>
											)}
										</div>

										<div className="px-1">
											<p className="text-amber-500 text-xs font-semibold uppercase tracking-wider mb-1">
												{project.category}
											</p>
											<h3 className="text-white font-bold text-sm leading-tight">
												{project.name}
											</h3>
										</div>
									</div>
								</motion.button>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
