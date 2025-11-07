/* ==========================================
   DOKUMENTASI JAVASCRIPT QRAJA
   ==========================================
   
   File ini berisi semua fungsi untuk aplikasi QRaja.
   Code diorganisir dengan baik dan mudah dibaca.
   
   Struktur:
   1. Inisialisasi & Setup
   2. Splash Screen Management
   3. Theme Toggle (Dark/Light Mode)
   4. Mobile Menu (Hamburger)
   5. Page Navigation
   6. QR Code Generator
   7. Download & Donate Functions
   8. Helper Functions
   
   ========================================== */

// ==========================================
// 1. INISIALISASI & SETUP
// ==========================================

// Tunggu sampai seluruh HTML selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
    console.log('QRaja sedang memulai...');
    
    // Jalankan semua fungsi setup
    initSplashScreen();
    initThemeToggle();
    initMobileMenu();
    initPageNavigation();
    initQRGenerator();
    initDonateButtons();
});

// ==========================================
// 2. SPLASH SCREEN MANAGEMENT
// ==========================================

/**
 * Fungsi untuk menampilkan splash screen
 * Splash screen akan hilang setelah 2.5 detik
 */
function initSplashScreen() {
    const splashScreen = document.getElementById('splashScreen');
    
    // Tunggu 2.5 detik, lalu fade out
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        
        // Hapus dari DOM setelah fade selesai
        setTimeout(() => {
            splashScreen.style.display = 'none';
            console.log('Splash screen selesai');
        }, 500);
    }, 2500);
}

// ==========================================
// 3. THEME TOGGLE (DARK/LIGHT MODE)
// ==========================================

/**
 * Fungsi untuk mengelola dark/light mode
 * Theme disimpan di localStorage supaya diingat
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('.theme-text');
    
    // Cek apakah user pernah pilih tema sebelumnya
    checkSavedTheme();
    
    // Event listener untuk tombol toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    /**
     * Cek tema yang tersimpan atau ikuti preferensi sistem
     */
    function checkSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Aktifkan dark mode jika:
        // 1. User pernah pilih dark mode, ATAU
        // 2. Sistem user pakai dark mode dan belum ada pilihan tersimpan
        if (savedTheme === 'dark' || (prefersDark && !savedTheme)) {
            enableDarkMode();
        } else {
            enableLightMode();
        }
    }
    
    /**
     * Toggle antara dark dan light mode
     */
    function toggleTheme() {
        if (document.body.classList.contains('dark-mode')) {
            enableLightMode();
            localStorage.setItem('theme', 'light');
        } else {
            enableDarkMode();
            localStorage.setItem('theme', 'dark');
        }
        console.log('Theme berubah');
    }
    
    /**
     * Aktifkan dark mode
     */
    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        themeText.textContent = 'Toggle Theme';
    }
    
    /**
     * Aktifkan light mode
     */
    function enableLightMode() {
        document.body.classList.remove('dark-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        themeText.textContent = 'Toggle Theme';
    }
}

// ==========================================
// 4. MOBILE MENU (HAMBURGER)
// ==========================================

/**
 * Fungsi untuk mengatur hamburger menu di mobile
 * Menu akan slide dari kanan ketika diklik
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburgerMenu');
    const navMenu = document.querySelector('.nav-menu');
    
    // Klik hamburger untuk buka/tutup menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        console.log('Menu mobile toggled');
    });
}

// ==========================================
// 5. PAGE NAVIGATION
// ==========================================

/**
 * Fungsi untuk mengatur navigasi antar halaman
 * Menggunakan sistem SPA (Single Page Application)
 */
function initPageNavigation() {
    // Daftar semua halaman
    const pages = {
        home: document.getElementById('homePage'),
        about: document.getElementById('aboutPage'),
        privacy: document.getElementById('privacyPage'),
        contact: document.getElementById('contactPage'),
        terms: document.getElementById('termsPage'),
        dmca: document.getElementById('dmcaPage'),
        security: document.getElementById('securityPage'),
        cookie: document.getElementById('cookiePage'),
        faqs: document.getElementById('faqsPage'),
        help: document.getElementById('helpPage')
    };
    
    // Tampilkan halaman home by default
    showPage('home');
    
    // Setup event listener untuk semua link navigasi
    setupNavigationLinks();
    
    // Setup tombol "Generate Now"
    setupGenerateNowButton();
    
    /**
     * Menampilkan halaman tertentu
     */
    function showPage(pageName) {
        // Sembunyikan semua halaman
        Object.values(pages).forEach(page => {
            if (page) page.style.display = 'none';
        });
        
        // Tampilkan halaman yang dipilih
        if (pages[pageName]) {
            pages[pageName].style.display = 'block';
            console.log(`Menampilkan halaman: ${pageName}`);
        }
    }
    
    /**
     * Setup listener untuk semua link dengan atribut data-page
     */
    function setupNavigationLinks() {
        const hamburger = document.getElementById('hamburgerMenu');
        const navMenu = document.querySelector('.nav-menu');
        
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageName = link.getAttribute('data-page');
                
                showPage(pageName);
                
                // Tutup mobile menu kalau lagi kebuka
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                
                // Scroll ke atas
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }
    
    /**
     * Setup tombol "Generate Now" di hero section
     */
    function setupGenerateNowButton() {
        const generateNowBtn = document.getElementById('generateNowBtn');
        
        generateNowBtn.addEventListener('click', () => {
            showPage('home');
            
            // Scroll ke bagian generator
            setTimeout(() => {
                const qrText = document.getElementById('qrText');
                qrText.scrollIntoView({ behavior: 'smooth' });
                qrText.focus();
            }, 100);
        });
    }
}

// ==========================================
// 6. QR CODE GENERATOR
// ==========================================

/**
 * Fungsi utama untuk generate QR code
 * Menggunakan library QRCode.js
 */
function initQRGenerator() {
    const qrText = document.getElementById('qrText');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Event listener untuk tombol generate
    generateBtn.addEventListener('click', generateQRCode);
    
    // Event listener untuk tombol download
    downloadBtn.addEventListener('click', downloadQRCode);
    
    // Generate QR ketika tekan Enter
    qrText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateQRCode();
        }
    });
    
    /**
     * Generate QR code dari input text
     */
    function generateQRCode() {
        const text = qrText.value.trim();
        
        // Validasi: cek apakah input kosong
        if (text === '') {
            showCustomAlert();
            return;
        }
        
        const qrResult = document.getElementById('qrResult');
        const resultContainer = document.getElementById('resultContainer');
        
        // Clear QR code sebelumnya (kalau ada)
        qrResult.width = qrResult.width;
        
        // Generate QR code baru
        QRCode.toCanvas(qrResult, text, {
            width: 200,
            margin: 1,
            color: {
                dark: '#4361ee',  // Warna QR code (biru)
                light: '#ffffff'   // Warna background (putih)
            }
        }, function(error) {
            if (error) {
                console.error('Error generating QR:', error);
                alert('Terjadi kesalahan saat membuat QR code');
                return;
            }
            
            // Tampilkan hasil
            resultContainer.style.display = 'block';
            
            // Scroll ke hasil dengan smooth animation
            resultContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            console.log('QR code berhasil dibuat');
        });
    }
    
    /**
     * Download QR code sebagai file PNG
     */
    function downloadQRCode() {
        const canvas = document.getElementById('qrResult');
        const url = canvas.toDataURL('image/png');
        
        // Buat link download temporary
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = url;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('QR code berhasil didownload');
    }
}

// ==========================================
// 7. DONATE FUNCTIONS
// ==========================================

/**
 * Setup tombol-tombol donate
 * Mengarahkan ke halaman Saweria
 */
function initDonateButtons() {
    const donateBtn = document.getElementById('donateBtn');
    const footerDonate = document.getElementById('footerDonate');
    const donateUrl = 'https://saweria.co/Ryzareth';
    
    // Donate button di hasil QR
    donateBtn.addEventListener('click', () => {
        window.open(donateUrl, '_blank');
        console.log('Membuka halaman donate');
    });
    
    // Donate link di footer
    footerDonate.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(donateUrl, '_blank');
        console.log('Membuka halaman donate dari footer');
    });
}

// ==========================================
// 8. HELPER FUNCTIONS
// ==========================================

/**
 * Menampilkan custom alert notification
 * Muncul selama 3 detik lalu hilang
 */
function showCustomAlert() {
    const customAlert = document.getElementById('customAlert');
    
    // Tampilkan alert dengan animasi slide
    customAlert.classList.add('show');
    
    // Sembunyikan setelah 3 detik
    setTimeout(() => {
        customAlert.classList.remove('show');
    }, 3000);
    
    console.log('Alert ditampilkan: Input kosong');
}

/**
 * Fungsi utility untuk scroll smooth ke element
 * @param {string} elementId - ID element tujuan
 */
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

/**
 * Fungsi untuk validasi URL
 * @param {string} string - String yang akan dicek
 * @returns {boolean} - True jika valid URL
 */
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log(`
\x1b[36m╔══════════════════════════════════════════════════════════════╗\x1b[0m
\x1b[36m║\x1b[0m                                                          \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m    ██████╗ ██████╗ ██╗   ██╗                               \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m   ██╔════╝ ██╔══██╗██║   ██║                               \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m   ██║  ███╗██████╔╝██║   ██║                               \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m   ██║   ██║██╔═══╝ ██║   ██║                               \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m   ╚██████╔╝██║     ╚██████╔╝                               \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m    ╚═════╝ ╚═╝      ╚═════╝                                \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m                                                          \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m               .-''''-._                                    \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m             .'  _    _ '.                                 \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m            /   (o)--(o)  \\                                \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m           |      .--.     |                               \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m           |    /      \\    |                               \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m            \\   \\__/\\__/   /                               \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m             '.  '--'  .'                                 \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m               '-.____.-'                                   \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m                                                          \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m        Project : \x1b[33mQR GENERATOR - RYZARETH\x1b[0m                  \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m        Version : \x1b[33mv2.0\x1b[0m                                 \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m        Status  : \x1b[32mOperational\x1b[0m                           \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m                                                          \x1b[36m║\x1b[0m
\x1b[36m╚══════════════════════════════════════════════════════════════╝\x1b[0m
`);


console.log('📱 QRaja siap digunakan!');
console.log('💡 Buat QR code dengan mudah dan cepat');
console.log('🌙 Support dark mode & light mode');
console.log('📲 Responsif di semua perangkat');

// ==========================================
// ERROR HANDLING
// ==========================================

/**
 * Global error handler
 * Menangkap error yang tidak tertangani
 */
window.addEventListener('error', (e) => {
    console.error('Terjadi error:', e.error);
    // Bisa tambahkan error reporting di sini
});

/**
 * Handler untuk unhandled promise rejection
 */
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Bisa tambahkan error reporting di sini
});

// ==========================================
// PERFORMANCE MONITORING (OPTIONAL)
// ==========================================

/**
 * Log waktu load halaman
 */
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`⚡ Halaman dimuat dalam ${loadTime.toFixed(2)}ms`);
});

// ==========================================
// END OF FILE
// ==========================================