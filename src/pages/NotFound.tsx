import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-lg w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-8 inline-block"
                >
                    <div className="absolute inset-0 bg-emerald-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-white p-6 rounded-full shadow-xl border border-emerald-50">
                        <AlertCircle className="w-24 h-24 text-emerald-500" strokeWidth={1.5} />
                    </div>

                    {/* Floating elements animation */}
                    <motion.div
                        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute -top-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg"
                    >
                        <Search className="w-6 h-6" />
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Oops! The page you're looking for seems to have wandered off. It might have been moved, deleted, or never existed.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transform hover:-translate-y-0.5"
                        >
                            <Home className="w-5 h-5" />
                            Go Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 hover:text-emerald-600 transition-colors shadow-sm hover:shadow-md"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </button>
                    </div>
                </motion.div>

                {/* Decorative background elements */}
                <div className="fixed top-1/4 left-10 w-64 h-64 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10 animate-blob"></div>
                <div className="fixed bottom-1/4 right-10 w-64 h-64 bg-teal-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10 animate-blob animation-delay-2000"></div>
            </div>
        </div>
    );
};

export default NotFound;
