import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export const Terms: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    return (
        <section className="min-h-screen pt-40 pb-24 px-6 md:px-12 bg-white text-black">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-6">Legal</p>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Terms of Service.</h1>
                    <p className="text-zinc-500 font-medium mb-16">Last updated: June 25, 2025</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="prose prose-lg prose-zinc max-w-none"
                >
                    <h3 className="text-2xl font-bold mb-4 mt-12">1. Agreement to Terms</h3>
                    <p className="text-zinc-600 mb-6 leading-relaxed">
                        These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Natwic Studio ("we," "us" or "our"), concerning your access to and use of the natwic.studio website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                    </p>

                    <h3 className="text-2xl font-bold mb-4 mt-12">2. Intellectual Property Rights</h3>
                    <p className="text-zinc-600 mb-6 leading-relaxed">
                        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                    </p>

                    <h3 className="text-2xl font-bold mb-4 mt-12">3. User Representations</h3>
                    <p className="text-zinc-600 mb-6 leading-relaxed">
                        By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Service.
                    </p>

                    <h3 className="text-2xl font-bold mb-4 mt-12">4. Governing Law</h3>
                    <p className="text-zinc-600 mb-6 leading-relaxed">
                        These Terms shall be governed by and defined following the laws of the United Kingdom. Natwic Studio and yourself irrevocably consent that the courts of the United Kingdom shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};