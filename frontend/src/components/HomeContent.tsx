"use client";

import Link from 'next/link'
import Image from 'next/image'
import { motion } from "framer-motion"
import { ContactForm } from '@/components/ContactForm'
import { MotionSection, MotionCard } from '@/components/Motion'

export function HomeContent() {
  return (
    <>
      <header className="relative h-[calc(100vh-80px)] min-h-[700px] flex items-center justify-center overflow-hidden" id="home">
        <div className="absolute inset-0 z-0">
          <Image
            alt="Matte black luxury sports car"
            className="w-full h-full object-cover object-center"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuATtI1jFU6fYYY_VpB4MLH1_QAgq9TaENO4B0PLCSEkl7QZ_GxMv5eDkfZwCYT7W01L7PplDL1a3E30cUMw2-xAMR-T9xo4YknNUhmAjVtrloF3gaaQG2otuS4eA0dbQbdVBJvK4G3tsni1tWSt2ay0OTZt4vHaMk9k1eJcz_DxgaHErLr1v1qrN6MSQc54rcQBl2wkKZRwHuDQYTYUHad4zjws-ofl4bpDu9Qe7Uda7s0_YpB5VBPGN12n-V52Y8_PaO0njP4AGw"
            fill
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/80"></div>
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto" style={{ marginTop: "-10vh" }}>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-200 dark:text-gray-300 text-sm sm:text-base tracking-[0.2em] uppercase mb-6 font-medium"
          >
            Premium Automotive Care
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-medium text-white mb-8 tracking-tight leading-none drop-shadow-lg"
          >
            Northside <br /><span className="italic font-normal text-gray-200">Detailing</span> & Garage
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
          >
            Revitalize Your Ride, Inside and Out. Experience the pinnacle of automotive detailing perfection.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm font-semibold min-w-[180px]" href="/packages">
              Our Services
            </Link>
            <Link className="w-full sm:w-auto px-8 py-4 border border-white text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest text-sm font-semibold min-w-[180px]" href="#contact">
              Contact Us
            </Link>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ 
              duration: 1.5, 
              delay: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="material-icons text-white text-3xl opacity-70"
            aria-hidden="true"
          >
            keyboard_arrow_down
          </motion.span>
        </motion.div>
      </header>

      <div className="bg-primary text-white py-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-sm sm:text-base font-medium tracking-wide uppercase flex items-center justify-center gap-2">
            <span className="material-icons text-lg" aria-hidden="true">construction</span>
            Automotive Repairs Coming Soon — Stay Tuned for Full Service Garage
          </p>
        </div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <MotionSection className="py-20 md:py-32 bg-background-light dark:bg-background-dark" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-w-4 aspect-h-5 rounded-sm overflow-hidden shadow-2xl">
                <Image
                  alt="Detailed close-up of a car wheel rim"
                  className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4x7AX2JTWG_BFADGsJIo0XolXWt9mhpn9hMYkNNOraQcjhWgK6dkC-opWeHSEUnpY_lCi5XZws1kowoYcD6E3TDZtkKgEpmjH-7H_frzqH0vO5Ms2SudX-qD4VjMy7ilGMWqxDUYVB-5EvS4njmj4S_kZHRbHIuuTZa1G83VTExrK1abehiwVfdv2RMeyvJpJTopM8fv82nvFHh-iStnhlAXzUqibykTCNDWH3Gw0wgz2CuFwKlFl5keHxLFNTkKgEGPYUzJ44Q"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gray-100 dark:bg-gray-800 -z-10 rounded-sm"></div>
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-display text-gray-900 dark:text-white mb-6">
                Excellence in <br />Every Detail.
              </h2>
              <div className="w-20 h-1 bg-primary dark:bg-white mb-8"></div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg leading-relaxed">
                At Northside Detailing & Garage, we believe your vehicle deserves nothing less than perfection. We specialize in high-end detailing services that restore your car&apos;s showroom shine and protect it against the elements.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                Our team of certified professionals uses only premium products and state-of-the-art techniques. Whether it&apos;s a daily driver or a luxury exotic, we treat every vehicle with the same meticulous care and attention.
              </p>
              <div className="flex items-center gap-8 text-sm uppercase tracking-wider font-semibold text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-gray-400" aria-hidden="true">check_circle</span>
                  Certified Pros
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-gray-400" aria-hidden="true">check_circle</span>
                  Premium Products
                </div>
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      <section className="py-20 bg-surface-light dark:bg-surface-dark transition-colors duration-300" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-gray-500 dark:text-gray-400 text-sm tracking-widest uppercase mb-2 block">What We Do</span>
            <h2 className="text-3xl md:text-4xl font-display text-gray-900 dark:text-white mb-6">Our Services</h2>
            <p className="text-gray-600 dark:text-gray-400">Tailored packages designed to meet the specific needs of your vehicle.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MotionCard className="group bg-background-light dark:bg-background-dark p-8 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300">
              <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <span className="material-icons" aria-hidden="true">cleaning_services</span>
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3">Interior Detailing</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                Deep cleaning, leather conditioning, stain removal, and sanitization to make your interior feel brand new.
              </p>
              <Link className="inline-flex items-center text-sm font-semibold uppercase tracking-wider border-b border-gray-300 hover:border-primary dark:hover:border-white pb-1 transition-colors" href="/packages">
                Learn More <span className="material-icons text-sm ml-1" aria-hidden="true">arrow_forward</span>
              </Link>
            </MotionCard>
            <MotionCard className="group bg-background-light dark:bg-background-dark p-8 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 relative">
              <div className="absolute top-0 right-0 bg-primary text-white text-[10px] uppercase font-bold px-3 py-1">Popular</div>
              <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <span className="material-icons" aria-hidden="true">water_drop</span>
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3">Exterior Polish</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                Multi-stage wash, clay bar treatment, machine polishing, and premium wax application for a mirror finish.
              </p>
              <Link className="inline-flex items-center text-sm font-semibold uppercase tracking-wider border-b border-gray-300 hover:border-primary dark:hover:border-white pb-1 transition-colors" href="/packages">
                Learn More <span className="material-icons text-sm ml-1" aria-hidden="true">arrow_forward</span>
              </Link>
            </MotionCard>
            <MotionCard className="group bg-background-light dark:bg-background-dark p-8 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300">
              <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <span className="material-icons" aria-hidden="true">shield</span>
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3">Ceramic Coating</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                Long-term paint protection that repels water, dirt, and UV rays while enhancing gloss and depth.
              </p>
              <Link className="inline-flex items-center text-sm font-semibold uppercase tracking-wider border-b border-gray-300 hover:border-primary dark:hover:border-white pb-1 transition-colors" href="/packages">
                Learn More <span className="material-icons text-sm ml-1" aria-hidden="true">arrow_forward</span>
              </Link>
            </MotionCard>
          </div>
        </div>
      </section>

      <MotionSection className="relative py-24 md:py-32">
        <div className="absolute inset-0 z-0">
          <Image
            alt="Luxury car detail showcase"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3PZ5OMiAEDMPt6KjmZXnKxTlwbRQd-uiyufHBZOYQ1T_C13IQU_zcAiDNe7Lxzc-BRvG4F8OO-E5jvGaCERwvBVVSlhHPbnyAzw5B7B490NgMWeLZz1O82pC9I7AgZg5ppUhIUDwoTTzJ8yXozDrLIaBlOAPvH--GBtV6ctkCGkjZQMQzZ1IL8O8ynaB2sVZpGoSBjyHS_wntXjroc6ntvlf_hlqcTtgYUk9z35NDvETJs1GsT8hrDIggqT9bL_BtAQCZRxlnSg"
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-5xl font-display text-white mb-8 leading-tight">
            &quot;We don&apos;t just wash cars. We restore memories.&quot;
          </h2>
          <Link className="inline-block px-10 py-4 bg-white text-black font-semibold uppercase tracking-widest hover:bg-gray-200 transition-colors" href="/packages">
            Book An Appointment
          </Link>
        </div>
      </MotionSection>

      <MotionSection className="py-20 bg-background-light dark:bg-background-dark" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-display text-gray-900 dark:text-white mb-6">Visit Northside</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Stop by specifically for a consultation or book online for immediate service.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-4">Location</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    1234 Automotive Blvd<br />
                    Northside District<br />
                    Metropolis, ST 56789
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-4">Contact</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    <a className="hover:text-primary dark:hover:text-white transition-colors" href="mailto:info@northsidegarage.com">info@northsidegarage.com</a><br />
                    <a className="hover:text-primary dark:hover:text-white transition-colors" href="tel:+15551234567">(555) 123-4567</a>
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-4">Operating Hours</h4>
                <div className="flex justify-between max-w-xs text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-2 mb-2">
                  <span>Mon - Fri</span>
                  <span>8:00am - 8:00pm</span>
                </div>
                <div className="flex justify-between max-w-xs text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-2 mb-2">
                  <span>Saturday</span>
                  <span>9:00am - 6:00pm</span>
                </div>
                <div className="flex justify-between max-w-xs text-gray-600 dark:text-gray-400 pb-2">
                  <span>Sunday</span>
                  <span>10:00am - 4:00pm</span>
                </div>
              </div>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-8 md:p-10 shadow-lg border border-gray-100 dark:border-gray-800">
              <h3 className="text-2xl font-display text-gray-900 dark:text-white mb-6">Send an Inquiry</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </MotionSection>
    </>
  )
}
