// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Bhawani Construction',
	description: "Building Tomorrow's Infrastructure Today",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased" suppressHydrationWarning={true}>
				{children}
			</body>
		</html>
	);
}
