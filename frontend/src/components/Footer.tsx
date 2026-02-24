import React from 'react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-primary text-white py-12 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h4 className="font-display font-bold text-lg mb-4">Northside Detailing</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Premium car care services dedicated to reviving the beauty of your vehicle. Inside and out, we handle it with passion.
                    </p>
                </div>
                <div>
                    <h4 className="font-display font-bold text-lg mb-4">Contact</h4>
                    <ul className="text-gray-400 text-sm space-y-2">
                        <li className="flex items-center"><span className="material-icons text-sm mr-2">location_on</span> 123 Automotive Blvd, Northside</li>
                        <li className="flex items-center"><span className="material-icons text-sm mr-2">phone</span> (555) 123-4567</li>
                        <li className="flex items-center"><span className="material-icons text-sm mr-2">email</span> info@northsidegarage.com</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-display font-bold text-lg mb-4">Hours</h4>
                    <ul className="text-gray-400 text-sm space-y-2">
                        <li className="flex flex-col sm:flex-row sm:justify-between"><span>Mon - Fri</span> <span>8:00 AM - 8:00 PM</span></li>
                        <li className="flex flex-col sm:flex-row sm:justify-between"><span>Saturday</span> <span>9:00 AM - 6:00 PM</span></li>
                        <li className="flex flex-col sm:flex-row sm:justify-between"><span>Sunday</span> <span>10:00 AM - 4:00 PM</span></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between text-xs text-gray-500">
                <div className="flex space-x-4 mb-4 md:mb-0">
                    <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
                <div>
                    © 2023 Northside Detailing & Garage. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
