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
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
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

type ContactInfo = {
  phoneDisplay: string
  whatsappNumber: string
  instagram: string
  instagramLabel: string
}

type SiteSettings = {
  heroEyebrow: string
  heroTitle: string
  heroCopy: string
  seoTitle: string
  seoDescription: string
}

type StatItem = {
  value: string
  label: string
}

type CmsContent = {
  site: SiteSettings
  contact: ContactInfo
  heroSlides: HeroSlide[]
  products: Product[]
  stats: StatItem[]
  philosophy: string[]
  serviceAreas: string[]
  processSteps: string[]
}

type AnalyticsSummary = {
  today: {
    date: string
    views: number
    visitors: number
  }
  onlineNow: number
  last7Days: {
    views: number
    visitors: number
    daily: Array<{ date: string; views: number; visitors: number }>
  }
  topPagesToday: Array<{ path: string; views: number }>
  serverTime: string
}

const siteUrl = 'https://langkahasa.com'

function normalizeWhatsappNumber(rawNumber: string) {
  const numeric = rawNumber.replace(/\D/g, '')

  if (numeric.startsWith('0')) {
    return `62${numeric.slice(1)}`
  }

  return numeric || '62816268265'
}

function createWhatsappUrl(message: string, whatsappNumber = '62816268265') {
  return `https://wa.me/${normalizeWhatsappNumber(whatsappNumber)}?text=${encodeURIComponent(message)}`
}

function mainWhatsappUrl(contactInfo: ContactInfo) {
  return createWhatsappUrl('Halo Langkah Asa, saya ingin konsultasi alat ortotik atau prostetik.', contactInfo.whatsappNumber)
}

function productWhatsappUrl(product: Product, contactInfo: ContactInfo) {
  return createWhatsappUrl(
    `Halo Langkah Asa, saya ingin konsultasi produk ${product.name}. Mohon bantu cek kecocokan alat, estimasi harga, dan proses pengukurannya.`,
    contactInfo.whatsappNumber,
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

const defaultContact: ContactInfo = {
  phoneDisplay: '0816-268-265',
  whatsappNumber: '62816268265',
  instagram: 'https://www.instagram.com/prosthetic.care/',
  instagramLabel: '@prosthetic.care',
}

function getWhatsappShortcuts(contactInfo: ContactInfo) {
  return [
  {
    title: 'Konsultasi alat',
    text: 'Cocok untuk tanya rekomendasi orthosis atau prosthesis sesuai kondisi.',
    href: createWhatsappUrl('Halo Langkah Asa, saya ingin konsultasi alat yang cocok untuk kondisi saya.', contactInfo.whatsappNumber),
  },
  {
    title: 'Cek estimasi harga',
    text: 'Kirim kebutuhan produk, ukuran, foto kondisi, dan target aktivitas.',
    href: createWhatsappUrl('Halo Langkah Asa, saya ingin cek estimasi harga alat ortotik/prostetik.', contactInfo.whatsappNumber),
  },
  {
    title: 'Jadwal pengukuran',
    text: 'Untuk mengatur konsultasi lanjutan, fitting, atau pengukuran pasien.',
    href: createWhatsappUrl('Halo Langkah Asa, saya ingin membuat jadwal pengukuran atau fitting.', contactInfo.whatsappNumber),
  },
  ]
}

const defaultSite: SiteSettings = {
  heroEyebrow: 'Orthotic Prosthetic Care',
  heroTitle: 'Langkah Asa',
  heroCopy:
    'Pembuatan alat ortotik dan prostetik custom untuk membantu pengguna kembali bergerak, beraktivitas, dan menjalani hari dengan lebih percaya diri.',
  seoTitle: 'Langkah Asa Orthotic Prosthetic | Alat Ortotik dan Prostetik Custom',
  seoDescription:
    'Langkah Asa melayani konsultasi dan pembuatan orthosis serta prosthesis custom seperti AFO, brace, kaki palsu, tangan palsu, jari palsu, dan alat bantu mobilitas.',
}

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

const defaultContent: CmsContent = {
  site: defaultSite,
  contact: defaultContact,
  heroSlides,
  products,
  stats,
  philosophy,
  serviceAreas,
  processSteps,
}

function normalizeContent(input: Partial<CmsContent>): CmsContent {
  return {
    site: { ...defaultContent.site, ...(input.site ?? {}) },
    contact: { ...defaultContent.contact, ...(input.contact ?? {}) },
    heroSlides: Array.isArray(input.heroSlides) && input.heroSlides.length > 0 ? input.heroSlides : defaultContent.heroSlides,
    products: Array.isArray(input.products) ? input.products : defaultContent.products,
    stats: Array.isArray(input.stats) && input.stats.length > 0 ? input.stats : defaultContent.stats,
    philosophy: Array.isArray(input.philosophy) ? input.philosophy : defaultContent.philosophy,
    serviceAreas: Array.isArray(input.serviceAreas) ? input.serviceAreas : defaultContent.serviceAreas,
    processSteps: Array.isArray(input.processSteps) ? input.processSteps : defaultContent.processSteps,
  }
}

const CmsContext = createContext<{ content: CmsContent; reloadContent: () => Promise<void> } | null>(null)

function CmsProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<CmsContent>(defaultContent)

  const reloadContent = useCallback(async () => {
    try {
      const response = await fetch(`/cms/content.json?v=${Date.now()}`, { cache: 'no-store' })

      if (!response.ok) {
        return
      }

      const data = (await response.json()) as Partial<CmsContent>
      setContent(normalizeContent(data))
    } catch {
      setContent(defaultContent)
    }
  }, [])

  useEffect(() => {
    // CMS content is an external JSON source; sync it once when the app starts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reloadContent()
  }, [reloadContent])

  const value = useMemo(() => ({ content, reloadContent }), [content, reloadContent])

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

function useCms() {
  const context = useContext(CmsContext)

  if (!context) {
    throw new Error('useCms must be used inside CmsProvider')
  }

  return context
}

function App() {
  return (
    <BrowserRouter>
      <CmsProvider>
        <SiteLayout />
      </CmsProvider>
    </BrowserRouter>
  )
}

function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { content } = useCms()
  const { contact } = content

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      return
    }

    const controller = new AbortController()

    void fetch('/cms/api.php?action=track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: location.pathname }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => undefined)

    return () => controller.abort()
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
          <a className="primary-action" href={mainWhatsappUrl(contact)} target="_blank" rel="noreferrer">
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
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <SiteFooter />

      <a className="floating-whatsapp" href={mainWhatsappUrl(contact)} target="_blank" rel="noreferrer" aria-label="Chat WhatsApp">
        <PhoneCall size={22} />
        <span>Chat WA</span>
      </a>
    </div>
  )
}

function HomePageContent() {
  const { content } = useCms()
  const featuredProducts = content.products.slice(0, 6)
  usePageSeo(content.site.seoTitle, content.site.seoDescription)

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
  const { content } = useCms()
  const slides = content.heroSlides.length > 0 ? content.heroSlides : heroSlides
  const safeActiveSlide = activeSlide % slides.length
  const slide = slides[safeActiveSlide] ?? slides[0]

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((index) => (index + 1) % slides.length)
    }, 5600)

    return () => window.clearInterval(intervalId)
  }, [slides.length])

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-slides" aria-hidden="true">
        {slides.map((item, index) => (
          <img className={index === safeActiveSlide ? 'active' : ''} src={item.image} alt="" fetchPriority={index === 0 ? 'high' : 'auto'} key={item.title} />
        ))}
      </div>
      <div className="hero-content">
        <p className="eyebrow">{content.site.heroEyebrow}</p>
        <h1 id="hero-title">{content.site.heroTitle}</h1>
        <p className="hero-copy">{content.site.heroCopy}</p>
        <div className="hero-actions">
          <a className="hero-cta" href={mainWhatsappUrl(content.contact)} target="_blank" rel="noreferrer">
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
          {slides.map((item, index) => (
            <button
              className={index === safeActiveSlide ? 'active' : ''}
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
  const { content } = useCms()

  return (
    <section className="stats-strip" aria-label="Ringkasan layanan">
      {content.stats.map((item) => (
        <div key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
      <a href={mainWhatsappUrl(content.contact)} target="_blank" rel="noreferrer">
        Jadwalkan konsultasi <ChevronRight size={18} />
      </a>
    </section>
  )
}

function PhilosophyPreview() {
  const { content } = useCms()

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
          {content.philosophy.map((item) => (
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
  const { content } = useCms()

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
          {content.philosophy.map((item) => (
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
  const { content } = useCms()
  usePageSeo(
    'Katalog Produk Langkah Asa | Orthosis dan Prosthesis',
    'Lihat katalog produk Langkah Asa: AFO, HKAFO, korset, scoliosis brace, TLSO, sepatu ortopedi, kaki palsu, tangan palsu, jari palsu, dan socket prostetik.',
    '/assets/hkafo.png',
  )
  const visibleProducts = useMemo(
    () => (activeCategory === 'all' ? content.products : content.products.filter((product) => product.category === activeCategory)),
    [activeCategory, content.products],
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
  const { content } = useCms()
  const product = content.products.find((item) => item.slug === slug)
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

  const related = content.products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3)

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
            <a className="hero-cta" href={productWhatsappUrl(product, content.contact)} target="_blank" rel="noreferrer">
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
  const { content } = useCms()

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
        <a className="contact-card" href={mainWhatsappUrl(content.contact)} target="_blank" rel="noreferrer">
          <PhoneCall size={26} />
          <span>WhatsApp</span>
          <strong>{content.contact.phoneDisplay}</strong>
          <p>Untuk konsultasi, estimasi harga, dan jadwal pengukuran.</p>
        </a>
        <a className="contact-card" href={content.contact.instagram} target="_blank" rel="noreferrer">
          <Camera size={26} />
          <span>Instagram</span>
          <strong>{content.contact.instagramLabel}</strong>
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
          {getWhatsappShortcuts(content.contact).map((item) => (
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

const adminTabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'settings', label: 'Kontak & SEO' },
  { id: 'slides', label: 'Hero Slider' },
  { id: 'products', label: 'Produk' },
  { id: 'lists', label: 'Konten List' },
] as const

type AdminTab = (typeof adminTabs)[number]['id']

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function linesToArray(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function makeEmptyProduct(): Product {
  return {
    slug: `produk-baru-${Date.now()}`,
    category: 'orthosis',
    name: 'Produk Baru',
    label: 'Produk baru',
    short: 'Deskripsi singkat produk.',
    description: 'Tulis deskripsi lengkap produk di sini.',
    price: 'Konsultasi harga',
    image: '/assets/logo-mark.png',
    indications: ['Indikasi umum'],
    features: ['Fitur produk'],
    madeFor: ['Kebutuhan pengguna'],
  }
}

function makeEmptySlide(): HeroSlide {
  return {
    title: 'Slide Baru',
    kicker: 'Sorotan layanan',
    text: 'Tulis teks pendukung slide di sini.',
    image: '/assets/hero-afo.jpg',
  }
}

function AdminPage() {
  const { content, reloadContent } = useCms()
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [draft, setDraft] = useState<CmsContent>(content)
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  usePageSeo('Admin CMS Langkah Asa', 'Panel admin untuk mengubah konten Langkah Asa.')

  const loadDraft = useCallback(async () => {
    const response = await fetch(`/cms/api.php?action=get&v=${Date.now()}`, { cache: 'no-store' })
    const payload = await response.json()

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error ?? 'Gagal mengambil konten CMS.')
    }

    setDraft(normalizeContent(payload.content))
  }, [])

  const loadAnalytics = useCallback(async () => {
    const response = await fetch(`/cms/api.php?action=analytics&v=${Date.now()}`, { cache: 'no-store' })
    const payload = await response.json()

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error ?? 'Gagal mengambil analytics.')
    }

    setAnalytics(payload.analytics as AnalyticsSummary)
  }, [])

  useEffect(() => {
    let active = true

    async function checkSession() {
      try {
        const response = await fetch('/cms/api.php?action=status', { cache: 'no-store' })
        const payload = await response.json()

        if (!active) {
          return
        }

        setAuthenticated(Boolean(payload.authenticated))

        if (payload.authenticated) {
          await loadDraft()
          await loadAnalytics()
        }
      } catch {
        if (active) {
          setAuthenticated(false)
        }
      } finally {
        if (active) {
          setChecking(false)
        }
      }
    }

    void checkSession()

    return () => {
      active = false
    }
  }, [loadAnalytics, loadDraft])

  useEffect(() => {
    if (!authenticated) {
      return
    }

    // Analytics is an external realtime source; sync it while admin dashboard is open.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAnalytics().catch(() => undefined)
    const intervalId = window.setInterval(() => {
      void loadAnalytics().catch(() => undefined)
    }, 10000)

    return () => window.clearInterval(intervalId)
  }, [authenticated, loadAnalytics])

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('')

    try {
      const response = await fetch('/cms/api.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const payload = await response.json()

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Login gagal.')
      }

      setAuthenticated(true)
      setPassword('')
      await loadDraft()
      await loadAnalytics()
      setMessage('Login berhasil.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login gagal.')
    } finally {
      setBusy(false)
    }
  }

  async function logout() {
    await fetch('/cms/api.php?action=logout', { method: 'POST' })
    setAuthenticated(false)
    setMessage('Logout berhasil.')
  }

  async function saveDraft() {
    setBusy(true)
    setMessage('')

    try {
      const response = await fetch('/cms/api.php?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      const payload = await response.json()

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Gagal menyimpan konten.')
      }

      await reloadContent()
      await loadDraft()
      setMessage('Konten berhasil disimpan dan sudah aktif di website.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gagal menyimpan konten.')
    } finally {
      setBusy(false)
    }
  }

  async function uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch('/cms/api.php?action=upload', {
      method: 'POST',
      body: formData,
    })
    const payload = await response.json()

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error ?? 'Upload gagal.')
    }

    return payload.url as string
  }

  async function handleImageUpload(file: File | undefined, onUploaded: (url: string) => void) {
    if (!file) {
      return
    }

    setBusy(true)
    setMessage('')

    try {
      const url = await uploadImage(file)
      onUploaded(url)
      setMessage('Gambar berhasil diupload. Klik Simpan CMS untuk menerapkan.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload gambar gagal.')
    } finally {
      setBusy(false)
    }
  }

  function updateProduct(index: number, patch: Partial<Product>) {
    setDraft((current) => ({
      ...current,
      products: current.products.map((product, productIndex) => (productIndex === index ? { ...product, ...patch } : product)),
    }))
  }

  function updateSlide(index: number, patch: Partial<HeroSlide>) {
    setDraft((current) => ({
      ...current,
      heroSlides: current.heroSlides.map((slide, slideIndex) => (slideIndex === index ? { ...slide, ...patch } : slide)),
    }))
  }

  if (checking) {
    return (
      <section className="admin-shell">
        <p>Memeriksa sesi admin...</p>
      </section>
    )
  }

  if (!authenticated) {
    return (
      <section className="admin-shell admin-login">
        <div className="admin-card">
          <p className="eyebrow">CMS Login</p>
          <h1>Admin Langkah Asa</h1>
          <form onSubmit={login}>
            <label>
              Password admin
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            </label>
            <button className="admin-primary" type="submit" disabled={busy}>
              {busy ? 'Memproses...' : 'Masuk CMS'}
            </button>
          </form>
          {message ? <p className="admin-message">{message}</p> : null}
        </div>
      </section>
    )
  }

  return (
    <section className="admin-shell">
      <div className="admin-topbar">
        <div>
          <p className="eyebrow">CMS Langkah Asa</p>
          <h1>Admin Panel</h1>
          <p>Ubah produk, gambar, hero slider, kontak, konten list, dan pantau visit hari ini secara realtime.</p>
        </div>
        <div className="admin-actions">
          <button className="admin-secondary" type="button" onClick={() => void loadAnalytics()} disabled={busy}>
            Refresh visit
          </button>
          <button className="admin-secondary" type="button" onClick={() => void loadDraft()} disabled={busy}>
            Muat ulang
          </button>
          <button className="admin-primary" type="button" onClick={() => void saveDraft()} disabled={busy}>
            {busy ? 'Menyimpan...' : 'Simpan CMS'}
          </button>
          <button className="admin-secondary" type="button" onClick={() => void logout()}>
            Logout
          </button>
        </div>
      </div>

      {message ? <p className="admin-message">{message}</p> : null}

      <div className="admin-tabs">
        {adminTabs.map((tab) => (
          <button className={activeTab === tab.id ? 'active' : ''} type="button" onClick={() => setActiveTab(tab.id)} key={tab.id}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' ? (
        <div className="admin-stack">
          <div className="analytics-grid">
            <div className="analytics-card highlight">
              <span>Visit Today</span>
              <strong>{analytics?.today.views ?? 0}</strong>
              <p>{analytics?.today.visitors ?? 0} visitor unik hari ini</p>
            </div>
            <div className="analytics-card">
              <span>Online sekarang</span>
              <strong>{analytics?.onlineNow ?? 0}</strong>
              <p>Aktif dalam 5 menit terakhir</p>
            </div>
            <div className="analytics-card">
              <span>7 hari terakhir</span>
              <strong>{analytics?.last7Days.views ?? 0}</strong>
              <p>{analytics?.last7Days.visitors ?? 0} visitor unik</p>
            </div>
            <div className="analytics-card">
              <span>Konten aktif</span>
              <strong>{draft.products.length}</strong>
              <p>{draft.heroSlides.length} hero slide</p>
            </div>
          </div>

          <div className="admin-grid two">
            <div className="admin-card">
              <h2>Top page hari ini</h2>
              {analytics?.topPagesToday.length ? (
                <div className="analytics-list">
                  {analytics.topPagesToday.map((page) => (
                    <div key={page.path}>
                      <span>{page.path}</span>
                      <strong>{page.views}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="admin-empty">Belum ada data visit hari ini.</p>
              )}
            </div>
            <div className="admin-card">
              <h2>Visit 7 hari</h2>
              {analytics?.last7Days.daily.length ? (
                <div className="analytics-list">
                  {analytics.last7Days.daily.map((day) => (
                    <div key={day.date}>
                      <span>{day.date}</span>
                      <strong>{day.views}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="admin-empty">Belum ada data 7 hari.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === 'settings' ? (
        <div className="admin-grid two">
          <div className="admin-card">
            <h2>Kontak</h2>
            <label>
              Nomor tampilan
              <input value={draft.contact.phoneDisplay} onChange={(event) => setDraft((current) => ({ ...current, contact: { ...current.contact, phoneDisplay: event.target.value } }))} />
            </label>
            <label>
              Nomor WhatsApp internasional
              <input value={draft.contact.whatsappNumber} onChange={(event) => setDraft((current) => ({ ...current, contact: { ...current.contact, whatsappNumber: event.target.value } }))} />
            </label>
            <label>
              Link Instagram
              <input value={draft.contact.instagram} onChange={(event) => setDraft((current) => ({ ...current, contact: { ...current.contact, instagram: event.target.value } }))} />
            </label>
            <label>
              Label Instagram
              <input value={draft.contact.instagramLabel} onChange={(event) => setDraft((current) => ({ ...current, contact: { ...current.contact, instagramLabel: event.target.value } }))} />
            </label>
          </div>
          <div className="admin-card">
            <h2>Hero & SEO Home</h2>
            <label>
              Eyebrow hero
              <input value={draft.site.heroEyebrow} onChange={(event) => setDraft((current) => ({ ...current, site: { ...current.site, heroEyebrow: event.target.value } }))} />
            </label>
            <label>
              Judul hero
              <input value={draft.site.heroTitle} onChange={(event) => setDraft((current) => ({ ...current, site: { ...current.site, heroTitle: event.target.value } }))} />
            </label>
            <label>
              Deskripsi hero
              <textarea value={draft.site.heroCopy} onChange={(event) => setDraft((current) => ({ ...current, site: { ...current.site, heroCopy: event.target.value } }))} />
            </label>
            <label>
              SEO title
              <input value={draft.site.seoTitle} onChange={(event) => setDraft((current) => ({ ...current, site: { ...current.site, seoTitle: event.target.value } }))} />
            </label>
            <label>
              SEO description
              <textarea value={draft.site.seoDescription} onChange={(event) => setDraft((current) => ({ ...current, site: { ...current.site, seoDescription: event.target.value } }))} />
            </label>
          </div>
        </div>
      ) : null}

      {activeTab === 'slides' ? (
        <div className="admin-stack">
          <button className="admin-primary" type="button" onClick={() => setDraft((current) => ({ ...current, heroSlides: [...current.heroSlides, makeEmptySlide()] }))}>
            Tambah slide
          </button>
          {draft.heroSlides.map((slide, index) => (
            <div className="admin-card editor-card" key={`${slide.title}-${index}`}>
              <div className="editor-preview">
                <img src={slide.image} alt="" />
              </div>
              <div className="editor-fields">
                <h2>Slide {index + 1}</h2>
                <label>
                  Judul
                  <input value={slide.title} onChange={(event) => updateSlide(index, { title: event.target.value })} />
                </label>
                <label>
                  Kicker
                  <input value={slide.kicker} onChange={(event) => updateSlide(index, { kicker: event.target.value })} />
                </label>
                <label>
                  Teks
                  <textarea value={slide.text} onChange={(event) => updateSlide(index, { text: event.target.value })} />
                </label>
                <label>
                  URL gambar
                  <input value={slide.image} onChange={(event) => updateSlide(index, { image: event.target.value })} />
                </label>
                <label>
                  Upload gambar
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => void handleImageUpload(event.target.files?.[0], (url) => updateSlide(index, { image: url }))} />
                </label>
                <button
                  className="admin-danger"
                  type="button"
                  onClick={() => setDraft((current) => ({ ...current, heroSlides: current.heroSlides.filter((_, slideIndex) => slideIndex !== index) }))}
                >
                  Hapus slide
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {activeTab === 'products' ? (
        <div className="admin-stack">
          <button className="admin-primary" type="button" onClick={() => setDraft((current) => ({ ...current, products: [makeEmptyProduct(), ...current.products] }))}>
            Tambah produk
          </button>
          {draft.products.map((product, index) => (
            <details className="admin-card product-editor" open={index === 0} key={`${product.slug}-${index}`}>
              <summary>
                <span>{product.name}</span>
                <small>{product.category} / {product.price}</small>
              </summary>
              <div className="editor-card inline">
                <div className="editor-preview">
                  <img src={product.image} alt="" />
                </div>
                <div className="editor-fields">
                  <div className="admin-grid two compact">
                    <label>
                      Nama produk
                      <input value={product.name} onChange={(event) => updateProduct(index, { name: event.target.value })} />
                    </label>
                    <label>
                      Slug URL
                      <input value={product.slug} onChange={(event) => updateProduct(index, { slug: slugify(event.target.value) })} />
                    </label>
                    <label>
                      Kategori
                      <select value={product.category} onChange={(event) => updateProduct(index, { category: event.target.value as ProductCategory })}>
                        <option value="orthosis">Orthosis</option>
                        <option value="prosthesis">Prosthesis</option>
                      </select>
                    </label>
                    <label>
                      Label CTA
                      <input value={product.label} onChange={(event) => updateProduct(index, { label: event.target.value })} />
                    </label>
                    <label>
                      Harga
                      <input value={product.price} onChange={(event) => updateProduct(index, { price: event.target.value })} />
                    </label>
                    <label>
                      URL gambar
                      <input value={product.image} onChange={(event) => updateProduct(index, { image: event.target.value })} />
                    </label>
                  </div>
                  <label>
                    Deskripsi singkat card
                    <textarea value={product.short} onChange={(event) => updateProduct(index, { short: event.target.value })} />
                  </label>
                  <label>
                    Deskripsi detail
                    <textarea value={product.description} onChange={(event) => updateProduct(index, { description: event.target.value })} />
                  </label>
                  <label>
                    Upload gambar produk
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => void handleImageUpload(event.target.files?.[0], (url) => updateProduct(index, { image: url }))} />
                  </label>
                  <div className="admin-grid three compact">
                    <label>
                      Indikasi, satu per baris
                      <textarea value={product.indications.join('\n')} onChange={(event) => updateProduct(index, { indications: linesToArray(event.target.value) })} />
                    </label>
                    <label>
                      Fitur, satu per baris
                      <textarea value={product.features.join('\n')} onChange={(event) => updateProduct(index, { features: linesToArray(event.target.value) })} />
                    </label>
                    <label>
                      Cocok untuk, satu per baris
                      <textarea value={product.madeFor.join('\n')} onChange={(event) => updateProduct(index, { madeFor: linesToArray(event.target.value) })} />
                    </label>
                  </div>
                  <button
                    className="admin-danger"
                    type="button"
                    onClick={() => setDraft((current) => ({ ...current, products: current.products.filter((_, productIndex) => productIndex !== index) }))}
                  >
                    Hapus produk
                  </button>
                </div>
              </div>
            </details>
          ))}
        </div>
      ) : null}

      {activeTab === 'lists' ? (
        <div className="admin-grid two">
          <div className="admin-card">
            <h2>Statistik</h2>
            {draft.stats.map((item, index) => (
              <div className="admin-grid two compact" key={`${item.label}-${index}`}>
                <label>
                  Angka
                  <input
                    value={item.value}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        stats: current.stats.map((stat, statIndex) => (statIndex === index ? { ...stat, value: event.target.value } : stat)),
                      }))
                    }
                  />
                </label>
                <label>
                  Label
                  <input
                    value={item.label}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        stats: current.stats.map((stat, statIndex) => (statIndex === index ? { ...stat, label: event.target.value } : stat)),
                      }))
                    }
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="admin-card">
            <h2>Filosofi Brand</h2>
            <textarea value={draft.philosophy.join('\n')} onChange={(event) => setDraft((current) => ({ ...current, philosophy: linesToArray(event.target.value) }))} />
          </div>
          <div className="admin-card">
            <h2>Area Jangkauan</h2>
            <textarea value={draft.serviceAreas.join('\n')} onChange={(event) => setDraft((current) => ({ ...current, serviceAreas: linesToArray(event.target.value) }))} />
          </div>
          <div className="admin-card">
            <h2>Alur Pemesanan</h2>
            <textarea value={draft.processSteps.join('\n')} onChange={(event) => setDraft((current) => ({ ...current, processSteps: linesToArray(event.target.value) }))} />
          </div>
        </div>
      ) : null}
    </section>
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
  const { content } = useCms()

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
        {content.serviceAreas.map((area) => (
          <span key={area}>{area}</span>
        ))}
      </div>
    </div>
  )
}

function ProcessSection() {
  const { content } = useCms()

  return (
    <section className="section process-section">
      <SectionHeading
        icon={<CircleHelp size={18} />}
        kicker="Alur pemesanan"
        title="Empat langkah sebelum alat siap digunakan."
        text="Alur dibuat jelas agar pasien tahu apa yang akan dilakukan sejak awal konsultasi."
      />
      <div className="process-line">
        {content.processSteps.map((step, index) => (
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
  const { content } = useCms()

  return (
    <section className="cta-section">
      <div>
        <p className="eyebrow">CTA WhatsApp & Instagram</p>
        <h2>Mulai dari konsultasi singkat tentang kondisi dan alat yang dibutuhkan.</h2>
      </div>
      <div className="cta-actions">
        <a className="hero-cta" href={mainWhatsappUrl(content.contact)} target="_blank" rel="noreferrer">
          <PhoneCall size={19} />
          WhatsApp {content.contact.phoneDisplay}
        </a>
        <a className="secondary-cta light" href={content.contact.instagram} target="_blank" rel="noreferrer">
          <Camera size={18} />
          {content.contact.instagramLabel}
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
  const { content } = useCms()

  return (
    <footer className="site-footer">
      <img src="/assets/logo-white.png" alt="Langkah Asa Orthotic Prosthetic" />
      <p>Orthotic prosthetic custom care untuk mobilitas yang lebih aman, nyaman, dan percaya diri.</p>
      <a href={mainWhatsappUrl(content.contact)} target="_blank" rel="noreferrer">
        Konsultasi sekarang <MoveRight size={18} />
      </a>
    </footer>
  )
}

export default App
