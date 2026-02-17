import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export const Privacy: React.FC = () => {
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
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Privacy Policy.</h1>
                    <p className="text-zinc-500 font-medium mb-16">Last updated: June 25, 2025</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="prose prose-lg prose-zinc max-w-none"
                >
                    <h3 className="text-2xl font-bold mb-4 mt-12">1. Introduction</h3>
                    <p className="text-zinc-600 mb-6 leading-relaxed">
                        Natwic Studio ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website natwic.studio, use our services, or engage with us.
                    </p>

                    <h3 className="text-2xl font-bold mb-4 mt-12">2. Information We Collect</h3>
                    <p className="text-zinc-600 mb-6 leading-relaxed">
                        We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                    </p>
                    <ul className="list-disc pl-5 mb-6 text-zinc-600 space-y-2">
                        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
                        <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                    </ul>

                    <h3 className="text-2xl font-bold mb-4 mt-12">3. Use of Your Information</h3>
                    <p className="text-zinc-600 mb-6 leading-relaxed">
                        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                    </p>
                    <ul className="list-disc pl-5 mb-6 text-zinc-600 space-y-2">
                        <li>Create and manage your account.</li>
                        <li>Email you regarding your account or order.</li>
                        <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                        <li>Generate a personal profile about you to make future visits to the Site more personalized.</li>
                    </ul>

                     <h3 className="text-2xl font-bold mb-4 mt-12">4. Contact Us</h3>
                    <p className="text-zinc-600 mb-6 leading-relaxed">
                        If you have questions or comments about this Privacy Policy, please contact us at: <br/><br/>
                        <strong>Natwic Studio</strong><br/>
                        124 Creative Boulevard, Suite 400<br/>
                        London, UK<br/>
                        hello@natwic.studio
                    </p>
                </motion.div>
            </div>
        </section>
    );
};