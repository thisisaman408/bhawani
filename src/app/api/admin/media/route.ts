import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const mediaItems = [];

    // Hero Section - Info Only (uses first 5 projects)
    mediaItems.push({
      id: 'hero-info',
      section: 'Hero Section',
      label: 'Hero Background Content',
      currentUrl: 'Hero section displays the first 5 featured projects with rotating videos/images. Edit projects in "Featured Projects Section" below.',
      type: 'info',
      field: 'info',
      table: 'none',
    });

    // About Us Section
    const aboutResult = await pool.query(
      'SELECT id, hero_image_url, secondary_image_url, accent_image_1_url, accent_image_2_url FROM about_us_content WHERE active = true LIMIT 1'
    );
    if (aboutResult.rows[0]) {
      const about = aboutResult.rows[0];
      [
        { url: about.hero_image_url, field: 'hero_image_url', label: 'Hero Image' },
        { url: about.secondary_image_url, field: 'secondary_image_url', label: 'Secondary Image' },
        { url: about.accent_image_1_url, field: 'accent_image_1_url', label: 'Accent Image 1' },
        { url: about.accent_image_2_url, field: 'accent_image_2_url', label: 'Accent Image 2' },
      ].forEach(({ url, field, label }) => {
        if (url) {
          mediaItems.push({
            id: `about-${field}-${about.id}`,
            section: 'About Us Section',
            label,
            currentUrl: url,
            type: 'image',
            field,
            table: 'about_us_content',
          });
        }
      });
    }

    // Services Section
    const servicesResult = await pool.query(
      'SELECT id, title, image_url FROM services WHERE active = true ORDER BY display_order'
    );
    servicesResult.rows.forEach((service) => {
      if (service.image_url) {
        mediaItems.push({
          id: service.id,
          section: 'Services Section',
          label: `${service.title} - Image`,
          currentUrl: service.image_url,
          type: 'image',
          field: 'image_url',
          table: 'services',
        });
      }
    });

    // Featured Projects Section (USED IN HERO!)
    const projectsResult = await pool.query(
      'SELECT id, name, image_url, video_url FROM featured_projects WHERE active = true ORDER BY display_order'
    );
    projectsResult.rows.forEach((project, index) => {
      const isInHero = index < 5 ? ' (Used in Hero)' : '';
      
      if (project.image_url) {
        mediaItems.push({
          id: project.id,
          section: 'Featured Projects Section',
          label: `${project.name} - Image${isInHero}`,
          currentUrl: project.image_url,
          type: 'image',
          field: 'image_url',
          table: 'featured_projects',
        });
      }
      if (project.video_url) {
        mediaItems.push({
          id: `project-video-${project.id}`,
          section: 'Featured Projects Section',
          label: `${project.name} - Video${isInHero}`,
          currentUrl: project.video_url,
          type: 'video',
          field: 'video_url',
          table: 'featured_projects',
        });
      }
    });

    // Clients Section
    const clientsResult = await pool.query(
      'SELECT id, name, logo_url FROM clients WHERE active = true ORDER BY display_order'
    );
    clientsResult.rows.forEach((client) => {
      if (client.logo_url) {
        mediaItems.push({
          id: client.id,
          section: 'Clients Section',
          label: `${client.name} - Logo`,
          currentUrl: client.logo_url,
          type: 'image',
          field: 'logo_url',
          table: 'clients',
        });
      }
    });

    // Footer Section
    const footerResult = await pool.query(
      'SELECT id, company_tagline, copyright_text FROM footer_content WHERE active = true LIMIT 1'
    );
    if (footerResult.rows[0]) {
      const footer = footerResult.rows[0];
      mediaItems.push({
        id: `footer-tagline-${footer.id}`,
        section: 'Footer Section',
        label: 'Company Tagline',
        currentUrl: footer.company_tagline,
        type: 'text',
        field: 'company_tagline',
        table: 'footer_content',
      });
      mediaItems.push({
        id: `footer-copyright-${footer.id}`,
        section: 'Footer Section',
        label: 'Copyright Text',
        currentUrl: footer.copyright_text,
        type: 'text',
        field: 'copyright_text',
        table: 'footer_content',
      });
    }

    // Social Links Section
    const socialResult = await pool.query(
      'SELECT id, platform, url, icon_name FROM social_links WHERE active = true ORDER BY display_order'
    );
    socialResult.rows.forEach((social) => {
      mediaItems.push({
        id: social.id,
        section: 'Social Links Section',
        label: `${social.platform} - URL`,
        currentUrl: social.url,
        type: 'link',
        field: 'url',
        table: 'social_links',
      });
    });

    return NextResponse.json(mediaItems);
  } catch (error) {
    console.error('Error fetching media:', error);
    if (error instanceof Error && 'code' in error) {
      console.error('Database Error Code:', (error as any).code);
    }
    return NextResponse.json(
      {
        error: 'Failed to fetch media',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
