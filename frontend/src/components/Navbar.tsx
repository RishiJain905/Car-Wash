"use client";

import { useTheme } from "next-themes";
import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Refs for focus management
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const firstMenuItemRef = useRef<HTMLAnchorElement>(null);

    // Focus management for mobile menu accessibility
    useEffect(() => {
        if (isMobileMenuOpen) {
            // When menu opens, focus the first menu item
            setTimeout(() => {
                firstMenuItemRef.current?.focus();
            }, 50);
        } else {
            // When menu closes, return focus to the toggle button
            menuButtonRef.current?.focus();
        }
    }, [isMobileMenuOpen]);

    // Use theme directly - next-themes handles SSR hydration
    // Only render theme toggle after mount to avoid hydration mismatch
    const mounted = typeof theme === "string";

    // Memoize close handler to prevent new function creation on each render
    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    return (
        <nav className="fixed w-full z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-border-light dark:border-border-dark transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center min-w-0">
                        <Link 
                            className="font-display font-bold text-lg md:text-xl tracking-wider text-primary dark:text-white uppercase truncate block max-w-[180px] md:max-w-none" 
                            href="/"
                            aria-label="Northside Detailing Home"
                        >
                            Northside Detailing
                        </Link>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link className="text-sm font-medium hover:text-gray-500 dark:hover:text-gray-300 transition-colors uppercase tracking-wide" href="/">Home</Link>
                        <Link className="text-sm font-medium hover:text-gray-500 dark:hover:text-gray-300 transition-colors uppercase tracking-wide" href="/#about">About Us</Link>
                        <Link className="text-sm font-medium hover:text-gray-500 dark:hover:text-gray-300 transition-colors uppercase tracking-wide" href="/packages">Services</Link>
                        <Link className="text-sm font-medium hover:text-gray-500 dark:hover:text-gray-300 transition-colors uppercase tracking-wide" href="/#contact">Contact</Link>
                        <Link className="bg-primary hover:bg-[#333333] text-white px-5 py-2 text-sm font-medium transition-colors uppercase tracking-wider" href="/packages#booking-section">
                            Book Now
                        </Link>
                        {mounted && (
                            <button
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                aria-label="Toggle Dark Mode"
                            >
                                {theme === 'dark' ? (
                                    <span className="material-icons text-xl">light_mode</span>
                                ) : (
                                    <span className="material-icons text-xl">dark_mode</span>
                                )}
                            </button>
                        )}
                    </div>
                    <div className="md:hidden flex items-center gap-2">
                        {mounted && (
                            <button
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                aria-label="Toggle Dark Mode"
                            >
                                {theme === 'dark' ? (
                                    <span className="material-icons text-xl">light_mode</span>
                                ) : (
                                    <span className="material-icons text-xl">dark_mode</span>
                                )}
                            </button>
                        )}
                        <button
                            ref={menuButtonRef}
                            className="text-gray-500 hover:text-primary dark:text-gray-300 dark:hover:text-white p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-menu"
                            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            <span className="material-icons">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            <div 
                id="mobile-menu"
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                aria-hidden={!isMobileMenuOpen}
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
                    <Link 
                        ref={firstMenuItemRef}
                        onClick={closeMobileMenu} 
                        className="block px-3 py-3 text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors" 
                        href="/"
                    >
                        Home
                    </Link>
                    <Link 
                        onClick={closeMobileMenu} 
                        className="block px-3 py-3 text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors" 
                        href="/#about"
                    >
                        About Us
                    </Link>
                    <Link 
                        onClick={closeMobileMenu} 
                        className="block px-3 py-3 text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors" 
                        href="/packages"
                    >
                        Services
                    </Link>
                    <Link 
                        onClick={closeMobileMenu} 
                        className="block px-3 py-3 text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors" 
                        href="/#contact"
                    >
                        Contact
                    </Link>
                    <Link 
                        onClick={closeMobileMenu} 
                        className="block w-full text-center mt-4 bg-primary text-white px-6 py-3 text-base font-medium uppercase tracking-wider rounded-md" 
                        href="/packages#booking-section"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </nav>
    );
}
