'use client';

import Image from "next/image";
import Link from 'next/link';
import { Marcellus } from "next/font/google";
import { usePathname } from 'next/navigation';
import React from 'react';

const marcellus = Marcellus({
    weight: '400', // Required for non-variable fonts
    subsets: ['latin'],
    display: 'swap',
});

export default function FreightCalculatorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Helper function to determine if a link is active
    const isActive = (path: string) => pathname === path;

    return (
        <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col justify-between selection:bg-sky-600/60 selection:text-white font-sans">
            {/* Container wrapper */}
            <div className="max-w-4xl w-full mx-auto px-4 py-8 flex flex-col flex-grow justify-between">

                {/* Header / Masthead */}
                <header className="flex flex-col sm:flex-row items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
                    <div className="flex items-center gap-1">
                        <Image
                            src="/images/logo.webp"
                            alt="Mills Brands logo"
                            width={120}
                            height={150}
                            className="h-8 w-auto sm:h-16"
                            priority
                        />
                        <h1 className={`sm:text-lg tracking-widest bg-linear-to-r from-sky-600 to-cyan-400 bg-clip-text text-transparent uppercase ${marcellus.className}`}>
                            MillsBrands<br/>Freight Calculator
                        </h1>
                    </div>

                    <nav aria-label="Main Navigation">
                        <ul className="flex items-center gap-6 pb-2">

                            {/* Existing SKU Tab */}
                            <li>
                                <Link
                                    href="/existing-sku"
                                    className={`relative pb-3 text-sm font-semibold tracking-wide transition-colors duration-200 inline-block uppercase ${isActive('/existing-sku')
                                        ? 'bg-linear-to-r from-sky-600 to-cyan-400 bg-clip-text text-transparent'
                                        : 'text-zinc-300 hover:text-zinc-200'
                                        }`}
                                >
                                    Existing SKU
                                    {isActive('/existing-sku') && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-sky-600 to-cyan-400 rounded-full" />
                                    )}
                                </Link>
                            </li>

                            {/* New SKU Tab */}
                            <li>
                                <Link
                                    href="/new-sku"
                                    className={`relative pb-3 text-sm font-semibold tracking-wide transition-colors duration-200 inline-block uppercase ${isActive('/new-sku')
                                        ? 'bg-linear-to-r from-sky-600 to-cyan-400 bg-clip-text text-transparent'
                                        : 'text-zinc-300 hover:text-zinc-200'
                                        }`}
                                >
                                    New SKU
                                    {isActive('/new-sku') && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-sky-600 to-cyan-400 rounded-full" />
                                    )}
                                </Link>
                            </li>

                        </ul>
                    </nav>
                </header>

                {/* Main Content Card */}
                <main className="bg-zinc-700/40 border border-zinc-600/60 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl shadow-black/40 flex-grow">
                    {children}
                </main>

                {/* Footer / Mastfoot */}
                <footer className="pt-8 text-center text-xs text-zinc-500">
                    <p>MillsBrands Freight Calculator &copy; {new Date().getFullYear()}</p>
                </footer>

            </div>
        </div>
    );
}