import Link from "next/link";

export default function Landing() {
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <h1 className="text-3xl font-bold text-indigo-600">School Library</h1>
                            </div>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <a href="#about" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">About</a>
                            <a href="#services" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Services</a>
                            <a href="#contact" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <div className="relative py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Welcome to Our
                            <span className="text-indigo-600 block">School Library</span>
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Discover a world of knowledge, creativity, and learning. Our library is your gateway to endless possibilities and academic excellence.
                        </p>
                        <Link href="/login">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
                                Browse Books
                            </button>
                            <button className="bg-white hover:bg-gray-50 text-indigo-600 font-bold py-3 px-8 rounded-lg border-2 border-indigo-600 transition duration-300">
                                Login
                            </button>
                        </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div id="about" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Library?</h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">We provide comprehensive resources and services to support your educational journey.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-lg bg-gray-50">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">Extensive Collection</h4>
                            <p className="text-gray-600">Thousands of books, journals, and digital resources covering all subjects and grade levels.</p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-gray-50">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">Modern Facilities</h4>
                            <p className="text-gray-600">State-of-the-art study areas, computer labs, and quiet reading spaces designed for optimal learning.</p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-gray-50">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">Expert Staff</h4>
                            <p className="text-gray-600">Our dedicated librarians and educators are here to help you find the perfect resources for your needs.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services */}
            <div id="services" className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive support for students, teachers, and the entire school community.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Book Lending</h4>
                            <p className="text-gray-600">Borrow books for up to 2 weeks with easy renewal options.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Research Assistance</h4>
                            <p className="text-gray-600">Get help with research projects and academic assignments.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Digital Resources</h4>
                            <p className="text-gray-600">Access online databases, e-books, and educational platforms.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Study Groups</h4>
                            <p className="text-gray-600">Reserve rooms for group study sessions and collaborative work.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact */}
            <div id="contact" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Visit Us</h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">We&apos;re located in the heart of the school campus. Come explore our collection and discover new worlds.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-4">Library Hours</h4>
                            <div className="space-y-2 text-gray-600">
                                <p><strong>Monday - Friday:</strong> 8:00 AM - 6:00 PM</p>
                                <p><strong>Saturday:</strong> 9:00 AM - 4:00 PM</p>
                                <p><strong>Sunday:</strong> Closed</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h4>
                            <div className="space-y-2 text-gray-600">
                                <p><strong>Phone:</strong> (555) 123-4567</p>
                                <p><strong>Email:</strong> library@school.edu</p>
                                <p><strong>Address:</strong> 123 Education Lane, Learning City, ST 12345</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p>&copy; 2025 School Library. All rights reserved.</p>
                        <p className="mt-2">Empowering minds through knowledge and discovery.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
