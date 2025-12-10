import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-900 font-sans text-white overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* --- NAVBAR --- */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight">AyurCare</span>
          </div>
          <div className="flex gap-4">
            <Link to="/auth/login" className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-all font-medium text-sm backdrop-blur-sm">
              Login
            </Link>
            <Link to="/auth/register" className="px-6 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all hover:scale-105">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-slide-up">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-300 text-xs font-bold uppercase tracking-widest">The Future of Holistic Health</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight animate-slide-up" style={{ animationDelay: '100ms' }}>
            Balance Your Body,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Heal Your Soul.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
            Experience the ancient wisdom of Ayurveda combined with modern technology. Track your Doshas, manage diet plans, and consult with experts—all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <Link to="/auth/register" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full font-bold text-lg shadow-xl shadow-emerald-500/20 hover:scale-105 transition-transform flex items-center justify-center gap-2">
              Start Your Journey <span>→</span>
            </Link>
            <a href="#features" className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 px-6 bg-slate-900/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Why AyurCare?</h2>
            <p className="text-slate-400 max-w-xl mx-auto">We bring the clinic to your pocket. Seamlessly connect with dietitians and track your Ayurvedic lifestyle.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-emerald-500/30 transition-all hover:-translate-y-2 duration-300">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                🌿
              </div>
              <h3 className="text-xl font-bold mb-3">Dosha Analysis</h3>
              <p className="text-slate-400 leading-relaxed">
                Understand your unique body type (Vata, Pitta, Kapha) and get personalized lifestyle recommendations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-blue-500/30 transition-all hover:-translate-y-2 duration-300">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Tracking</h3>
              <p className="text-slate-400 leading-relaxed">
                Log your meals and visualize nutrient trends. Our AI helps you stay within your Ayurvedic guidelines.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-purple-500/30 transition-all hover:-translate-y-2 duration-300">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                👨‍⚕️
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Consultations</h3>
              <p className="text-slate-400 leading-relaxed">
                Book appointments with certified Ayurvedic dietitians seamlessly via secure video calls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h4 className="text-4xl md:text-5xl font-black text-emerald-400 mb-2">500+</h4>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Active Patients</p>
          </div>
          <div>
            <h4 className="text-4xl md:text-5xl font-black text-blue-400 mb-2">50+</h4>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Specialists</p>
          </div>
          <div>
            <h4 className="text-4xl md:text-5xl font-black text-purple-400 mb-2">12k</h4>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Meals Logged</p>
          </div>
          <div>
            <h4 className="text-4xl md:text-5xl font-black text-orange-400 mb-2">4.9</h4>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">User Rating</p>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-900 to-teal-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Ready to find your balance?</h2>
            <p className="text-emerald-200 text-lg mb-10 max-w-2xl mx-auto">Join thousands of others who have transformed their lives through Ayurvedic living.</p>
            <Link to="/auth/register" className="inline-block px-10 py-4 bg-white text-emerald-900 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-xl">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/10 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AyurCare Wellness Platform. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Landing;