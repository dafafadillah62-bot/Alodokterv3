import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MessageSquare, 
  Calendar, 
  ShoppingBag, 
  BookOpen, 
  Menu, 
  X, 
  User,
  Bell,
  Heart,
  ChevronRight,
  Stethoscope,
  Activity,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { GoogleGenAI } from "@google/genai";

// --- Components ---

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasKey, setHasKey] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSetupKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 py-4",
      isScrolled ? "glass shadow-soft py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Stethoscope size={24} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Alo<span className="text-primary">Dokter</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {['Beranda', 'Tanya Dokter', 'Rumah Sakit', 'Apotek', 'Artikel'].map((item) => (
            <a key={item} href="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {!hasKey && (
            <button 
              onClick={handleSetupKey}
              className="px-4 py-2 bg-amber-100 text-amber-700 text-xs font-bold rounded-full hover:bg-amber-200 transition-colors flex items-center gap-2"
            >
              <ShieldCheck size={14} /> Setup AI Key
            </button>
          )}
          <button className="p-2 text-slate-600 hover:text-primary transition-colors">
            <Bell size={20} />
          </button>
          <button className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            Masuk / Daftar
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-slate-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 p-6 md:hidden shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {['Beranda', 'Tanya Dokter', 'Rumah Sakit', 'Apotek', 'Artikel'].map((item) => (
                <a key={item} href="#" className="text-lg font-medium text-slate-900">
                  {item}
                </a>
              ))}
              <hr className="border-slate-100" />
              <button className="w-full py-3 bg-primary text-white font-bold rounded-xl">
                Masuk / Daftar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const CategoryCard = ({ icon: Icon, title, description, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-6 bg-white rounded-3xl shadow-soft border border-slate-100 flex flex-col gap-4 cursor-pointer group"
  >
    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
      <Icon size={28} />
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>
    </div>
    <div className="flex items-center text-primary text-sm font-bold mt-2">
      Mulai Sekarang <ChevronRight size={16} className="ml-1" />
    </div>
  </motion.div>
);

const ArticleCard = ({ image, category, title, date }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-3xl overflow-hidden shadow-soft border border-slate-100 group cursor-pointer"
  >
    <div className="aspect-video overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
    </div>
    <div className="p-6">
      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md">
        {category}
      </span>
      <h3 className="text-lg font-bold text-slate-900 mt-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
        {title}
      </h3>
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-slate-400">{date}</span>
        <button className="text-primary hover:underline text-xs font-bold">Baca Selengkapnya</button>
      </div>
    </div>
  </motion.div>
);

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Halo! Saya asisten AI AloDokter. Ada keluhan kesehatan yang ingin Anda tanyakan?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setNeedsKey(!hasKey && !process.env.GEMINI_API_KEY);
      }
    };
    checkKey();
  }, []);

  const handleSetupKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setNeedsKey(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (needsKey) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Mohon hubungkan API Key Anda terlebih dahulu untuk menggunakan fitur ini.' }]);
      return;
    }

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Create a new instance right before calling to ensure fresh key
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Anda adalah asisten medis profesional dari AloDokter. Berikan saran kesehatan yang membantu namun tetap ingatkan pengguna untuk berkonsultasi dengan dokter nyata jika gejala serius. Pertanyaan pengguna: ${input}`,
      });
      
      setMessages(prev => [...prev, { role: 'assistant', text: response.text || "Maaf, saya tidak bisa memproses permintaan Anda saat ini." }]);
    } catch (error: any) {
      console.error(error);
      if (error?.message?.includes("Requested entity was not found") || error?.message?.includes("API key not valid")) {
        setNeedsKey(true);
        setMessages(prev => [...prev, { role: 'assistant', text: "API Key tidak valid atau belum dikonfigurasi. Silakan klik tombol 'Setup AI Key'." }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: "Maaf, terjadi kesalahan koneksi." }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 bg-primary text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Activity size={20} />
          </div>
          <div>
            <h4 className="font-bold">AI Health Assistant</h4>
            <p className="text-[10px] opacity-80">Online • Siap membantu 24/7</p>
          </div>
        </div>
        {needsKey && (
          <button 
            onClick={handleSetupKey}
            className="px-3 py-1 bg-white text-primary text-[10px] font-bold rounded-full hover:bg-slate-100 transition-colors"
          >
            Setup Key
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
            msg.role === 'user' 
              ? "bg-primary text-white ml-auto rounded-tr-none" 
              : "bg-white text-slate-700 mr-auto rounded-tl-none border border-slate-100"
          )}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="bg-white text-slate-400 mr-auto p-4 rounded-2xl text-sm border border-slate-100 animate-pulse">
            Mengetik...
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Tulis keluhan Anda di sini..."
          className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-primary text-white p-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent rounded-bl-[200px]" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold mb-6">
              <ShieldCheck size={14} /> Terpercaya oleh 30jt+ Pengguna
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Kesehatan Anda, <br />
              <span className="text-primary">Prioritas Kami.</span>
            </h1>
            <p className="text-lg text-slate-500 mt-6 max-w-lg leading-relaxed">
              Konsultasi dokter, beli obat, dan cari rumah sakit pilihan dalam satu genggaman. Cepat, aman, dan terpercaya.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Cari dokter, obat, atau artikel..." 
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-lg shadow-slate-200/50 border-none focus:ring-2 focus:ring-primary outline-none text-sm"
                />
              </div>
              <button className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                Cari Sekarang
              </button>
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-white" referrerPolicy="no-referrer" />
                ))}
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                  +2k
                </div>
              </div>
              <p className="text-sm text-slate-400">
                <span className="text-slate-900 font-bold">500+ Dokter Spesialis</span> <br />
                Siap Melayani Anda
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070" 
                alt="Doctor" 
                className="w-full h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating Stats */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 z-20 glass p-5 rounded-3xl shadow-xl flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Detak Jantung</p>
                <p className="text-xl font-bold text-slate-900">72 BPM</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-10 -left-10 z-20 glass p-5 rounded-3xl shadow-xl flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                <Smartphone size={24} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Konsultasi</p>
                <p className="text-xl font-bold text-slate-900">Tersedia</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Layanan Kesehatan Lengkap</h2>
            <p className="text-slate-500 mt-4">Pilih layanan yang Anda butuhkan untuk menjaga kesehatan Anda dan keluarga.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CategoryCard 
              icon={MessageSquare} 
              title="Chat Dokter" 
              description="Tanya dokter spesialis secara online kapan saja."
              color="bg-primary"
            />
            <CategoryCard 
              icon={Calendar} 
              title="Buat Janji" 
              description="Booking jadwal periksa di rumah sakit pilihan."
              color="bg-secondary"
            />
            <CategoryCard 
              icon={ShoppingBag} 
              title="Toko Kesehatan" 
              description="Beli obat, vitamin, dan alat kesehatan lainnya."
              color="bg-accent"
            />
            <CategoryCard 
              icon={BookOpen} 
              title="Artikel" 
              description="Informasi kesehatan terpercaya dari para ahli."
              color="bg-slate-800"
            />
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-20 px-4 md:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary font-bold tracking-widest uppercase text-xs">Fitur Terbaru</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-4 leading-tight">
              Tanya Keluhan Anda <br />
              Kepada <span className="text-primary">AI Kami.</span>
            </h2>
            <p className="text-slate-500 mt-6 text-lg leading-relaxed">
              Dapatkan jawaban instan untuk pertanyaan kesehatan dasar Anda. Asisten AI kami dilatih untuk memberikan informasi medis awal yang akurat sebelum Anda berkonsultasi dengan dokter.
            </p>
            
            <div className="mt-10 space-y-6">
              {[
                { title: "Respon Instan", desc: "Tidak perlu menunggu antrean." },
                { title: "Tersedia 24 Jam", desc: "Siap membantu kapan saja dibutuhkan." },
                { title: "Privasi Terjamin", desc: "Data Anda aman dan terenkripsi." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                    <ShieldCheck size={14} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ChatAssistant />
          </motion.div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Artikel Kesehatan Terbaru</h2>
              <p className="text-slate-500 mt-2">Dapatkan info kesehatan terpercaya setiap harinya.</p>
            </div>
            <button className="hidden md:flex items-center text-primary font-bold hover:underline">
              Lihat Semua <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ArticleCard 
              image="https://images.unsplash.com/photo-1505751172107-573967a4dd2a?auto=format&fit=crop&q=80&w=1000"
              category="Kesehatan"
              title="7 Cara Menjaga Kesehatan Jantung di Usia Muda"
              date="22 Maret 2026"
            />
            <ArticleCard 
              image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000"
              category="Nutrisi"
              title="Makanan Super yang Wajib Dikonsumsi Setiap Hari"
              date="21 Maret 2026"
            />
            <ArticleCard 
              image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000"
              category="Gaya Hidup"
              title="Pentingnya Tidur 8 Jam untuk Produktivitas Kerja"
              date="20 Maret 2026"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                  <Stethoscope size={24} />
                </div>
                <span className="text-xl font-extrabold tracking-tight">
                  Alo<span className="text-primary">Dokter</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Platform kesehatan digital nomor satu di Indonesia. Kami berkomitmen memberikan akses kesehatan yang mudah dan terpercaya bagi seluruh masyarakat.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-6">Layanan</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Tanya Dokter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cari Rumah Sakit</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Apotek Online</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cek Kesehatan</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Perusahaan</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karir</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Download Aplikasi</h4>
              <div className="flex flex-col gap-4">
                <button className="flex items-center gap-3 bg-slate-800 p-3 rounded-xl hover:bg-slate-700 transition-colors">
                  <Smartphone size={24} />
                  <div className="text-left">
                    <p className="text-[10px] opacity-60">Get it on</p>
                    <p className="text-sm font-bold">Google Play</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-slate-800 p-3 rounded-xl hover:bg-slate-700 transition-colors">
                  <Smartphone size={24} />
                  <div className="text-left">
                    <p className="text-[10px] opacity-60">Download on the</p>
                    <p className="text-sm font-bold">App Store</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          <hr className="border-slate-800 mb-10" />
          
          <div className="flex flex-col md:row items-center justify-between gap-6 text-slate-500 text-xs">
            <p>© 2026 AloDokter Clone. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white">Facebook</a>
              <a href="#" className="hover:text-white">Instagram</a>
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
