"use client";

import { useState, useEffect, useTransition } from "react";
import { getBooks } from "@/lib/action";

import Link from "next/link";
import {
  BookOpen,
  Users,
  Lightbulb,
  Clock,
  Mail,
  Phone,
  MapPin,
  Search,
  TrendingUp,
  Award,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

export default function Landing() {
  const [books, setBooks] = useState([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getBooks();
      setBooks(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Taruna Library
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#about"
                className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
              >
                About
              </a>
              <a
                href="#services"
                className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
              >
                Services
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
              >
                Contact
              </a>
              <Link href="/login">
                <button className="bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 shadow-lg shadow-indigo-500/30">
                  Login
                </button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                <span className="text-sm font-medium text-indigo-600">
                  Open Now - Visit Us Today
                </span>
              </div>

              <h2 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                Your Gateway to
                <span className="block bg-linear-to-r from-indigo-600 via-blue-600 bg-clip-text text-transparent">
                  Endless Knowledge
                </span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed">
                Discover thousands of books, digital resources, and a vibrant
                learning community. Your journey to academic excellence starts
                here.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <button className="group bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2">
                    Browse Books
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="group bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-8 rounded-2xl border-2 border-gray-200 transition-all duration-300 flex items-center justify-center gap-2">
                    <Search className="w-5 h-5" />
                    Search Catalog
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">100+</div>
                  <div className="text-sm text-gray-600">Books Available</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">100+</div>
                  <div className="text-sm text-gray-600">Active Members</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Digital Access</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[650px] w-full">
                <Image
                  width={1080}
                  height={720}
                  src="/Library-1.jpg"
                  alt="Library Interior"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Books Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Books
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Explore our handpicked selection of must-read titles
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {books.slice(0, 4).map((book) => (
              <div key={book.book_id} className="group cursor-pointer">
                <div className="relative rounded-2xl overflow-hidden shadow-lg mb-4 transform group-hover:scale-105 transition-all duration-300">
                  <Image
                    width={1080}
                    height={720}
                    src={book.image || "/api/placeholder/300/400"}
                    alt={book.name}
                    className="w-full h-full object-cover max-h-[400px]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <Link href="/login">
                        <button className="w-full bg-white text-gray-900 font-semibold py-2 px-4 rounded-lg">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-1">
                  {book.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {book.author || "Unknown Author"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        id="about"
        className="py-20 bg-linear-to-br from-indigo-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Library?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Experience world-class facilities and resources designed for your
              success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">
                Extensive Collection
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Access over 10            0 books, journals, and digital resources
                spanning all subjects and academic levels.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">
                Modern Facilities
              </h4>
              <p className="text-gray-600 leading-relaxed">
                State-of-the-art study spaces, computer labs, and quiet zones
                optimized for focused learning.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">
                Expert Staff
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Dedicated librarians and educators ready to guide your research
                and learning journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Comprehensive support for the entire school community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Book Lending",
                desc: "Borrow books for up to 2 weeks with easy online renewal options.",
                icon: BookOpen,
              },
              {
                title: "Research Help",
                desc: "Expert assistance for research projects and academic assignments.",
                icon: Search,
              },
              {
                title: "Digital Access",
                desc: "24/7 access to online databases, e-books, and learning platforms.",
                icon: TrendingUp,
              },
              {
                title: "Study Spaces",
                desc: "Reserve private rooms for group study and collaborative projects.",
                icon: Users,
              },
            ].map((service, i) => (
              <div
                key={i}
                className="group bg-linear-to-br from-gray-50 to-gray-100 p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                <service.icon className="w-10 h-10 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h4>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div
        id="contact"
        className="py-20 bg-linear-to-br from-indigo-600 to-blue-600 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Visit Us Today</h3>
            <p className="text-indigo-100 max-w-2xl mx-auto text-lg">
              Located in the 3rd floor of school - your next discovery awaits
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6" />
                <h4 className="text-2xl font-bold">Library Hours</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <span className="font-medium">Monday - Friday</span>
                  <span>8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <span className="font-medium">Saturday</span>
                  <span>9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6" />
                <h4 className="text-2xl font-bold">Get In Touch</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-1 shrink-0" />
                  <div>
                    <div className="font-medium mb-1">Phone</div>
                    <div className="text-indigo-100">0811-9892-324</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-1 shrink-0" />
                  <div>
                    <div className="font-medium mb-1">Email</div>
                    <div className="text-indigo-100">
                      taruna@smktarunabhakti.net
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 shrink-0" />
                  <div>
                    <div className="font-medium mb-1">Address</div>
                    <div className="text-indigo-100">
                      Jl. Pekapuran, RT.02/RW.06, Curug, Kec. Cimanggis, Kota
                      Depok, Jawa Barat 16953
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Taruna Library</h1>
            </div>
            <p className="text-gray-400 mb-2">
              &copy; 2025 Taruna Library. All rights reserved.
            </p>
            <p className="text-gray-500">
              Empowering minds through knowledge and discovery.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
