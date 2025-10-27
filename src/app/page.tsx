// src/app/page.tsx
import { pool } from '@/lib/db';
import AboutUs from './components/AboutUs';
import Clients from './components/Clients';
import Contact from './components/Contact';
import FeaturedProjects from './components/FeaturedProjects';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Services from './components/Services';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
async function getHeroContent() {
	try {
		const result = await pool.query(
			'SELECT * FROM hero_content WHERE active = true ORDER BY updated_at DESC LIMIT 1'
		);

		if (result.rows.length === 0) {
			return {
				title: 'BHAWANI CONSTRUCTION',
				subtitle: "Building Tomorrow's Infrastructure Today",
				ctaText: 'Explore Our Projects',
				ctaLink: '#projects',
			};
		}

		const row = result.rows[0];
		return {
			title: row.title,
			subtitle: row.subtitle,
			ctaText: row.cta_text,
			ctaLink: row.cta_link,
		};
	} catch (error) {
		console.error('Database error:', error);
		return {
			title: 'BHAWANI CONSTRUCTION',
			subtitle: "Building Tomorrow's Infrastructure Today",
			ctaText: 'Explore Our Projects',
			ctaLink: '#projects',
		};
	}
}

async function getFeaturedProjects() {
	try {
		const result = await pool.query(
			`SELECT id, name, category, image_url, video_url, location 
       FROM featured_projects 
       WHERE active = true 
       ORDER BY display_order ASC`
		);

		return result.rows.map((row) => ({
			id: row.id,
			name: row.name,
			category: row.category,
			imageUrl: row.image_url,
			videoUrl: row.video_url || row.image_url,
			location: row.location,
		}));
	} catch (error) {
		console.error('Database error:', error);
		return [];
	}
}

async function getServicesContent() {
	try {
		const [contentResult, servicesResult] = await Promise.all([
			pool.query('SELECT * FROM services_content WHERE active = true LIMIT 1'),
			pool.query(
				'SELECT * FROM services WHERE active = true ORDER BY display_order ASC'
			),
		]);

		const content = contentResult.rows[0] || {
			section_title: 'Our Services',
			tagline: 'We offer a wide range of construction solutions',
		};

		return {
			sectionTitle: content.section_title,
			tagline: content.tagline,
			services: servicesResult.rows.map((row) => ({
				id: row.id,
				title: row.title,
				description: row.description,
				iconName: row.icon_name,
				imageUrl: row.image_url,
			})),
		};
	} catch (error) {
		console.error('Database error:', error);
		return {
			sectionTitle: 'Our Services',
			tagline: 'We offer a wide range of construction solutions',
			services: [],
		};
	}
}

async function getAboutUsContent() {
	try {
		const [contentResult, statsResult] = await Promise.all([
			pool.query('SELECT * FROM about_us_content WHERE active = true LIMIT 1'),
			pool.query(
				'SELECT * FROM about_statistics WHERE active = true ORDER BY display_order ASC'
			),
		]);

		if (contentResult.rows.length === 0) {
			return {
				sectionTitle: 'About Us',
				tagline: 'Building excellence since 2014',
				mainHeading: 'Your Trusted Partner in Construction Excellence',
				description:
					'BHAWANI CONSTRUCTION has been at the forefront of the construction industry for over a decade.',
				mainImageUrl: '',
				statistics: [],
			};
		}

		const row = contentResult.rows[0];
		return {
			sectionTitle: row.section_title,
			tagline: row.tagline,
			mainHeading: row.main_heading,
			description: row.description,
			mainImageUrl: row.hero_image_url,
			accentImage1Url: row.accent_image_1_url,
			accentImage2Url: row.accent_image_2_url,
			statistics: statsResult.rows.map((stat) => ({
				id: stat.id,
				statValue: stat.stat_value,
				statLabel: stat.stat_label,
			})),
		};
	} catch (error) {
		console.error('Database error:', error);
		return {
			sectionTitle: 'About Us',
			tagline: 'Building excellence since 2014',
			mainHeading: 'Your Trusted Partner in Construction Excellence',
			description: 'Default description',
			mainImageUrl: '',
			statistics: [],
		};
	}
}
async function getClientsData() {
	try {
		const [clientsResult, testimonialsResult] = await Promise.all([
			pool.query(
				'SELECT id, name, logo_url FROM clients WHERE active = true ORDER BY display_order ASC'
			),
			pool.query(
				'SELECT id, quote, author_name, author_position FROM testimonials WHERE active = true ORDER BY display_order ASC'
			),
		]);

		return {
			clients: clientsResult.rows.map((row) => ({
				id: row.id,
				name: row.name,
				logoUrl: row.logo_url,
			})),
			testimonials: testimonialsResult.rows.map((row) => ({
				id: row.id,
				quote: row.quote,
				authorName: row.author_name,
				authorPosition: row.author_position,
			})),
		};
	} catch (error) {
		console.error('Database error:', error);
		return { clients: [], testimonials: [] };
	}
}
async function getContactData() {
	try {
		const [contentResult, detailsResult, hoursResult] = await Promise.all([
			pool.query('SELECT * FROM contact_content WHERE active = true LIMIT 1'),
			pool.query(
				'SELECT * FROM contact_details WHERE active = true ORDER BY display_order ASC'
			),
			pool.query(
				'SELECT * FROM working_hours WHERE active = true ORDER BY display_order ASC'
			),
		]);

		return {
			content: contentResult.rows[0]
				? {
						title: contentResult.rows[0].title,
						subtitle: contentResult.rows[0].subtitle,
						contactInfoTitle: contentResult.rows[0].contact_info_title,
						contactInfoSubtitle: contentResult.rows[0].contact_info_subtitle,
				  }
				: {
						title: 'Get inTouch',
						subtitle: 'Contact us for a free consultation',
						contactInfoTitle: 'Contact Information',
						contactInfoSubtitle: 'Feel free to reach out to us',
				  },
			contactDetails: detailsResult.rows.map((row) => ({
				id: row.id,
				type: row.type,
				label: row.label,
				value: row.value,
			})),
			workingHours: hoursResult.rows.map((row) => ({
				id: row.id,
				dayLabel: row.day_label,
				hours: row.hours,
			})),
		};
	} catch (error) {
		console.error('Database error:', error);
		return {
			content: {
				title: 'Get inTouch',
				subtitle: '',
				contactInfoTitle: '',
				contactInfoSubtitle: '',
			},
			contactDetails: [],
			workingHours: [],
		};
	}
}
async function getFooterData() {
	try {
		const [servicesResult, contactResult, socialResult, contentResult] =
			await Promise.all([
				pool.query(
					'SELECT id, title, slug FROM services WHERE active = true ORDER BY display_order ASC'
				),
				pool.query(
					'SELECT * FROM contact_details WHERE active = true ORDER BY display_order ASC'
				),
				pool.query(
					'SELECT * FROM social_links WHERE active = true ORDER BY display_order ASC'
				),
				pool.query('SELECT * FROM footer_content WHERE active = true LIMIT 1'),
			]);

		return {
			services: servicesResult.rows.map((row) => ({
				id: row.id,
				title: row.title,
				slug: row.slug,
			})),
			contactDetails: contactResult.rows.map((row) => ({
				id: row.id,
				type: row.type,
				label: row.label,
				value: row.value,
			})),
			socialLinks: socialResult.rows.map((row) => ({
				id: row.id,
				platform: row.platform,
				url: row.url,
				iconName: row.icon_name,
			})),
			content: contentResult.rows[0]
				? {
						companyTagline: contentResult.rows[0].company_tagline,
						copyrightText: contentResult.rows[0].copyright_text,
				  }
				: {
						companyTagline: 'Excellence in construction',
						copyrightText: '© 2025 QUICKSOLVE.tech',
				  },
		};
	} catch (error) {
		console.error('Footer data error:', error);
		return {
			services: [],
			contactDetails: [],
			socialLinks: [],
			content: { companyTagline: '', copyrightText: '' },
		};
	}
}

export default async function Home() {
	const [
		heroContent,
		projects,
		aboutContent,
		servicesContent,
		clientsData,
		contactData,
		footerData,
	] = await Promise.all([
		getHeroContent(),
		getFeaturedProjects(),
		getAboutUsContent(),
		getServicesContent(),
		getClientsData(),
		getContactData(),
		getFooterData(),
	]);

	return (
		<>
			<Navbar />
			<main className="min-h-screen bg-white">
				<Hero {...heroContent} projects={projects.slice(0, 5)} />
				<AboutUs {...aboutContent} />
				<Services {...servicesContent} />
				<FeaturedProjects projects={projects} />
				<Clients {...clientsData} />
				<Contact {...contactData} />
			</main>
			<Footer {...footerData} />
		</>
	);
}
