# 💖 BraceMood — เว็บแอปสุ่มและช่วยเลือกสียางจัดฟันสำหรับวัยรุ่น

> **"ค้นหาสียางที่ใช่ ในสไตล์ของคุณ"**  
> มากกว่าการสุ่มสี เพราะเราช่วยค้นหาคู่สีที่เหมาะกับ Mood, สไตล์, เสื้อผ้า และโอกาส พร้อมระบบจำลองรอยยิ้ม สมาชิก และ Admin Dashboard ออนไลน์

---

## 🌟 จุดเด่นและฟังก์ชันหลัก (Core Features)

1. **🎲 Smart Random (ระบบสุ่มสีอัจฉริยะ)**
   - สุ่ม 1 สี, 2 สี (Duo), 3 สี (Trio), สลับซี่ (Alternate)
   - ป้องกันการสุ่มชุดสีซ้ำติดกัน
   - กรองตามโทนสี (Pastel, Vibrant, Deep, Metallic)
2. **😊 Mood Match (จับคู่ตามอารมณ์)**
   - สดใส, หวาน, เท่, น่ารัก, ลึกลับ, สบายตา, โดดเด่น
3. **👕 Outfit Match (จับคู่กับสีเสื้อผ้า)**
   - เลือกสีเสื้อเพื่อรับคำแนะนำคู่สียางจัดฟันที่เสริมลุค
4. **🎉 Occasion & Festival (เลือกตามเทศกาล)**
   - เทศกาลวาเลนไทน์, เปิดเทอม, คริสต์มาส, ฮาโลวีน, ปีใหม่, ซัมเมอร์
5. **😁 Smile Simulator (สตูดิโอจำลองรอยยิ้มเสมือนจริง)**
   - กราฟิกการ์ตูนรอยยิ้มเสมือนจริง ฟันบน-ฟันล่าง ลวดจัดฟัน และโอริง
   - สามารถแต้มสีเฉพาะซี่ และปรับเปลี่ยนประเภทแบร็กเก็ต (โลหะ, เซรามิก, ทอง)
6. **⭐ Color Scoring System (วิเคราะห์คะแนนคู่สี)**
   - คำนวณความเข้ากัน (Harmony), ความสดใส (Vibrancy), ความน่ารัก (Cuteness), และการขับฟันขาว
7. **👤 Member System (ระบบสมาชิกออนไลน์)**
   - สมัครสมาชิก, Login/Logout, แก้ไข Profile, ปรับรูป Avatar
   - บันทึกสีที่ชอบ (My Collection), ประวัติการสุ่ม (History)
   - แบบทดสอบค้นหาตัวตน **My Style Quiz**
   - ระบบภารกิจ **Challenges** และปลดล็อกเหรียญตรา **Badges**
8. **👑 Admin Back Office & Real-time Dashboard**
   - หน้า Admin Login แยกเฉพาะ
   - Dashboard สถิติพร้อมกราฟ **Recharts** (จำนวนสมาชิก, การสุ่ม, ความนิยมของสี)
   - จัดการข้อมูลสี (เพิ่ม, แก้ไข, ลบ, กำหนด Tone, Mood, Style, คู่สี)
   - จัดการคู่สีและคะแนนความเข้ากัน
   - จัดการสมาชิก (ค้นหา, ดูข้อมูล, ระงับ/เปิดใช้งาน)
   - จัดการเนื้อหาและตั้งค่าระบบ
9. **🐙 GitHub Data Connection & Sync Engine**
   - รองรับการดึงข้อมูล สี, คู่สี, Mood, Style จาก GitHub Repository / Raw JSON
   - ระบบตรวจสอบ Schema ความถูกต้องก่อนนำเข้า
   - Loading State, Error State และ Offline Fallback อัตโนมัติ ป้องกันเว็บไซต์ล่ม
   - เมนู Admin สำหรับทดสอบการเชื่อมต่อและกดซิงค์ข้อมูลเข้าฐานข้อมูลได้ทันที
10. **📱 Responsive Smartphone & Mobile-First**
    - ออกแบบรองรับมือถือ แท็บเล็ต เดสก์ท็อป
    - พร้อม **Bottom Navigation** สะดวกต่อการสัมผัสด้วยมือเดียว

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
bracemood/
├── server.ts                    # Backend Server (Express + APIs + Vite Middleware)
├── server/
│   ├── db.ts                    # Online Database Engine (Schemas & CRUD)
│   └── githubSync.ts            # GitHub Data Fetch, Validate & Sync Service
├── database/
│   ├── bracemood_db.json        # Persistent Local & Online Database Store
│   └── github_sync_data.json    # GitHub Repository JSON Bundle Cache
├── src/
│   ├── admin/                   # Admin Back Office Pages & Tabs
│   │   ├── AdminDashboardPage.tsx
│   │   ├── AdminColorsTab.tsx
│   │   ├── AdminPairsTab.tsx
│   │   ├── AdminMembersTab.tsx
│   │   ├── AdminGitHubTab.tsx
│   │   └── AdminSettingsTab.tsx
│   ├── member/                  # Member Specific Pages
│   │   ├── MemberProfilePage.tsx
│   │   ├── MemberSettingsPage.tsx
│   │   └── MyStyleQuizModal.tsx
│   ├── pages/                   # Main Views & Modules
│   │   ├── HomePage.tsx
│   │   ├── RandomizerPage.tsx
│   │   ├── StudioPage.tsx
│   │   ├── CuratedPage.tsx
│   │   ├── FavoritesPage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── ChallengesPage.tsx
│   │   └── AuthModal.tsx
│   ├── components/              # Shared UI Components
│   │   ├── SmileSimulator.tsx
│   │   ├── ScoreCard.tsx
│   │   ├── ShareModal.tsx
│   │   ├── MobileBottomNav.tsx
│   │   └── Toast.tsx
│   ├── services/
│   │   └── api.ts               # Frontend API Client & State Sync
│   ├── data/
│   │   └── colorsData.ts        # Color Definitions & Scoring Algorithms
│   ├── types.ts                 # TypeScript Shared Types & Interfaces
│   ├── App.tsx                  # Main App Routing & Shell
│   ├── main.tsx                 # Client Entry Point
│   └── index.css                # Tailwind CSS Setup
├── .env.example                 # Environment Variables Configuration
├── package.json                 # Dependencies & Build Scripts
├── tsconfig.json                # TypeScript Config
└── vite.config.ts               # Vite Bundler Config
```

---

## ⚙️ วิธีการติดตั้งและรันโปรเจกต์ (Installation & Run)

### 1. โคลน Repository
```bash
git clone https://github.com/your-username/bracemood.git
cd bracemood
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
คัดลอกไฟล์ `.env.example` ไปเป็น `.env`:
```bash
cp .env.example .env
```

แก้ไขค่าใน `.env` ตามต้องการ:
```env
APP_URL="http://localhost:3000"
JWT_SECRET="your-secure-jwt-secret"
GITHUB_DATA_URL="https://raw.githubusercontent.com/bracemood/bracemood-data/main/data.json"
DATABASE_URL=""
ADMIN_DEFAULT_PASSWORD="admin123456"
```

### 4. รันในโหมด Development
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่: `http://localhost:3000`

---

## 🚀 การ Build และ Deploy สู่ Production

### 1. Build โปรเจกต์
```bash
npm run build
```
คำสั่งนี้จะคอมไพล์ Frontend ด้วย Vite ลงโฟลเดอร์ `dist/` และบันเดิล Backend `server.ts` ด้วย esbuild ออกมาเป็น `dist/server.cjs`

### 2. รันในโหมด Production
```bash
npm start
```

### 3. การ Deploy บน Cloud (Google Cloud Run / Render / Railway / Vercel / VPS)
- **Container Port:** แอปพลิเคชันรันบน Port `3000` (Host `0.0.0.0`)
- **Node Version:** Node.js 18+ หรือ 20+
- **Environment Variables:** ตั้งค่า `JWT_SECRET`, `APP_URL`, `DATABASE_URL` ใน Cloud Provider Dashboard

---

## 🔐 ข้อมูลผู้ใช้เริ่มต้นสำหรับทดสอบ (Demo Accounts)

| บทบาท (Role) | อีเมล (Email) | รหัสผ่าน (Password) | หมายเหตุ |
| :--- | :--- | :--- | :--- |
| **ผู้ดูแลระบบ (Admin)** | `admin@bracemood.com` | `admin123456` | เข้าถึงระบบหลังบ้านและ Dashboard ได้ทั้งหมด |
| **สมาชิก (Member)** | `member@bracemood.com` | `member123456` | สมาชิกตัวอย่าง มีประวัติและสีที่บันทึกแล้ว |

---

## 🛡️ นโยบายความปลอดภัย (Security & Privacy)
- ข้อมูลรหัสผ่าน, API Keys และ Secrets จะถูกเก็บไว้ใน Environment Variables บน Server เท่านั้น
- มีการแยก Role อย่างเข้มงวดระหว่าง **Member** (เข้าถึงเฉพาะข้อมูลตนเอง) และ **Admin** (เข้าถึงระบบจัดการ)
- เมื่อ GitHub API ไม่ตอบสนองหรือล่ม ระบบจะ Fallback ไปใช้ข้อมูลที่ผ่านการตรวจสอบในตัวแอปอย่างปลอดภัยโดยอัตโนมัติ
