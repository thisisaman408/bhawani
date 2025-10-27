// src/app/components/Navbar.tsx
'use client';

import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [hidden, setHidden] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { scrollY } = useScroll();

	// Track scroll position for background change
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Auto-hide navbar on scroll down, show on scroll up
	useMotionValueEvent(scrollY, 'change', (latest) => {
		const previous = scrollY.getPrevious();
		// getPrevious() can be undefined on the initial event; ensure it's a number before comparing
		if (typeof previous === 'number') {
			if (latest > previous && latest > 150) {
				setHidden(true);
			} else {
				setHidden(false);
			}
		} else {
			// No previous value yet; keep navbar visible
			setHidden(false);
		}
	});

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
			setIsMobileMenuOpen(false);
		}
	};

	return (
		<motion.nav
			variants={{
				visible: { y: 0 },
				hidden: { y: '-100%' },
			}}
			animate={hidden ? 'hidden' : 'visible'}
			transition={{ duration: 0.35, ease: 'easeInOut' }}
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled
					? 'bg-black/80 backdrop-blur-lg shadow-2xl'
					: 'bg-gradient-to-b from-black/30 to-transparent'
			}`}>
			<div className="max-w-7xl mx-auto px-5 md:px-12">
				<div className="flex items-center justify-between h-20">
					{/* Logo */}
					<button
						onClick={() => scrollToSection('home')}
						className="flex items-center gap-3 group">
						<div className="h-10 w-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
							<Image
								src="/logo.png"
								alt="Bhawani Construction logo"
								width={40}
								height={30}
								className="text-white font-bold text-xl"
							/>
						</div>
						<span
							className="text-white font-bold text-lg md:text-xl tracking-wide"
							style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
							BHAWANI CONS
						</span>
					</button>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-6">
						<button
							onClick={() => scrollToSection('home')}
							className="text-white hover:text-amber-400 font-bold text-sm transition-colors"
							style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
							Home
						</button>
						<button
							onClick={() => scrollToSection('about')}
							className="text-white hover:text-amber-400 font-bold text-sm transition-colors"
							style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
							About Us
						</button>
						<button
							onClick={() => scrollToSection('services')}
							className="text-white hover:text-amber-400 font-bold text-sm transition-colors"
							style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
							Services
						</button>
						<button
							onClick={() => scrollToSection('projects')}
							className="text-white hover:text-amber-400 font-bold text-sm transition-colors"
							style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
							Projects
						</button>
						<button
							onClick={() => scrollToSection('contact')}
							className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-lg shadow-lg transition-all hover:scale-105">
							Contact Us
						</button>
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className="md:hidden text-white p-2"
						style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							{isMobileMenuOpen ? (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							) : (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							)}
						</svg>
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: 'auto' }}
					exit={{ opacity: 0, height: 0 }}
					className="md:hidden bg-black/90 backdrop-blur-lg border-t border-white/10">
					<div className="px-5 py-4 space-y-3">
						<button
							onClick={() => scrollToSection('home')}
							className="block w-full text-left text-white hover:text-amber-400 font-bold py-2 transition-colors">
							Home
						</button>
						<button
							onClick={() => scrollToSection('about')}
							className="block w-full text-left text-white hover:text-amber-400 font-bold py-2 transition-colors">
							About Us
						</button>
						<button
							onClick={() => scrollToSection('services')}
							className="block w-full text-left text-white hover:text-amber-400 font-bold py-2 transition-colors">
							Services
						</button>
						<button
							onClick={() => scrollToSection('projects')}
							className="block w-full text-left text-white hover:text-amber-400 font-bold py-2 transition-colors">
							Projects
						</button>
						<button
							onClick={() => scrollToSection('contact')}
							className="block w-full text-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-lg transition-all">
							Contact Us
						</button>
					</div>
				</motion.div>
			)}
		</motion.nav>
	);
}
