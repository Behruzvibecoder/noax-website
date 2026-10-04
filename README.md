# trevornoah.com — to'liq lokal nusxa (1:1)

Saytning **o'z manbalari** yuklab olingan va lokalda ishlayapti: Webflow HTML, `main.css`,
ES-module JS bundle'lari (`app.js` + `chunk-*.js`), Die Grotesk shriftlari, barcha rasmlar,
va eng muhimi — **WebGL sahna fayllari** (Three.js GLB modellar, KTX2/EXR teksturalar, Basis transcoder).

## Ishga tushirish

```bash
cd mirror
python3 server.py          # http://localhost:8080
```

## To'liq ekran

Sayt responsive — brauzer oynasini to'liq egallaydi. Arena'ning yon paneldagi preview'i
kichik freym ichida bo'lgani uchun kichik ko'rinadi: preview'ni **yangi tabda oching**
(`https://8080-<sandbox>.e2b.app`) va `F11` bossangiz chinakam full-screen bo'ladi.
Lokalda esa `http://localhost:8080`.

## Nima bor

| Yo'l | Izoh |
|---|---|
| `/` | Bosh sahifa (bosh ichidan chiqadigan 3D obyektlar) |
| `/legal/privacy-policy` | Maxfiylik siyosati |
| `/<xato-yo'l>` | Saytning o'z 404 sahifasi (animatsiyali) |
| `/books` | Kitoblar sahifasi — 3 ta 3D kitob muqovasi (asl WebGL sahna) |
| `/books/into-the-uncut-grass`, `/books/born-a-crime`, `/books/born-a-crime-ya-edition` | Kitob sahifalari |
| `/shows`, `/watch-listen`, `/about` | Qolgan sahifalar |
| `models/` | 15 ta `.glb` (kitob, mikrofon, bosh, yer, bulut, yurak, pleyer...) |
| `textures/ktx2/` | Kitob muqovalari va matcap teksturalari (`.ktx2`) |
| `basis/` | KTX2 uchun Basis transcoder (`.js` + `.wasm`) |
| `server.py` | Statik server: to'g'ri MIME (`.wasm`, `.glb`, `.ktx2`) + `.html` fallback |

## Qilingan o'zgartirishlar

1. `chunk-022tjzda.js` ichidagi `this.path = "https://trevornoah.itsoffbrand.io"` → `""`
   (3D asset'lar lokal serverdan yuklanadi).
2. HTML'lardagi `integrity` (SRI) atributlari olib tashlandi — wget havolalarni lokalga
   o'zgartirgani uchun hash mos kelmay, CSS/JS bloklanardi.
3. Shrift `preload` linklariga `crossorigin="anonymous"` qaytarildi (CORS mosligi uchun).
4. Barcha ichki havolalar toza lokal yo'llarga o'tkazildi (`https://www.trevornoah.com/books` →
   `/books`), shuning uchun Taxi.js SPA navigatsiyasi lokalda ishlaydi va hech qayerda
   asl saytga sakrab ketmaydi.
5. Yetishmayotgan 87 ta rasm + `legal/privacy-policy` + `404.html` qo'shimcha yuklab olindi;
   server topilmagan yo'llarga saytning o'z 404 sahifasini qaytaradi.

## Tekshiruv natijasi

10 ta sahifa headless Chrome'da ochib ko'rildi: hammasida WebGL canvas ishlaydi,
jami **591 ta resurs — 0 ta xato**, menyu orqali SPA o'tish (`/` → `/books`) ham ishlaydi.

## GitHub'ga joylash

Papka allaqachon git repo (`git init` + birinchi commit qilingan, ~22 MB).

```bash
cd mirror
git remote add origin https://github.com/<foydalanuvchi>/<repo>.git
git branch -M main
git push -u origin main
```

### GitHub Pages'da jonli ishlashi uchun

Sayt yo'llari ildizdan boshlanadi (`/books`, `/models/...`), shuning uchun:

- **`<user>.github.io` repo'si yoki o'z domeningiz** bo'lsa — hech narsa qilish shart emas.
- **Oddiy loyiha repo'si** (`<user>.github.io/<repo>/`) bo'lsa — push qilishdan oldin:

```bash
python3 set_base.py /<repo>     # barcha yo'llarga prefiks qo'shadi
git commit -am "base path: /<repo>"
# lokalda qayta sinash uchun: python3 set_base.py /
```

`.nojekyll` fayli qo'shilgan (Jekyll fayllarni o'zgartirmasligi uchun), `404.html` esa
Pages'ning 404 sahifasi sifatida avtomatik ishlatiladi.

> Fayl hajmlari: eng kattasi 1.6 MB (`TREVOR_earth-opt-06.glb`) — GitHub limitlariga mos.

## Eslatma

Google Tag Manager / Analytics so'rovlari lokalda bajarilmaydi (muhim emas).
Tashqi havolalar (YouTube, Spotify, Seated, do'kon) asl manzillariga ketadi.
Kontent va dizayn Trevor Noah / itsoffbrand'ga tegishli — bu faqat o'rganish uchun nusxa.
