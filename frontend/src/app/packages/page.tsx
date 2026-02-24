import Link from "next/link";
import Image from "next/image";

export default function Packages() {
    return (
        <>
            <header className="py-16 md:py-24 bg-surface-light dark:bg-surface-dark text-center px-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-primary dark:text-white mb-6">
                        Select Your Package
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto">
                        Revitalize your ride with our premium detailing services. Choose the level of care your vehicle deserves.
                    </p>
                </div>
            </header>

            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start">
                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full relative group">
                        <div className="mb-6">
                            <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">SILVER</h3>
                            <div className="flex items-baseline">
                                <span className="text-4xl font-extrabold text-primary dark:text-white">$70</span>
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">/ session</span>
                            </div>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">Essential care for everyday shine.</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-start">
                                <span className="material-icons text-green-500 text-sm mr-2 mt-1">check_circle</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Exterior Hand Wash</span>
                            </li>
                            <li className="flex items-start">
                                <span className="material-icons text-green-500 text-sm mr-2 mt-1">check_circle</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Wheel & Tire Cleaning</span>
                            </li>
                            <li className="flex items-start">
                                <span className="material-icons text-green-500 text-sm mr-2 mt-1">check_circle</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Interior Vacuum</span>
                            </li>
                            <li className="flex items-start">
                                <span className="material-icons text-green-500 text-sm mr-2 mt-1">check_circle</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Window Cleaning</span>
                            </li>
                        </ul>
                        <button className="w-full block bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-primary dark:text-white font-bold py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors uppercase tracking-widest text-xs">
                            Select Package
                        </button>
                    </div>

                    <div className="bg-surface-light dark:bg-surface-dark border-2 border-primary dark:border-white p-8 shadow-xl transform md:-translate-y-4 relative flex flex-col h-full z-10">
                        <div className="absolute top-0 right-0 left-0 -mt-4 flex justify-center">
                            <span className="bg-primary text-white text-xs font-bold px-4 py-1 uppercase tracking-widest shadow-sm">
                                Best Seller
                            </span>
                        </div>
                        <div className="mb-6 mt-4">
                            <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">GOLD</h3>
                            <div className="flex items-baseline">
                                <span className="text-4xl font-extrabold text-primary dark:text-white">$140</span>
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">/ session</span>
                            </div>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">Deep cleaning for a showroom finish.</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-start">
                                <span className="material-icons text-primary dark:text-white text-sm mr-2 mt-1">star</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">Everything in Silver +</span>
                            </li>
                            <li className="flex items-start">
                                <span className="material-icons text-green-500 text-sm mr-2 mt-1">check_circle</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Hand Wax Protection</span>
                            </li>
                            <li className="flex items-start">
                                <span className="material-icons text-green-500 text-sm mr-2 mt-1">check_circle</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Leather Conditioning</span>
                            </li>
                            <li className="flex items-start">
                                <span className="material-icons text-green-500 text-sm mr-2 mt-1">check_circle</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Steam Clean Interior</span>
                            </li>
                            <li className="flex items-start">
                                <span className="material-icons text-green-500 text-sm mr-2 mt-1">check_circle</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Door Jambs Detail</span>
                            </li>
                        </ul>
                        <button className="w-full block bg-primary hover:bg-[#333333] text-white font-bold py-4 px-4 transition-colors uppercase tracking-widest text-xs shadow-lg">
                            Select Package
                        </button>
                    </div>

                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full relative group">
                        <div className="mb-6">
                            <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">DIAMOND</h3>
                            <div className="flex items-baseline">
                                <span className="text-4xl font-extrabold text-primary dark:text-white">$200</span>
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">/ session</span>
                            </div>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">Ultimate luxury and protection.</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-start">
                                <span className="material-icons text-primary dark:text-white text-sm mr-2 mt-1">star</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">Everything in Gold +</span>
                            </li>
                            <li className="flex items-start">
                                <span className="material-icons text-green-500 text-sm mr-2 mt-1">check_circle</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Clay Bar Treatment</span>
                            </li>
                            <li className="flex items-start">
                                <span className="material-icons text-green-500 text-sm mr-2 mt-1">check_circle</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Machine Polish (Paint Correction)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="material-icons text-green-500 text-sm mr-2 mt-1">check_circle</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Ceramic Sealant Application</span>
                            </li>
                            <li className="flex items-start">
                                <span className="material-icons text-green-500 text-sm mr-2 mt-1">check_circle</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Engine Bay Detail</span>
                            </li>
                        </ul>
                        <button className="w-full block bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-primary dark:text-white font-bold py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors uppercase tracking-widest text-xs">
                            Select Package
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-16 px-4 bg-gray-50 dark:bg-[#1a1a1a] border-t border-border-light dark:border-border-dark mt-8" id="booking-section">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="font-display text-3xl text-primary dark:text-white mb-2">Finalize Your Booking</h2>
                        <p className="text-gray-600 dark:text-gray-400">You selected the <span className="font-bold text-primary dark:text-white">GOLD Package</span>. Choose a time that works for you.</p>
                    </div>
                    <div className="bg-surface-light dark:bg-surface-dark shadow-lg rounded-sm overflow-hidden border border-border-light dark:border-border-dark">
                        <div className="md:flex">
                            <div className="md:w-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                    <span className="material-icons mr-2 text-gray-400">calendar_today</span> Select Date
                                </h3>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <button className="text-gray-400 hover:text-primary dark:hover:text-white"><span className="material-icons">chevron_left</span></button>
                                        <span className="font-bold text-gray-800 dark:text-gray-200">October 2023</span>
                                        <button className="text-gray-400 hover:text-primary dark:hover:text-white"><span className="material-icons">chevron_right</span></button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                                        <span className="text-gray-400 text-xs">Su</span>
                                        <span className="text-gray-400 text-xs">Mo</span>
                                        <span className="text-gray-400 text-xs">Tu</span>
                                        <span className="text-gray-400 text-xs">We</span>
                                        <span className="text-gray-400 text-xs">Th</span>
                                        <span className="text-gray-400 text-xs">Fr</span>
                                        <span className="text-gray-400 text-xs">Sa</span>
                                        <span className="text-gray-300 py-2">1</span>
                                        <span className="text-gray-300 py-2">2</span>
                                        <span className="text-gray-300 py-2">3</span>
                                        <span className="text-gray-300 py-2">4</span>
                                        <button className="py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">5</button>
                                        <button className="py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">6</button>
                                        <span className="text-gray-300 py-2">7</span>
                                        <span className="text-gray-300 py-2">8</span>
                                        <button className="py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">9</button>
                                        <button className="py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">10</button>
                                        <button className="py-2 bg-primary text-white rounded-full font-bold shadow-md">11</button>
                                        <button className="py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">12</button>
                                        <button className="py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">13</button>
                                        <span className="text-gray-300 py-2">14</span>
                                    </div>
                                </div>
                                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-8 mb-3 uppercase tracking-wider">Available Slots (2 hrs)</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm text-gray-600 dark:text-gray-300 hover:border-primary dark:hover:border-white hover:text-primary dark:hover:text-white transition-colors rounded">09:00 AM</button>
                                    <button className="bg-primary text-white py-2 px-3 text-sm border border-primary transition-colors rounded shadow-sm">11:00 AM</button>
                                    <button className="border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm text-gray-600 dark:text-gray-300 hover:border-primary dark:hover:border-white hover:text-primary dark:hover:text-white transition-colors rounded">01:00 PM</button>
                                    <button className="border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm text-gray-600 dark:text-gray-300 hover:border-primary dark:hover:border-white hover:text-primary dark:hover:text-white transition-colors rounded">03:00 PM</button>
                                </div>
                            </div>
                            <div className="md:w-1/2 p-6 md:p-8 bg-gray-50 dark:bg-[#1a1a1a] flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                        <span className="material-icons mr-2 text-gray-400">receipt_long</span> Booking Summary
                                    </h3>
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Service</span>
                                            <span className="font-medium text-gray-900 dark:text-white">Gold Package</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Date</span>
                                            <span className="font-medium text-gray-900 dark:text-white">Wed, Oct 11</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Time</span>
                                            <span className="font-medium text-gray-900 dark:text-white">11:00 AM - 01:00 PM</span>
                                        </div>
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
                                            <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
                                            <span className="text-xl font-bold text-primary dark:text-white">$140.00</span>
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Payment Options</h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 cursor-pointer hover:border-primary dark:hover:border-white transition-colors group">
                                            <input className="form-radio text-primary focus:ring-primary h-4 w-4" name="payment" type="radio" />
                                            <div className="ml-3 flex-1">
                                                <span className="block text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-white transition-colors">Pay 50% Deposit Now</span>
                                                <span className="block text-xs text-gray-500 dark:text-gray-400">Secure credit card payment</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">$70.00</span>
                                        </label>
                                        <label className="flex items-center p-3 border border-primary dark:border-white bg-white dark:bg-gray-800 rounded cursor-pointer ring-1 ring-primary dark:ring-white">
                                            <input className="form-radio text-primary focus:ring-primary h-4 w-4" name="payment" type="radio" defaultChecked />
                                            <div className="ml-3 flex-1">
                                                <span className="block text-sm font-medium text-gray-900 dark:text-white">Pay in Person</span>
                                                <span className="block text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                                                    <span className="material-icons text-xs mr-1">payments</span> Cash preferred
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">$140.00</span>
                                        </label>
                                    </div>
                                </div>
                                <button className="w-full bg-primary hover:bg-[#333333] text-white font-bold py-3 px-4 mt-8 transition-colors uppercase tracking-widest text-sm shadow-md">
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
