<div align="center">
  <h1>🔍 QRkFind</h1>
  <p><strong>Smart QR-Based Lost Item Recovery Platform</strong></p>

  <p>
    <a href="https://github.com/Paradoxai77/QRkFind/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/Paradoxai77/QRkFind?style=for-the-badge&color=2563eb" alt="License" />
    </a>
    <a href="https://github.com/Paradoxai77/QRkFind/stargazers">
      <img src="https://img.shields.io/github/stars/Paradoxai77/QRkFind?style=for-the-badge&color=F59E0B" alt="Stars" />
    </a>
    <a href="https://github.com/Paradoxai77/QRkFind/network/members">
      <img src="https://img.shields.io/github/forks/Paradoxai77/QRkFind?style=for-the-badge&color=7C3AED" alt="Forks" />
    </a>
    <a href="https://github.com/Paradoxai77/QRkFind">
      <img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4-EF4444?style=for-the-badge" alt="Made with Love" />
    </a>
  </p>
</div>

---

<p align="center">
  <i>Never lose your valuables again—generate secure, privacy-first QR codes for your items and get instantly notified via email with GPS location when someone scans and reports them.</i>
</p>

---

<details>
  <summary>📋 Table of Contents</summary>
  <ol>
    <li><a href="#-overview">✨ Overview</a></li>
    <li><a href="#-key-features">🚀 Key Features</a></li>
    <li><a href="#-live-demo--endpoints">🔗 Live Demo & Endpoints</a></li>
    <li><a href="#-tech-stack">🛠️ Tech Stack</a></li>
    <li><a href="#-security-privacy--reliability-architecture">🔒 Security, Privacy & Reliability Architecture</a></li>
    <li><a href="#-how-it-works">⚙️ How It Works</a></li>
    <li><a href="#-api-endpoint-reference">🌐 API Endpoint Reference</a></li>
    <li><a href="#-installation--setup">📦 Installation & Setup</a></li>
    <li><a href="#-screenshots--preview">📸 Screenshots / Preview</a></li>
    <li><a href="#-roadmap--versioning">🗺️ Roadmap & Versioning</a></li>
    <li><a href="#-contributing">🤝 Contributing</a></li>
    <li><a href="#-license">📄 License</a></li>
    <li><a href="#-author--contact">👤 Author / Contact</a></li>
  </ol>
</details>

---

## ✨ Overview

We've all experienced the panic of misplacing a wallet, keys, or a laptop. Traditional recovery methods rely on printing personal phone numbers directly on tags—exposing sensitive contact information to anyone who glances at your belongings.

**QRkFind** bridges the gap between fast lost-item recovery and strict personal privacy:
- **Zero Contact Exposure**: Finders can instantly message you and share their real-time GPS location through a simple QR scan—without ever seeing your name, phone number, or email address.
- **Cryptographic Identifiers**: Items are indexed by cryptographically random 12-character NanoIDs, preventing malicious URL guessing and enumeration attacks.
- **Dual-Mode Persistence**: Runs out-of-the-box locally with zero setup using an atomic JSON database, or seamlessly connects to MongoDB Atlas for cloud production deployment.

Whether it is your backpack, key ring, pet collar, or travel luggage, QRkFind provides a modern, secure, and instant way to bring your lost valuables back home.

---

## 🚀 Key Features

* 🔐 **Secure JWT Authentication** — Robust user sign-up and login with cryptographically salted password hashing (`bcryptjs`, 12 salt rounds) and 7-day token persistence.
* 📦 **Valuables Registry** — Register and organize your items with specific categories, detailed descriptions, and uploaded photos.
* 🔳 **Smart QR Label Generator** — Create unique, high-resolution QR codes for each item, downloadable as crisp PNGs or print-ready labels.
* 🌍 **Privacy-First Finder Portal** — A public, login-free portal for finders to submit reports without ever exposing the owner's private contact details.
* 📍 **Robust GPS Location Capture** — Integrated with browser Geolocation with full validation, graceful handling of denied permissions, and coordinate verification.
* 📧 **Instant Email Alerts** — HTML emails sent automatically via Nodemailer containing finder contact info, custom notes, and direct links to maps.
* 🗺️ **Interactive OpenStreetMap Integration** — Visualizes the exact location of each found report directly in your dashboard with Leaflet-powered maps.
* 🔔 **Centralized Notifications Inbox** — A consolidated feed tracking all found reports across all items with read/unread statuses.
* 🛡️ **Strict IDOR Protection** — Complete authorization checks ensuring no user can view, edit, or delete another user's items or notifications.
* 📱 **Mobile-First Responsive UI** — Dark/Light theme support, custom glassmorphism, and responsive Tailwind CSS layout.

---

## 🔗 Live Demo & Endpoints

| Resource | URL | Status / Notes |
|---|---|---|
| 🌐 **Live Web Application** | [paradoxai77.github.io/QRkFind](https://paradoxai77.github.io/QRkFind/) | Hosted on GitHub Pages with automated CI/CD |
| ⚡ **Live Backend API** | [qrkfind-backend.onrender.com](https://qrkfind-backend.onrender.com) | Deployed on Render Cloud Services |
| 🩺 **Backend Health Diagnostic** | [qrkfind-backend.onrender.com/api/health](https://qrkfind-backend.onrender.com/api/health) | Reports server uptime and database connectivity |

### 🎯 Presentation & Live Testing Walkthrough
To demonstrate QRkFind in action during presentations or grading:
1. **Create an Account**: Visit the [Live Web Application](https://paradoxai77.github.io/QRkFind/), click **Register**, and create a user account.
2. **Register a Valued Item**: Click **Add Item** in the Dashboard, choose a category (e.g. *Keys*, *Backpack*, *Laptop*), and click **Create**.
3. **Inspect the QR Code**: Click on the item to open its details card. You will see the generated QR code and public recovery link.
4. **Simulate a Finder**: Open the item's public recovery link in a private/incognito window (or scan it with a mobile device). Notice that **none** of the owner's contact info is exposed.
5. **Test GPS Location**:
   - Click **Share Location** to test browser geolocation permission and coordinate capture.
   - Alternatively, test submitting **without** location (or with denied permissions) to verify graceful fallback handling.
6. **Verify Owner Alerts**: Return to the authenticated owner dashboard. The notification will appear instantly with finder details and Leaflet map coordinates.

---

## 🛠️ Tech Stack

### Comprehensive Component Breakdown

| Layer | Technology | Version | Purpose in QRkFind |
|---|---|---|---|
| **Frontend Framework** | React | `^18.3.1` | Component-driven declarative user interface |
| **Build Tool** | Vite | `^5.4.15` | High-speed local dev server and optimized production bundler |
| **Styling & Design** | Tailwind CSS | `^3.4.4` | Responsive utilities, customized color palette, dark mode |
| **Routing** | React Router DOM | `^6.24.0` | Client-side routing, protected auth routes, dynamic item pages |
| **Mapping Engine** | Leaflet + React-Leaflet | `^1.9.4` / `^4.2.1` | Interactive OpenStreetMap rendering for finder GPS coordinates |
| **Icons & UI Feedback** | Lucide React + React Hot Toast | `^0.400.0` / `^2.4.1` | Modern icon library and responsive toast notification feedback |
| **QR Code Engine** | node-qrcode | `^1.5.3` | High-density vector and raster QR code generation |
| **Backend Runtime** | Node.js + Express | `v18+` / `^4.21.2` | RESTful API server, route middleware, static assets delivery |
| **Database (Dual Mode)** | MongoDB + Mongoose | `^8.4.1` | Production schema modeling, document validation, and indexing |
| **Database (Mock Mode)** | Local JSON Store (`mockDb`) | Custom | Zero-setup, offline testing mode requiring no local MongoDB install |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) | `^9.0.2` | Stateless cryptographic bearer token session management |
| **Password Security** | `bcryptjs` | `^2.4.3` | Cryptographic password hashing using 12 salt rounds |
| **Email Dispatch** | Nodemailer | `^6.9.13` | Asynchronous HTML notification dispatch with graceful error isolation |
| **File Uploads** | Multer | `^1.4.5-lts.1` | Multipart form handler for item photos with MIME-type filtering |
| **CI/CD & Hosting** | GitHub Actions + Render | — | Automated static build pipeline and auto-scaling backend hosting |

---

## 🔒 Security, Privacy & Reliability Architecture

```
Finder Scans QR (12-char NanoID)
       │
       ▼
Public API: /api/found/:itemId
 ├── [1] Privacy Check: Returns ONLY public item metadata (Owner contact info is NEVER disclosed)
 ├── [2] GPS Validation: Validates finite, bounded coordinates (-90° <= lat <= 90°, -180° <= lng <= 180°)
 ├── [3] Database Resilience: Atomic insert into FoundReports collection
 ├── [4] Email Isolation: Non-blocking dispatch; failure does not break report persistence
 └── [5] Truthful Response: Distinguishes between email delivery vs. direct dashboard inbox save
```

### 1. Insecure Direct Object Reference (IDOR) Protection
All private user endpoints enforce cryptographic ownership validation against `req.user.id`:
- `GET /api/items/:id` — Ensures the requesting user matches `item.owner`.
- `PATCH /api/items/:id/status` — Prevents unauthorized users from toggling item states.
- `DELETE /api/items/:id` — Guarantees items and their cascade reports can only be purged by their rightful owner.
- `PATCH /api/items/reports/:reportId/read` — Verifies that the report's parent item belongs to the authenticated user.

### 2. Privacy-Preserving Finder Architecture
When a finder navigates to `https://paradoxai77.github.io/QRkFind/found/:itemId`:
- The backend endpoint `GET /api/found/:itemId` strictly filters response fields to `{ itemId, name, category, description, status }`.
- Owner email addresses, real names, and phone numbers are **completely isolated** from the public response payload.

### 3. Cryptographic Item Identifiers
Sequential database IDs (`/items/1`, `/items/2`) allow attackers to easily crawl and enumerate registered items. QRkFind generates **12-character cryptographically secure NanoIDs** (`nanoid(12)`), providing over $10^{21}$ unique combinations and preventing enumeration.

### 4. Robust GPS Verification & Fallback
- Finders can voluntarily grant GPS location to help the owner find the item.
- The system handles browser permissions (`PERMISSION_DENIED`), GPS hardware issues (`POSITION_UNAVAILABLE`), and network timeouts gracefully.
- The server validates all incoming coordinates (`typeof lat === 'number'`, valid geographical limits). If location is withheld or invalid, it is strictly stored as `{ lat: null, lng: null }` and marked as **"Location not shared"**—never falsely indicated as verified.

### 5. Email & Database Error Resilience
- If email credentials (`EMAIL_USER`, `EMAIL_PASS`) are missing or rejected by the SMTP provider, the report is still safely saved to the database.
- The API returns a truthful status code and message indicating whether an email was sent or stored directly in the owner's dashboard inbox.
- Health check endpoints (`/health` and `/api/health`) dynamically report the live database connection status.

---

## ⚙️ How It Works

### The User Journey
```
+----------------+      1. Register Item       +------------------+
|                | --------------------------> |                  |
|  Item Owner    |      2. Print & Attach QR   |   QRkFind App    |
|  (Dashboard)   | <-------------------------- |   (React/Vite)   |
|                |                             +------------------+
+----------------+                                      |
        ^                                               | 3. Scan QR &
        |                                               |    Submit Report
        | 5. Email Alert (Nodemailer)                   v
        |                                      +------------------+
        +------------------------------------- |  Finder Portal   |
                                               |  (Public Page)   |
                                               +------------------+
```

1. **Register Valuables**: Create an account and register your items (backpack, keys, pet collar, laptop).
2. **Generate & Attach QR**: Download the custom QR label and print or stick it to your belongings.
3. **Loss & Scan**: If an item is lost, anyone scanning the QR is directed to the secure Finder Portal.
4. **Instant Notification**: The finder submits their contact info and optional GPS location.
5. **Safe Recovery**: The owner receives an immediate alert via email and in their dashboard notification inbox.

---

## 🌐 API Endpoint Reference

| Method | Endpoint | Auth | Purpose |
|---|---|:---:|---|
| `POST` | `/api/auth/register` | No | Register a new user account |
| `POST` | `/api/auth/login` | No | Authenticate user and receive JWT bearer token |
| `GET` | `/api/auth/me` | Yes | Verify token and fetch current session profile |
| `GET` | `/api/items` | Yes | List all items belonging to the authenticated user |
| `POST` | `/api/items` | Yes | Register a new item with optional photo upload |
| `GET` | `/api/items/:id` | Yes | Fetch single item details and all related finder reports |
| `PATCH` | `/api/items/:id/status` | Yes | Update item recovery status (`active`, `lost`, `recovered`) |
| `DELETE` | `/api/items/:id` | Yes | Delete item and cascade-delete all its reports |
| `GET` | `/api/items/notifications/all`| Yes | Consolidated notifications feed across all user items |
| `PATCH` | `/api/items/reports/:reportId/read` | Yes | Mark a specific found report as read |
| `GET` | `/api/found/:itemId` | No | Fetch public item metadata for finders (zero owner data leaked) |
| `POST` | `/api/found/:itemId` | No | Submit finder report with contact details and verified GPS |
| `GET` | `/health` | No | Uptime monitoring and database diagnostic endpoint |
| `GET` | `/api/health` | No | API health check reporting database connection status |

---

## 📦 Installation & Setup

### Prerequisites
* **Node.js** v18+ — [Download](https://nodejs.org/)
* **MongoDB** (Local, MongoDB Atlas, or use the built-in **Mock DB mode** for instant execution without installing MongoDB).
* **Gmail App Password** *(optional)* — For testing outbound email alerts.

### 1. Clone the Repository
```bash
git clone https://github.com/Paradoxai77/QRkFind.git
cd QRkFind
```

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory:

```env
PORT=5001
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173

# Set to 'true' to run database locally in uploads/db.json (no MongoDB install required)
USE_MOCK_DB=true

# If using MongoDB Atlas or local MongoDB service:
# USE_MOCK_DB=false
# MONGODB_URI=mongodb://localhost:27017/qrkfind

# Optional: Outbound Gmail notifications
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASS=your_gmail_app_password
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 4. Run the Development Servers
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📸 Screenshots / Preview

| Dashboard Overview | Item QR & Details | Finder Report Portal |
| :---: | :---: | :---: |
| ![Dashboard Overview](https://raw.githubusercontent.com/Paradoxai77/QRkFind/main/client/public/dashboard-preview.png) | ![Item QR Details](https://raw.githubusercontent.com/Paradoxai77/QRkFind/main/client/public/item-qr-preview.png) | ![Finder Form](https://raw.githubusercontent.com/Paradoxai77/QRkFind/main/client/public/finder-preview.png) |

---

## 🗺️ Roadmap & Versioning

### ✅ Version 1.0 (Current Stable Release)
- [x] Secure JWT user authentication with cryptographically salted `bcryptjs` hashing.
- [x] 12-character cryptographic NanoID item keys preventing URL enumeration.
- [x] High-resolution printable QR code generator per item.
- [x] Privacy-first public finder submission portal with zero owner data disclosure.
- [x] Full Geolocation API integration with coordinate validation and fallback handling.
- [x] Leaflet OpenStreetMap interactive location rendering in owner dashboard.
- [x] Dual-mode database persistence (MongoDB Atlas + Zero-setup Mock JSON database).
- [x] Asynchronous email notifications with HTML templates.
- [x] IDOR protection across all item and report management routes.
- [x] Continuous integration and automated deployment to GitHub Pages and Render.

### 🚀 Version 2.0 (Planned Future Work)
- [ ] **Mobile Web Push Notifications** — Real-time browser notifications via the Web Push API and Service Workers.
- [ ] **Anonymous In-App Chat** — Temporary WebSocket or WebRTC chat room between finder and owner.
- [ ] **NFC Tag Integration** — Direct reading and writing of item URLs to physical NFC stickers.
- [ ] **Automated SMS Alerts** — Optional SMS notification dispatch powered by Twilio.
- [ ] **Multi-Language Internationalization (i18n)** — Localized finder forms for global travelers.

---

## 🤝 Contributing

Contributions make the open-source community an inspiring place to learn and build:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## 👤 Author / Contact

**Pratik Nerpagar**
* GitHub: [@Paradoxai77](https://github.com/Paradoxai77)
* Email: [pratiknerpagar2@gmail.com](mailto:pratiknerpagar2@gmail.com)

---

<p align="center">
  <i>If this project helped you or you find it useful, please consider giving it a ⭐ on GitHub!</i>
</p>
