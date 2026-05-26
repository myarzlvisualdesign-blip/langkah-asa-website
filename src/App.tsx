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
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
import './App.css'

type ProductCategory = 'orthosis' | 'prosthesis'

type Product = {
  slug: string
  category: ProductCategory
  name: string
  label: string
  short: string
  description: string
  price: string
  image: string
  indications: string[]
  features: string[]
  madeFor: string[]
}

type HeroSlide = {
  title: string
  kicker: string
  text: string
  image: string
}

const siteUrl = 'https://langkah-asa-website.pages.dev'

function createWhatsappUrl(message: string) {
  return `https://wa.me/62816268265?text=${encodeURIComponent(message)}`
}

function productWhatsappUrl(product: Product) {
  return createWhatsappUrl(
    `Halo Langkah Asa, saya ingin konsultasi produk ${product.name}. Mohon bantu cek kecocokan alat, estimasi harga, dan proses pengukurannya.`,
  )
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.content = content
}

function usePageSeo(title: string, description: string, image = '/assets/hero-afo.jpg') {
  const location = useLocation()

  useEffect(() => {
    const canonicalUrl = `${siteUrl}${location.pathname}`
    const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }

    document.title = title
    canonical.href = canonicalUrl
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:image', imageUrl)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', imageUrl)
  }, [description, image, location.pathname, title])
}

const contact = {
  phoneDisplay: '0816-268-265',
  whatsapp: createWhatsappUrl('Halo Langkah Asa, saya ingin konsultasi alat ortotik atau prostetik.'),
  instagram: 'https://www.instagram.com/prosthetic.care/',
  instagramLabel: '@prosthetic.care',
}

const whatsappShortcuts = [
  {
    title: 'Konsultasi alat',
    text: 'Cocok untuk tanya rekomendasi orthosis atau prosthesis sesuai kondisi.',
    href: createWhatsappUrl('Halo Langkah Asa, saya ingin konsultasi alat yang cocok untuk kondisi saya.'),
  },
  {
    title: 'Cek estimasi harga',
    text: 'Kirim kebutuhan produk, ukuran, foto kondisi, dan target aktivitas.',
    href: createWhatsappUrl('Halo Langkah Asa, saya ingin cek estimasi harga alat ortotik/prostetik.'),
  },
  {
    title: 'Jadwal pengukuran',
    text: 'Untuk mengatur konsultasi lanjutan, fitting, atau pengukuran pasien.',
    href: createWhatsappUrl('Halo Langkah Asa, saya ingin membuat jadwal pengukuran atau fitting.'),
  },
]

const heroSlides: HeroSlide[] = [
  {
    title: 'Orthosis custom',
    kicker: 'AFO, brace, dan support tubuh',
    text: 'Dibuat mengikuti ukuran dan kebutuhan gerak pengguna.',
    image: '/assets/hero-afo.jpg',
  },
  {
    title: 'Prosthesis personal',
    kicker: 'Kaki, tangan, dan jari palsu',
    text: 'Fokus pada kenyamanan socket, alignment, dan mobilitas harian.',
    image: '/assets/kaki-prostetik.jpg',
  },
  {
    title: 'Spinal support',
    kicker: 'TLSO, scoliosis brace, dan korset',
    text: 'Stabilisasi tubuh dengan desain yang disesuaikan kondisi pasien.',
    image: '/assets/tlso.jpg',
  },
]

const navItems = [
  { label: 'Tentang', href: '/tentang' },
  { label: 'Produk', href: '/produk' },
  { label: 'Jangkauan', href: '/jangkauan' },
  { label: 'Kontak', href: '/kontak' },
]

const stats = [
  { value: '16', label: 'kategori produk dari katalog Drive' },
  { value: '2', label: 'lini utama orthosis dan prosthesis' },
  { value: '3+', label: 'area layanan utama dan nasional' },
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

const products: Product[] = [
  {
    slug: 'dynamic-ankle-foot-orthosis',
    category: 'orthosis',
    name: 'Dynamic Ankle Foot Orthosis',
    label: 'AFO dynamic',
    short: 'AFO dengan sistem persendian untuk stabilitas berjalan dan gerak ankle yang lebih natural.',
    description:
      'Dynamic AFO atau hinged AFO membantu menjaga alignment kaki dan ankle, namun tetap memberi ruang gerak yang lebih natural dibanding AFO statis. Alat ini disesuaikan dengan kondisi pasien dan pola jalan yang ingin dibantu.',
    price: 'Satu sisi mulai Rp400.000',
    image: '/assets/hero-afo.jpg',
    indications: ['Foot drop', 'Toe walking', 'Cerebral palsy', 'Gait abnormality'],
    features: ['Custom ukuran kaki', 'Sistem sendi ankle', 'Strap stabil', 'Fitting dan penyesuaian'],
    madeFor: ['Pasien anak dan dewasa', 'Latihan berjalan', 'Kebutuhan rehabilitasi neurologis dan ortopedi'],
  },
  {
    slug: 'static-ankle-foot-orthosis',
    category: 'orthosis',
    name: 'Static Ankle Foot Orthosis',
    label: 'AFO static',
    short: 'AFO kaku untuk menjaga posisi sendi, membatasi gerakan tertentu, dan membantu keseimbangan.',
    description:
      'Static AFO membantu mempertahankan posisi ankle dan kaki pada kondisi kelemahan otot, instabilitas, atau kebutuhan immobilisasi ringan. Bentuknya dibuat mengikuti kontur kaki pengguna.',
    price: 'Satu sisi mulai Rp350.000',
    image: '/assets/static-afo-support.svg',
    indications: ['Kelemahan ankle', 'Instabilitas ankle', 'Rehabilitasi ortopedi'],
    features: ['Desain rigid', 'Material ringan', 'Kontrol posisi kaki', 'Tali pengunci aman'],
    madeFor: ['Foot drop', 'Pasien pasca cedera tendon', 'Gangguan pola jalan'],
  },
  {
    slug: 'collar',
    category: 'orthosis',
    name: 'Collar',
    label: 'Cervical support',
    short: 'Penyangga leher untuk membantu stabilisasi area cervical sesuai kebutuhan terapi.',
    description:
      'Collar digunakan untuk membantu membatasi gerak leher dan memberi support pada area cervical. Pemilihan tipe collar mengikuti arahan pemeriksaan dan tingkat stabilisasi yang dibutuhkan.',
    price: 'Konsultasi harga',
    image: '/assets/collar-support.svg',
    indications: ['Nyeri leher', 'Cedera ringan cervical', 'Stabilisasi pasca terapi'],
    features: ['Pilihan support ringan sampai kuat', 'Ukuran menyesuaikan', 'Mudah dipakai', 'Edukasi pemakaian'],
    madeFor: ['Support harian', 'Pemulihan cedera', 'Kebutuhan pembatasan gerak leher'],
  },
  {
    slug: 'custom-sandal-diabetes',
    category: 'orthosis',
    name: 'Custom Sandal Diabetes',
    label: 'Sandal diabetes',
    short: 'Sandal custom untuk membantu kenyamanan telapak kaki dan mengurangi titik tekanan berlebih.',
    description:
      'Custom sandal diabetes dibuat untuk membantu distribusi tekanan pada telapak kaki dan mendukung kenyamanan pasien dengan kebutuhan khusus. Desain menyesuaikan bentuk kaki, area sensitif, serta aktivitas harian.',
    price: 'Konsultasi harga',
    image: '/assets/custom-sandal.jpg',
    indications: ['Diabetes', 'Kaki sensitif', 'Risiko tekanan berlebih'],
    features: ['Insole menyesuaikan', 'Upper lembut', 'Bukaan mudah', 'Sol nyaman untuk aktivitas harian'],
    madeFor: ['Pengguna diabetes', 'Kaki dengan area sensitif', 'Kebutuhan sandal terapeutik'],
  },
  {
    slug: 'dennis-brown-orthosis',
    category: 'orthosis',
    name: 'Dennis Brown Orthosis',
    label: 'Dennis Brown',
    short: 'Alat bantu terapi posisi kaki anak untuk clubfoot, toe walking, dan gangguan alignment.',
    description:
      'Dennis Brown Orthosis membantu mempertahankan posisi kaki anak dalam program terapi atau pasca koreksi. Sepatu dan bar disesuaikan agar stabil, aman, dan tetap nyaman digunakan.',
    price: 'Mulai Rp900.000',
    image: '/assets/dennis-brown.jpg',
    indications: ['Clubfoot', 'Toe walking', 'In-toeing', 'Out-toeing'],
    features: ['Bar penstabil', 'Sepatu koreksi', 'Tali dan buckle kuat', 'Ukuran anak'],
    madeFor: ['Anak dengan CTEV', 'Gangguan alignment kaki', 'Pendamping terapi tumbuh kembang'],
  },
  {
    slug: 'hand-splint',
    category: 'orthosis',
    name: 'Hand Splint',
    label: 'Upper limb orthosis',
    short: 'Splint tangan untuk menjaga posisi, memberi support, dan membantu kebutuhan terapi ekstremitas atas.',
    description:
      'Hand splint dirancang untuk membantu posisi tangan dan pergelangan, baik untuk support harian maupun kebutuhan terapi tertentu. Bentuk dan area support dibuat berdasarkan kondisi pasien.',
    price: 'Konsultasi harga',
    image: '/assets/hand-splint-support.svg',
    indications: ['Kontraktur', 'Kelemahan tangan', 'Support pergelangan', 'Pasca cedera'],
    features: ['Custom posisi tangan', 'Strap adjustable', 'Material ringan', 'Dapat dibuat sesuai indikasi'],
    madeFor: ['Pasien stroke', 'Cedera tangan', 'Kebutuhan rehabilitasi tangan'],
  },
  {
    slug: 'hkafo',
    category: 'orthosis',
    name: 'Hip Knee Ankle Foot Orthosis',
    label: 'HKAFO',
    short: 'Orthosis tungkai panjang untuk menopang area hip, knee, ankle, dan foot.',
    description:
      'HKAFO digunakan untuk menopang dan mengontrol posisi tungkai bawah sampai area hip. Alat ini membantu stabilitas berdiri dan berjalan pada pasien dengan kelemahan atau gangguan kontrol tungkai.',
    price: 'Satu sisi mulai Rp3.500.000',
    image: '/assets/hkafo.png',
    indications: ['Kelumpuhan tungkai bawah', 'Poliomyelitis', 'Stroke', 'Cerebral palsy'],
    features: ['Support hip-knee-ankle-foot', 'Joint dan lock sesuai kebutuhan', 'Strap kuat', 'Custom fitting'],
    madeFor: ['Gangguan kontrol tungkai', 'Kelemahan quadriceps', 'Pasca trauma tertentu'],
  },
  {
    slug: 'korset',
    category: 'orthosis',
    name: 'Korset',
    label: 'Lumbar support',
    short: 'Penyangga pinggang dan punggung untuk stabilitas, support postur, dan aktivitas harian.',
    description:
      'Korset memberi dukungan pada area pinggang dan punggung bawah. Produk dapat dibuat untuk support ringan, pembatasan gerak, atau kebutuhan pasca cedera sesuai pemeriksaan.',
    price: 'Mulai Rp150.000',
    image: '/assets/korset.jpg',
    indications: ['Low back pain', 'HNP', 'Cedera otot pinggang', 'Postur kurang baik'],
    features: ['Support lumbar', 'Strap elastis', 'Ukuran menyesuaikan', 'Nyaman dipakai harian'],
    madeFor: ['Aktivitas harian', 'Pemulihan pasca cedera', 'Support kerja atau mobilitas'],
  },
  {
    slug: 'orthopedic-shoes',
    category: 'orthosis',
    name: 'Orthopedic Shoes',
    label: 'Sepatu ortopedi',
    short: 'Sepatu koreksi untuk mendukung posisi kaki, pola berjalan, dan kebutuhan biomekanik.',
    description:
      'Orthopedic shoes dibuat untuk membantu koreksi posisi kaki, menopang struktur kaki, dan mendukung pola berjalan yang lebih baik. Desain menyesuaikan ukuran dan indikasi pengguna.',
    price: 'Mulai Rp900.000',
    image: '/assets/orthopedic-shoes.jpg',
    indications: ['Flat foot', 'Perbedaan panjang tungkai', 'Deformitas kaki'],
    features: ['Upper custom', 'Sol koreksi', 'Insole support', 'Material nyaman'],
    madeFor: ['Anak dan dewasa', 'Gangguan alignment kaki', 'Kebutuhan sepatu koreksi'],
  },
  {
    slug: 'scoliosis-brace',
    category: 'orthosis',
    name: 'Scoliosis Brace',
    label: 'Spinal orthosis',
    short: 'Brace ergonomis untuk membantu mengontrol kelengkungan tulang belakang pada scoliosis.',
    description:
      'Scoliosis brace dirancang berdasarkan bentuk tubuh pasien dan target koreksi yang direkomendasikan. Brace membantu menjaga postur serta mendukung program terapi scoliosis.',
    price: 'Mulai Rp3.500.000',
    image: '/assets/scoliosis.jpg',
    indications: ['Scoliosis', 'Kontrol postur', 'Terapi sesuai anjuran dokter'],
    features: ['Custom body mold', 'Pressure area terukur', 'Ventilasi dan bukaan', 'Fitting berkala'],
    madeFor: ['Pasien scoliosis', 'Program koreksi postur', 'Penggunaan harian sesuai arahan'],
  },
  {
    slug: 'tlso',
    category: 'orthosis',
    name: 'Thoracolumbosacral Orthosis',
    label: 'TLSO',
    short: 'Penyangga tulang belakang area thoracal, lumbar, dan sacral untuk stabilisasi tubuh.',
    description:
      'TLSO membantu menopang dan membatasi gerakan tulang belakang dari area dada sampai pinggang dan sakrum. Produk dapat dibuat sebagai body jacket atau semi rigid sesuai kebutuhan.',
    price: 'Mulai Rp2.000.000',
    image: '/assets/tlso.jpg',
    indications: ['Fraktur kompresi vertebra', 'Kyphosis', 'Pasca operasi tulang belakang'],
    features: ['Body jacket atau semi rigid', 'Custom ukuran torso', 'Bukaan aman', 'Support stabil'],
    madeFor: ['Cedera tulang belakang', 'Pemulihan pasca operasi', 'Stabilisasi torso'],
  },
  {
    slug: 'kaki-palsu-bawah-lutut',
    category: 'prosthesis',
    name: 'Kaki Palsu Bawah Lutut',
    label: 'Transtibial prosthesis',
    short: 'Prosthesis untuk amputasi bawah lutut dengan pilihan eksoskeletal dan endoskeletal.',
    description:
      'Kaki palsu bawah lutut dibuat untuk membantu pengguna kembali berjalan dengan socket yang nyaman, alignment tepat, dan komponen yang sesuai aktivitas. Pilihan desain menyesuaikan kondisi stump dan kebutuhan mobilitas.',
    price: 'Mulai Rp3.000.000',
    image: '/assets/kaki-bawah-lutut.jpg',
    indications: ['Amputasi transtibial', 'Trauma', 'Komplikasi diabetes'],
    features: ['Socket custom', 'Pylon dan foot prosthetic', 'Pilihan endoskeletal', 'Fitting dan alignment'],
    madeFor: ['Amputasi bawah lutut', 'Mobilitas harian', 'Rehabilitasi berjalan'],
  },
  {
    slug: 'kaki-palsu-atas-lutut',
    category: 'prosthesis',
    name: 'Kaki Palsu Atas Lutut',
    label: 'Transfemoral prosthesis',
    short: 'Prosthesis tungkai atas lutut dengan socket, pylon, sendi lutut, dan telapak prostetik.',
    description:
      'Kaki palsu atas lutut membutuhkan desain socket dan pemilihan sendi lutut yang tepat agar pengguna dapat berdiri dan berjalan lebih stabil. Proses fitting dilakukan bertahap mengikuti kemampuan pasien.',
    price: 'Mulai Rp7.000.000',
    image: '/assets/kaki-atas-lutut.jpg',
    indications: ['Amputasi transfemoral', 'Kehilangan fungsi tungkai', 'Trauma'],
    features: ['Socket custom', 'Sendi lutut prostetik', 'Pylon stabil', 'Foot prosthetic'],
    madeFor: ['Amputasi atas lutut', 'Latihan berjalan', 'Kebutuhan mobilitas bertahap'],
  },
  {
    slug: 'carbon-fiber-socket',
    category: 'prosthesis',
    name: 'Carbon Fiber Socket',
    label: 'Socket prostetik',
    short: 'Socket carbon fiber untuk prosthesis dengan struktur kuat, ringan, dan tampilan rapi.',
    description:
      'Carbon fiber socket digunakan untuk kebutuhan prosthesis yang membutuhkan struktur lebih kuat dan ringan. Pembuatan mengikuti ukuran stump dan kebutuhan pengguna agar tekanan lebih terdistribusi.',
    price: 'Konsultasi harga',
    image: '/assets/carbon-socket.jpg',
    indications: ['Socket transtibial', 'Kebutuhan ringan dan kuat', 'Upgrade komponen'],
    features: ['Material carbon fiber', 'Bobot ringan', 'Kekuatan tinggi', 'Finishing rapi'],
    madeFor: ['Pengguna aktif', 'Socket replacement', 'Kebutuhan prosthesis custom'],
  },
  {
    slug: 'tangan-palsu',
    category: 'prosthesis',
    name: 'Tangan Palsu',
    label: 'Upper limb prosthesis',
    short: 'Prosthesis tangan untuk membantu aktivitas sehari-hari, kemampuan menggenggam, dan tampilan kosmetik.',
    description:
      'Tangan palsu dibuat untuk menggantikan sebagian atau seluruh fungsi tangan yang hilang. Tujuannya membantu aktivitas dasar, tampilan kosmetik, dan rasa percaya diri pengguna.',
    price: 'Mulai Rp5.000.000',
    image: '/assets/tangan-prostetik.jpg',
    indications: ['Amputasi tangan', 'Trauma', 'Kelainan bawaan'],
    features: ['Desain kosmetik', 'Socket custom', 'Pilihan mekanisme sesuai kebutuhan', 'Fitting personal'],
    madeFor: ['Amputasi tangan atau lengan', 'Aktivitas sehari-hari', 'Kebutuhan kosmetik'],
  },
  {
    slug: 'jari-palsu',
    category: 'prosthesis',
    name: 'Jari Palsu',
    label: 'Prosthetic finger',
    short: 'Prosthetic finger untuk fungsi tangan dasar, kosmetik, dan rasa percaya diri pengguna.',
    description:
      'Jari palsu membantu menggantikan bentuk jari yang hilang akibat amputasi, trauma, kelainan bawaan, atau penyakit tertentu. Desain menyesuaikan ukuran dan tampilan tangan pengguna.',
    price: 'Mulai Rp1.000.000',
    image: '/assets/jari-prostetik.jpg',
    indications: ['Amputasi jari', 'Cedera berat', 'Kelainan bawaan jari'],
    features: ['Bentuk custom', 'Warna menyesuaikan', 'Material nyaman', 'Fitting detail'],
    madeFor: ['Kebutuhan kosmetik', 'Aktivitas ringan', 'Kepercayaan diri pengguna'],
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
  return (
    <BrowserRouter>
      <SiteLayout />
    </BrowserRouter>
  )
}

function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand-lockup" to="/" aria-label="Langkah Asa home">
          <img src="/assets/logo-white.png" alt="Langkah Asa Orthotic Prosthetic" />
        </Link>
        <nav className={menuOpen ? 'site-nav open' : 'site-nav'} aria-label="Navigasi utama">
          {navItems.map((item) => (
            <NavLink key={item.href} to={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </NavLink>
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

      <main>
        <Routes>
          <Route path="/" element={<HomePageContent />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="/kenapa-memilih-kami" element={<WhyPage />} />
          <Route path="/produk" element={<ProductsPage />} />
          <Route path="/produk/:slug" element={<ProductDetailPage />} />
          <Route path="/jangkauan" element={<CoveragePage />} />
          <Route path="/kontak" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <SiteFooter />

      <a className="floating-whatsapp" href={contact.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat WhatsApp">
        <PhoneCall size={22} />
        <span>Chat WA</span>
      </a>
    </div>
  )
}

function HomePageContent() {
  const featuredProducts = products.slice(0, 6)
  usePageSeo(
    'Langkah Asa Orthotic Prosthetic | Alat Ortotik dan Prostetik Custom',
    'Langkah Asa melayani konsultasi dan pembuatan orthosis serta prosthesis custom seperti AFO, brace, kaki palsu, tangan palsu, jari palsu, dan alat bantu mobilitas.',
  )

  return (
    <>
      <HeroSection />
      <StatsStrip />
      <PhilosophyPreview />
      <WhyPreview />
      <ProductPreview products={featuredProducts} />
      <CoveragePreview />
      <ProcessSection />
      <CtaSection />
    </>
  )
}

function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const slide = heroSlides[activeSlide]

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((index) => (index + 1) % heroSlides.length)
    }, 5600)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-slides" aria-hidden="true">
        {heroSlides.map((item, index) => (
          <img className={index === activeSlide ? 'active' : ''} src={item.image} alt="" fetchPriority={index === 0 ? 'high' : 'auto'} key={item.title} />
        ))}
      </div>
      <div className="hero-content">
        <p className="eyebrow">Orthotic Prosthetic Care</p>
        <h1 id="hero-title">Langkah Asa</h1>
        <p className="hero-copy">
          Pembuatan alat ortotik dan prostetik custom untuk membantu pengguna kembali bergerak, beraktivitas, dan menjalani hari dengan lebih percaya diri.
        </p>
        <div className="hero-actions">
          <a className="hero-cta" href={contact.whatsapp} target="_blank" rel="noreferrer">
            <PhoneCall size={19} />
            Konsultasi via WhatsApp
          </a>
          <Link className="secondary-cta" to="/produk">
            Lihat semua produk
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
      <div className="hero-panel" aria-live="polite" aria-label="Sorotan produk">
        <div>
          <small>{slide.kicker}</small>
          <strong>{slide.title}</strong>
          <span>{slide.text}</span>
        </div>
        <div className="hero-dots" aria-label="Kontrol slider hero">
          {heroSlides.map((item, index) => (
            <button
              className={index === activeSlide ? 'active' : ''}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Tampilkan ${item.title}`}
              key={item.title}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsStrip() {
  return (
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
  )
}

function PhilosophyPreview() {
  return (
    <section className="section philosophy-section">
      <div className="section-kicker">
        <Sparkles size={18} />
        Filosofi brand
      </div>
      <div className="section-grid">
        <div>
          <h2>Alat bantu yang dirancang dari kebutuhan tubuh, bukan dari katalog semata.</h2>
          <Link className="text-link" to="/tentang">
            Baca filosofi lengkap <ArrowRight size={17} />
          </Link>
        </div>
        <div className="philosophy-copy">
          {philosophy.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyPreview() {
  return (
    <section className="section why-section">
      <SectionHeading
        icon={<HeartPulse size={18} />}
        kicker="Kenapa memilih kami"
        title="Proses rapi dari konsultasi sampai fitting."
        text="Langkah Asa menggabungkan pendekatan personal, pengukuran teliti, dan pembuatan alat yang menyesuaikan kondisi pasien."
      />
      <ReasonGrid />
    </section>
  )
}

function ProductPreview({ products: items }: { products: Product[] }) {
  return (
    <section className="section product-section">
      <SectionHeading
        icon={<Stethoscope size={18} />}
        kicker="Alat yang telah dibuat"
        title="Produk ortotik dan prostetik untuk kebutuhan harian."
        text="Katalog disusun dari folder Drive dan katalog produk Langkah Asa."
      />
      <ProductGrid products={items} />
      <div className="center-action">
        <Link className="outline-action" to="/produk">
          Lihat katalog lengkap <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  )
}

function CoveragePreview() {
  return (
    <section className="section coverage-section">
      <CoverageMap />
      <CoverageCopy />
    </section>
  )
}

function AboutPage() {
  usePageSeo(
    'Tentang Langkah Asa | Filosofi Orthotic Prosthetic Care',
    'Kenali filosofi Langkah Asa dalam merancang alat ortotik dan prostetik custom yang personal, nyaman, dan mendukung mobilitas pengguna.',
    '/assets/logo-full.png',
  )

  return (
    <>
      <PageHero
        kicker="Tentang kami"
        title="Langkah Asa membantu pengguna menemukan alat bantu yang benar-benar sesuai kondisi tubuh."
        text="Brand ini dibangun dari keyakinan bahwa mobilitas bukan sekadar bergerak, tetapi kemampuan untuk kembali menjalani rutinitas dengan aman, nyaman, dan percaya diri."
      />
      <section className="section page-split">
        <div>
          <div className="section-kicker">
            <Sparkles size={18} />
            Filosofi brand
          </div>
          <h2>Setiap langkah punya cerita, setiap alat perlu dirancang personal.</h2>
        </div>
        <div className="rich-copy">
          {philosophy.map((item) => (
            <p key={item}>{item}</p>
          ))}
          <p>
            Karena itu, komunikasi awal, pengukuran, fitting, dan evaluasi pemakaian menjadi bagian penting dari layanan, bukan hanya proses produksi.
          </p>
        </div>
      </section>
      <WhyPreview />
      <ProcessSection />
      <CtaSection />
    </>
  )
}

function WhyPage() {
  usePageSeo(
    'Kenapa Memilih Langkah Asa | Orthosis dan Prosthesis Custom',
    'Alasan memilih Langkah Asa: konsultasi empatik, alat custom, proses pengukuran rapi, fitting personal, dan pendampingan pasien.',
    '/assets/hkafo.png',
  )

  return (
    <>
      <PageHero
        kicker="Kenapa memilih kami"
        title="Pendampingan rapi untuk kebutuhan ortotik dan prostetik custom."
        text="Halaman ini merangkum alasan utama memilih Langkah Asa: pendekatan empatik, produk custom, tenaga berpengalaman, dan layanan yang siap mendampingi proses pasien."
      />
      <section className="section why-section no-top-padding">
        <ReasonGrid />
      </section>
      <ProcessSection />
      <CtaSection />
    </>
  )
}

function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | ProductCategory>('all')
  usePageSeo(
    'Katalog Produk Langkah Asa | Orthosis dan Prosthesis',
    'Lihat katalog produk Langkah Asa: AFO, HKAFO, korset, scoliosis brace, TLSO, sepatu ortopedi, kaki palsu, tangan palsu, jari palsu, dan socket prostetik.',
    '/assets/hkafo.png',
  )
  const visibleProducts = useMemo(
    () => (activeCategory === 'all' ? products : products.filter((product) => product.category === activeCategory)),
    [activeCategory],
  )

  return (
    <>
      <PageHero
        kicker="Katalog produk"
        title="Katalog orthosis dan prosthesis lengkap dari aset Drive Langkah Asa."
        text="Setiap produk punya halaman detail masing-masing agar calon pasien bisa melihat fungsi, indikasi, fitur, dan CTA konsultasi secara spesifik."
      />
      <section className="section product-section no-top-padding">
        <div className="catalog-toolbar">
          <div>
            <strong>{visibleProducts.length}</strong>
            <span>produk ditampilkan</span>
          </div>
          <div className="product-tabs" role="tablist" aria-label="Filter produk">
            <button className={activeCategory === 'all' ? 'active' : ''} type="button" onClick={() => setActiveCategory('all')}>
              Semua
            </button>
            <button className={activeCategory === 'orthosis' ? 'active' : ''} type="button" onClick={() => setActiveCategory('orthosis')}>
              Orthosis
            </button>
            <button className={activeCategory === 'prosthesis' ? 'active' : ''} type="button" onClick={() => setActiveCategory('prosthesis')}>
              Prosthesis
            </button>
          </div>
        </div>
        <ProductGrid products={visibleProducts} />
      </section>
      <CtaSection />
    </>
  )
}

function ProductDetailPage() {
  const { slug } = useParams()
  const product = products.find((item) => item.slug === slug)
  usePageSeo(
    product ? `${product.name} | Langkah Asa Orthotic Prosthetic` : 'Produk Tidak Ditemukan | Langkah Asa',
    product
      ? `${product.description} Konsultasikan kebutuhan ${product.label} melalui WhatsApp Langkah Asa.`
      : 'Produk Langkah Asa tidak ditemukan. Buka katalog orthosis dan prosthesis untuk memilih alat bantu yang sesuai.',
    product?.image ?? '/assets/hero-afo.jpg',
  )

  if (!product) {
    return <NotFoundPage />
  }

  const related = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3)

  return (
    <>
      <section className="detail-hero">
        <div className="detail-copy">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/produk">Produk</Link>
            <span>/</span>
            <strong>{product.name}</strong>
          </nav>
          <p className="eyebrow">{product.category === 'orthosis' ? 'Orthosis' : 'Prosthesis'}</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="hero-actions">
            <a className="hero-cta" href={productWhatsappUrl(product)} target="_blank" rel="noreferrer">
              <PhoneCall size={19} />
              Konsultasi {product.label}
            </a>
            <Link className="secondary-cta dark" to="/produk">
              Kembali ke katalog <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="detail-image">
          <img src={product.image} alt={product.name} />
        </div>
      </section>

      <section className="section detail-section">
        <div className="detail-card price-card">
          <span>Estimasi harga</span>
          <strong>{product.price}</strong>
          <p>Harga final menyesuaikan ukuran, material, komponen, dan hasil konsultasi.</p>
        </div>
        <InfoList title="Indikasi umum" items={product.indications} />
        <InfoList title="Fitur alat" items={product.features} />
        <InfoList title="Cocok untuk" items={product.madeFor} />
      </section>

      <section className="section product-section no-top-padding">
        <SectionHeading
          icon={<Stethoscope size={18} />}
          kicker="Produk terkait"
          title={`Produk ${product.category === 'orthosis' ? 'orthosis' : 'prosthesis'} lainnya.`}
          text="Lihat alternatif produk yang masih satu lini dengan kebutuhan ini."
        />
        <ProductGrid products={related} />
      </section>
      <CtaSection />
    </>
  )
}

function CoveragePage() {
  usePageSeo(
    'Area Jangkauan Langkah Asa | Solo, Magelang, Medan, Nasional',
    'Langkah Asa melayani konsultasi alat ortotik dan prostetik untuk Solo Raya, Magelang, Medan, beberapa wilayah Indonesia, serta pengiriman nasional.',
    '/assets/pattern-2.png',
  )

  return (
    <>
      <PageHero
        kicker="Area jangkauan"
        title="Layanan konsultasi dan pemesanan untuk beberapa kota serta pengiriman nasional."
        text="Langkah Asa membantu pasien dari Solo Raya, Magelang, Medan, dan wilayah lain melalui konsultasi awal, koordinasi pengukuran, serta pengiriman alat sesuai kebutuhan."
      />
      <section className="section coverage-section no-top-padding">
        <CoverageMap />
        <CoverageCopy />
      </section>
      <ProcessSection />
      <CtaSection />
    </>
  )
}

function ContactPage() {
  usePageSeo(
    'Kontak Langkah Asa | WhatsApp dan Instagram',
    'Hubungi Langkah Asa melalui WhatsApp atau Instagram untuk konsultasi alat ortotik dan prostetik, estimasi harga, serta jadwal pengukuran.',
    '/assets/logo-full.png',
  )

  return (
    <>
      <PageHero
        kicker="Kontak"
        title="Konsultasikan kondisi, ukuran, dan kebutuhan alat sebelum pesan."
        text="Kirim foto kondisi, hasil rujukan dokter bila ada, dan kebutuhan aktivitas harian supaya tim bisa membantu memberi arahan awal."
      />
      <section className="section contact-grid no-top-padding">
        <a className="contact-card" href={contact.whatsapp} target="_blank" rel="noreferrer">
          <PhoneCall size={26} />
          <span>WhatsApp</span>
          <strong>{contact.phoneDisplay}</strong>
          <p>Untuk konsultasi, estimasi harga, dan jadwal pengukuran.</p>
        </a>
        <a className="contact-card" href={contact.instagram} target="_blank" rel="noreferrer">
          <Camera size={26} />
          <span>Instagram</span>
          <strong>{contact.instagramLabel}</strong>
          <p>Untuk melihat update produk, dokumentasi, dan aktivitas brand.</p>
        </a>
        <div className="contact-card">
          <MapPin size={26} />
          <span>Jangkauan</span>
          <strong>Solo, Magelang, Medan</strong>
          <p>Area lain bisa dibantu melalui konsultasi jarak jauh dan pengiriman.</p>
        </div>
      </section>
      <section className="section whatsapp-section no-top-padding">
        <SectionHeading
          icon={<PhoneCall size={18} />}
          kicker="Fitur WhatsApp"
          title="Pilih kebutuhan agar chat awal langsung jelas."
          text="Setiap tombol WhatsApp sudah membawa format pesan sesuai konteks, jadi calon pasien tidak perlu mulai dari kosong."
        />
        <div className="quick-wa-grid">
          {whatsappShortcuts.map((item) => (
            <a href={item.href} target="_blank" rel="noreferrer" className="quick-wa-card" key={item.title}>
              <PhoneCall size={22} />
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </a>
          ))}
        </div>
      </section>
      <CtaSection />
    </>
  )
}

function NotFoundPage() {
  usePageSeo(
    'Halaman Tidak Ditemukan | Langkah Asa',
    'Halaman yang dibuka tidak ditemukan. Kembali ke katalog produk Langkah Asa atau hubungi WhatsApp untuk konsultasi.',
  )

  return (
    <>
      <PageHero
        kicker="404"
        title="Halaman tidak ditemukan."
        text="URL yang dibuka tidak tersedia. Kembali ke katalog atau hubungi WhatsApp untuk konsultasi."
      />
      <section className="section no-top-padding">
        <Link className="outline-action" to="/produk">
          Buka katalog produk <ArrowRight size={18} />
        </Link>
      </section>
    </>
  )
}

function PageHero({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return (
    <section className="page-hero">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  )
}

function SectionHeading({ icon, kicker, title, text }: { icon: ReactNode; kicker: string; title: string; text: string }) {
  return (
    <div className="section-heading">
      <div>
        <div className="section-kicker">
          {icon}
          {kicker}
        </div>
        <h2>{title}</h2>
      </div>
      <p>{text}</p>
    </div>
  )
}

function ReasonGrid() {
  return (
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
  )
}

function ProductGrid({ products: items }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {items.map((product) => (
        <Link className="product-card" to={`/produk/${product.slug}`} key={product.slug}>
          <div className="product-image">
            <img src={product.image} alt={product.name} decoding="async" />
          </div>
          <div className="product-body">
            <div>
              <span>{product.price}</span>
              <h3>{product.name}</h3>
              <p>{product.short}</p>
            </div>
            <ul>
              {product.indications.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <strong className="card-link">
              Detail produk <ArrowRight size={16} />
            </strong>
          </div>
        </Link>
      ))}
    </div>
  )
}

function CoverageMap() {
  return (
    <div className="coverage-map" aria-label="Peta area jangkauan">
      <div className="map-pulse solo">Solo</div>
      <div className="map-pulse magelang">Magelang</div>
      <div className="map-pulse medan">Medan</div>
    </div>
  )
}

function CoverageCopy() {
  return (
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
  )
}

function ProcessSection() {
  return (
    <section className="section process-section">
      <SectionHeading
        icon={<CircleHelp size={18} />}
        kicker="Alur pemesanan"
        title="Empat langkah sebelum alat siap digunakan."
        text="Alur dibuat jelas agar pasien tahu apa yang akan dilakukan sejak awal konsultasi."
      />
      <div className="process-line">
        {processSteps.map((step, index) => (
          <div className="process-step" key={step}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{step}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function CtaSection() {
  return (
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
  )
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="detail-card">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <img src="/assets/logo-white.png" alt="Langkah Asa Orthotic Prosthetic" />
      <p>Orthotic prosthetic custom care untuk mobilitas yang lebih aman, nyaman, dan percaya diri.</p>
      <a href={contact.whatsapp} target="_blank" rel="noreferrer">
        Konsultasi sekarang <MoveRight size={18} />
      </a>
    </footer>
  )
}

export default App
