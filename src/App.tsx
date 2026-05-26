import {
  ArrowRight,
  BadgeCheck,
  Camera,
  ChevronRight,
  CircleHelp,
  HandHeart,
  HeartPulse,
  MapPin,
  Menu,
  MoveRight,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import './App.css'

const contact = {
  phoneDisplay: '0816-268-265',
  whatsapp: 'https://wa.me/62816268265?text=Halo%20Langkah%20Asa%2C%20saya%20ingin%20konsultasi%20alat%20ortotik%20atau%20prostetik.',
  instagram: 'https://www.instagram.com/prosthetic.care/',
  instagramLabel: '@prosthetic.care',
}

const navItems = [
  { label: 'Filosofi', href: '#filosofi' },
  { label: 'Keunggulan', href: '#keunggulan' },
  { label: 'Produk', href: '#produk' },
  { label: 'Jangkauan', href: '#jangkauan' },
]

const stats = [
  { value: '17+', label: 'tahun referensi pengalaman layanan' },
  { value: '20+', label: 'jenis alat ortotik dan prostetik' },
  { value: '3', label: 'titik layanan utama' },
]

const philosophy = [
  'Setiap alat dibuat untuk membantu pengguna bergerak kembali dengan aman, nyaman, dan percaya diri.',
  'Pendekatan kami menempatkan kebutuhan pasien sebagai pusat desain, mulai dari asesmen, pengukuran, pembuatan, fitting, sampai penyesuaian akhir.',
  'Material, bentuk, dan fungsi disesuaikan dengan kondisi tubuh serta aktivitas harian agar alat terasa sebagai bagian dari rutinitas, bukan sekadar bantuan sementara.',
]

const reasons = [
  {
    icon: HandHeart,
    title: 'Melayani dengan empati',
    text: 'Konsultasi diarahkan untuk memahami kondisi, kebiasaan bergerak, dan target aktivitas pasien.',
  },
  {
    icon: BadgeCheck,
    title: 'Custom sesuai kebutuhan',
    text: 'Setiap orthosis dan prosthesis dibuat berdasarkan ukuran, indikasi, serta kenyamanan pengguna.',
  },
  {
    icon: Stethoscope,
    title: 'Dikerjakan tenaga berpengalaman',
    text: 'Proses pembuatan mengikuti praktik ortotik prostetik yang rapi, terukur, dan fungsional.',
  },
  {
    icon: ShieldCheck,
    title: 'Fokus pada fungsi dan keamanan',
    text: 'Desain mempertimbangkan stabilitas, alignment, support, dan kemudahan penggunaan harian.',
  },
  {
    icon: Users,
    title: 'Pendampingan pasien',
    text: 'Pasien dibantu dari konsultasi awal, fitting, edukasi pemakaian, sampai penyesuaian alat.',
  },
  {
    icon: MapPin,
    title: 'Jangkauan luas',
    text: 'Melayani kebutuhan dari Solo, Magelang, Medan, dan pasien dari berbagai wilayah Indonesia.',
  },
]

const orthosisProducts = [
  {
    name: 'Dynamic Ankle Foot Orthosis',
    short: 'AFO dengan sistem persendian untuk stabilitas berjalan dan gerak ankle yang lebih natural.',
    price: 'Mulai Rp400.000',
    indications: ['Foot drop', 'Toe walking', 'Cerebral palsy', 'Gait abnormality'],
    image: '/assets/hero-afo.jpg',
  },
  {
    name: 'Static Ankle Foot Orthosis',
    short: 'AFO kaku untuk menjaga posisi sendi, membatasi gerakan tertentu, dan membantu keseimbangan.',
    price: 'Mulai Rp350.000',
    indications: ['Kelemahan ankle', 'Instabilitas ankle', 'Rehabilitasi ortopedi'],
    image: '/assets/hero-afo.jpg',
  },
  {
    name: 'Scoliosis Brace',
    short: 'Brace ergonomis untuk membantu mengontrol kelengkungan tulang belakang pada scoliosis.',
    price: 'Mulai Rp3.500.000',
    indications: ['Scoliosis', 'Kontrol postur', 'Terapi sesuai anjuran dokter'],
    image: '/assets/prosthetic-hand.jpg',
  },
  {
    name: 'Korset & TLSO',
    short: 'Penyangga punggung, pinggang, dan tulang belakang untuk stabilitas serta pembatasan gerak.',
    price: 'Mulai Rp150.000',
    indications: ['Low back pain', 'HNP', 'Pasca operasi', 'Fraktur vertebra'],
    image: '/assets/prosthetic-hand.jpg',
  },
  {
    name: 'Dennis Brown Orthosis',
    short: 'Alat bantu terapi posisi kaki anak untuk clubfoot, toe walking, dan gangguan alignment.',
    price: 'Mulai Rp900.000',
    indications: ['Clubfoot', 'In-toeing', 'Out-toeing', 'Gangguan postur kaki'],
    image: '/assets/hero-afo.jpg',
  },
  {
    name: 'Orthopedic Shoes',
    short: 'Sepatu koreksi untuk mendukung posisi kaki, pola berjalan, dan kebutuhan biomekanik.',
    price: 'Mulai Rp900.000',
    indications: ['Flat foot', 'Perbedaan panjang tungkai', 'Deformitas kaki'],
    image: '/assets/kaki-prostetik.jpg',
  },
]

const prosthesisProducts = [
  {
    name: 'Kaki Palsu Bawah Lutut',
    short: 'Prosthesis untuk amputasi bawah lutut dengan pilihan eksoskeletal dan endoskeletal.',
    price: 'Mulai Rp3.000.000',
    indications: ['Amputasi transtibial', 'Trauma', 'Komplikasi diabetes'],
    image: '/assets/kaki-prostetik.jpg',
  },
  {
    name: 'Kaki Palsu Atas Lutut',
    short: 'Prosthesis tungkai atas lutut dengan socket, pylon, sendi lutut, dan telapak prostetik.',
    price: 'Mulai Rp7.000.000',
    indications: ['Amputasi transfemoral', 'Kehilangan fungsi tungkai', 'Trauma'],
    image: '/assets/kaki-prostetik.jpg',
  },
  {
    name: 'Tangan Palsu',
    short: 'Prosthesis tangan untuk membantu aktivitas sehari-hari, kemampuan menggenggam, dan tampilan kosmetik.',
    price: 'Mulai Rp5.000.000',
    indications: ['Amputasi tangan', 'Trauma', 'Kelainan bawaan'],
    image: '/assets/prosthetic-hand.jpg',
  },
  {
    name: 'Jari Palsu',
    short: 'Prosthetic finger untuk fungsi tangan dasar, kosmetik, dan rasa percaya diri pengguna.',
    price: 'Mulai Rp1.000.000',
    indications: ['Amputasi jari', 'Cedera berat', 'Kelainan bawaan jari'],
    image: '/assets/jari-prostetik.jpg',
  },
]

const serviceAreas = [
  'Solo Raya',
  'Magelang',
  'Medan',
  'Jawa Tengah',
  'Yogyakarta',
  'Jabodetabek',
  'Pengiriman nasional',
  'Kunjungan pasien terjadwal',
]

const processSteps = [
  'Konsultasi kebutuhan dan indikasi',
  'Pengukuran dan asesmen kondisi tubuh',
  'Pembuatan alat custom',
  'Fitting, edukasi, dan penyesuaian',
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState<'orthosis' | 'prosthesis'>('orthosis')

  const productList = activeProduct === 'orthosis' ? orthosisProducts : prosthesisProducts

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="Langkah Asa home">
          <img src="/assets/logo-white.png" alt="Langkah Asa Orthotic Prosthetic" />
        </a>
        <nav className={menuOpen ? 'site-nav open' : 'site-nav'} aria-label="Navigasi utama">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="icon-link" href={contact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram Langkah Asa">
            <Camera size={18} />
          </a>
          <a className="primary-action" href={contact.whatsapp} target="_blank" rel="noreferrer">
            <PhoneCall size={18} />
            Konsultasi
          </a>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Buka menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-bg" />
          <div className="hero-content">
            <p className="eyebrow">Orthotic Prosthetic Care</p>
            <h1 id="hero-title">Langkah Asa</h1>
            <p className="hero-copy">
              Pembuatan alat ortotik dan prostetik custom untuk membantu pengguna kembali bergerak, beraktivitas, dan menjalani hari dengan lebih percaya diri.
            </p>
            <div className="hero-actions">
              <a className="hero-cta" href={contact.whatsapp} target="_blank" rel="noreferrer">
                <PhoneCall size={19} />
                Chat WhatsApp
              </a>
              <a className="secondary-cta" href="#produk">
                Lihat alat yang dibuat
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
          <div className="hero-panel" aria-label="Ringkasan Langkah Asa">
            <img src="/assets/logo-white.png" alt="" />
            <div>
              <strong>Custom made support</strong>
              <span>Orthosis, prosthesis, fitting, dan pendampingan pasien.</span>
            </div>
          </div>
        </section>

        <section className="stats-strip" aria-label="Ringkasan layanan">
          {stats.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
          <a href={contact.whatsapp} target="_blank" rel="noreferrer">
            Jadwalkan konsultasi <ChevronRight size={18} />
          </a>
        </section>

        <section className="section philosophy-section" id="filosofi">
          <div className="section-kicker">
            <Sparkles size={18} />
            Filosofi brand
          </div>
          <div className="section-grid">
            <div>
              <h2>Alat bantu yang dirancang dari kebutuhan tubuh, bukan dari katalog semata.</h2>
            </div>
            <div className="philosophy-copy">
              {philosophy.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="section why-section" id="keunggulan">
          <div className="section-heading">
            <div>
              <div className="section-kicker">
                <HeartPulse size={18} />
                Kenapa memilih kami
              </div>
              <h2>Proses rapi dari konsultasi sampai fitting.</h2>
            </div>
            <p>
              Langkah Asa menggabungkan pendekatan personal, pengukuran teliti, dan pembuatan alat yang menyesuaikan kondisi pasien.
            </p>
          </div>
          <div className="reason-grid">
            {reasons.map((reason) => {
              const Icon = reason.icon
              return (
                <article className="reason-card" key={reason.title}>
                  <Icon size={24} />
                  <h3>{reason.title}</h3>
                  <p>{reason.text}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="section product-section" id="produk">
          <div className="section-heading">
            <div>
              <div className="section-kicker">
                <Stethoscope size={18} />
                Alat yang telah dibuat
              </div>
              <h2>Produk ortotik dan prostetik untuk kebutuhan harian.</h2>
            </div>
            <div className="product-tabs" role="tablist" aria-label="Jenis produk">
              <button
                className={activeProduct === 'orthosis' ? 'active' : ''}
                type="button"
                onClick={() => setActiveProduct('orthosis')}
              >
                Orthosis
              </button>
              <button
                className={activeProduct === 'prosthesis' ? 'active' : ''}
                type="button"
                onClick={() => setActiveProduct('prosthesis')}
              >
                Prosthesis
              </button>
            </div>
          </div>
          <div className="product-grid">
            {productList.map((product) => (
              <article className="product-card" key={product.name}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-body">
                  <div>
                    <span>{product.price}</span>
                    <h3>{product.name}</h3>
                    <p>{product.short}</p>
                  </div>
                  <ul>
                    {product.indications.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section coverage-section" id="jangkauan">
          <div className="coverage-map">
            <div className="map-pulse solo">Solo</div>
            <div className="map-pulse magelang">Magelang</div>
            <div className="map-pulse medan">Medan</div>
          </div>
          <div className="coverage-content">
            <div className="section-kicker">
              <MapPin size={18} />
              Area jangkauan
            </div>
            <h2>Konsultasi dan layanan untuk pasien dari berbagai wilayah Indonesia.</h2>
            <p>
              Titik layanan utama berada di Solo, Magelang, dan Medan. Untuk kebutuhan tertentu, tim dapat membantu alur konsultasi jarak jauh, rujukan, pengiriman alat, atau kunjungan pasien terjadwal.
            </p>
            <div className="area-tags">
              {serviceAreas.map((area) => (
                <span key={area}>{area}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="section process-section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">
                <CircleHelp size={18} />
                Alur pemesanan
              </div>
              <h2>Empat langkah sebelum alat siap digunakan.</h2>
            </div>
            <p>Alur dibuat jelas agar pasien tahu apa yang akan dilakukan sejak awal konsultasi.</p>
          </div>
          <div className="process-line">
            {processSteps.map((step, index) => (
              <div className="process-step" key={step}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div>
            <p className="eyebrow">CTA WhatsApp & Instagram</p>
            <h2>Mulai dari konsultasi singkat tentang kondisi dan alat yang dibutuhkan.</h2>
          </div>
          <div className="cta-actions">
            <a className="hero-cta" href={contact.whatsapp} target="_blank" rel="noreferrer">
              <PhoneCall size={19} />
              WhatsApp {contact.phoneDisplay}
            </a>
            <a className="secondary-cta light" href={contact.instagram} target="_blank" rel="noreferrer">
              <Camera size={18} />
              {contact.instagramLabel}
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <img src="/assets/logo-white.png" alt="Langkah Asa Orthotic Prosthetic" />
        <p>Orthotic prosthetic custom care untuk mobilitas yang lebih aman, nyaman, dan percaya diri.</p>
        <a href={contact.whatsapp} target="_blank" rel="noreferrer">
          Konsultasi sekarang <MoveRight size={18} />
        </a>
      </footer>

      <a className="floating-whatsapp" href={contact.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat WhatsApp">
        <PhoneCall size={22} />
      </a>
    </div>
  )
}

export default App
