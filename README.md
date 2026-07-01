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
    <li><a href="#-live-demo">🔗 Live Demo</a></li>
    <li><a href="#-tech-stack">🛠️ Tech Stack</a></li>
    <li><a href="#-how-it-works">⚙️ How It Works</a></li>
    <li><a href="#-installation--setup">📦 Installation & Setup</a></li>
    <li><a href="#-usage">💻 Usage</a></li>
    <li><a href="#-screenshots--preview">📸 Screenshots / Preview</a></li>
    <li><a href="#-roadmap">🗺️ Roadmap</a></li>
    <li><a href="#-contributing">🤝 Contributing</a></li>
    <li><a href="#-license">📄 License</a></li>
    <li><a href="#-author--contact">👤 Author / Contact</a></li>
  </ol>
</details>

---

## ✨ Overview

We've all experienced the panic of misplacing a wallet, keys, or a laptop. Traditional recovery methods rely on printing phone numbers directly on tags—exposing your personal contact information to anyone who looks.

**QRkFind** bridges the gap between item recovery and personal privacy. By generating unique, non-sequential QR codes for your valuables, finders can instantly contact you and securely share their GPS location through a simple scan, all without ever seeing your name, phone number, or email address.

Whether it is your backpack, key ring, pet collar, or travel luggage, QRkFind provides a modern, secure, and instant way to bring your lost valuables back home.

---

## 🚀 Key Features

* 🔐 **Secure JWT Authentication** — Robust user sign-up and login with cryptographically hashed passwords (`bcryptjs`) and 7-day token persistence.
* 📦 **Valuables Registry** — Register and organize your items with specific categories, description details, and uploaded photos.
* 🔳 **Smart QR Label Generator** — Create unique, high-resolution QR codes for each item, instantly downloadable as PNG or print-ready labels.
* 🌍 **Privacy-First Finder Portal** — A public, login-free portal for finders to submit reports without ever exposing your private contact details.
* 📍 **GPS Location Capture** — Integrated with the browser Geolocation API to allow finders to securely share coordinates of the found item.
* 📧 **Instant Email Alerts** — Beautiful HTML emails sent automatically via Nodemailer containing finder info, custom messages, and direct links to maps.
* 🗺️ **Interactive OpenStreetMap** — Visualizes the exact location of each found report directly in your dashboard with Leaflet-powered maps.
* 🔔 **Centralized Notifications** — A consolidated inbox tracking all found reports, response status, and recovery updates.
* 📱 **Fully Responsive UI** — Mobile-first, fluid layout meticulously crafted with React and Tailwind CSS.

---

## 🔗 Live Demo

<p align="center">
  <a href="https://paradoxai77.github.io">
    <img src="https://img.shields.io/badge/Demo-Launch_App-2563EB?style=for-the-badge&logo=rocket&logoColor=white" alt="Live Demo" />
  </a>
  &nbsp;&nbsp;
  <a href="https://render.com/deploy?repo=https://github.com/Paradoxai77/QRkFind">
    <img src="https://render.com/images/deploy-to-render.svg" alt="Deploy to Render" height="40" />
  </a>
</p>

---

## 🛠️ Tech Stack

### Frontend
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)

### Backend & Database
[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JSON Web Tokens](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-339933?style=for-the-badge&logo=nodemailer&logoColor=white)](https://nodemailer.com/)

---

## ⚙️ How It Works

### The User Journey

1. **Register Valuables**: Create an account and add details for your valuables (backpack, keys, etc.).
2. **Generate & Print QR**: Print the generated QR code and stick/attach it to your item.
3. **Loss & Discovery**: If the item is lost, a finder scans the QR code.
4. **Instant Notification**: The finder submits a form with their contact info and location, instantly sending you an email alert.

### System Architecture Flow Diagram

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

<details>
  <summary>🔒 Security & Privacy Flow Details</summary>

* All passwords are encrypted using `bcryptjs` with 12 rounds of salts.
* Item IDs are randomly generated cryptographically secure strings (`nanoid`) rather than sequential auto-incrementing integers, preventing unauthorized users from guessing item URLs.
* Finder report submission is completed without disclosing any owner details (name, email, or telephone number) in the front-end or API response.
</details>

<details>
  <summary>🌐 API Endpoint Reference Table</summary>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login and get JWT |
| GET | `/api/auth/me` | Yes | Get current user details |
| GET | `/api/items` | Yes | List user's items |
| POST | `/api/items` | Yes | Create new item |
| GET | `/api/items/:id` | Yes | Get specific item details + found reports |
| PATCH | `/api/items/:id/status` | Yes | Update item status (e.g. Lost/Found) |
| DELETE | `/api/items/:id` | Yes | Delete item from database |
| GET | `/api/items/notifications/all` | Yes | All reports across all items |
| GET | `/api/found/:itemId` | No | Public item info for finders |
| POST | `/api/found/:itemId` | No | Submit finder report |
</details>

---

## 📦 Installation & Setup

### Prerequisites
* **Node.js** v18+ — [Download](https://nodejs.org/)
* **MongoDB** — Local or MongoDB Atlas (or use **Mock DB mode** for zero-setup execution).
* **Gmail App Password** (optional, for email alerts) — [Generate here](https://myaccount.google.com/apppasswords).

### 1. Clone & Configure Project

```bash
# Clone the repository
git clone https://github.com/Paradoxai77/QRkFind.git
cd QRkFind
```

Create a `.env` file in the `server` directory and add your settings:

```env
MONGODB_URI=mongodb://localhost:27017/qrkfind
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
PORT=5001

# Enable Mock DB mode to run database locally in a file (no MongoDB install required)
USE_MOCK_DB=true
```

### 2. Install Dependencies

```bash
# Install Server (Backend) Dependencies
cd server
npm install

# Install Client (Frontend) Dependencies
cd ../client
npm install
```

### 3. Run the Application

Open **two terminal windows**:

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

## 💻 Usage

* **Step 1: Sign Up**: Go to the `/register` page and create a secure account.
* **Step 2: Add Item**: Visit your Dashboard, click "Add Item", fill out the category and details, and save.
* **Step 3: Save QR Label**: Click on the item's details card, view the QR code, and click "Download PNG" or print it.
* **Step 4: Scan Test**: Try scanning the QR code with your phone. You'll be redirected to the secure public Finder portal, where you can submit a test report with mock GPS location sharing.
* **Step 5: View Notifications**: Check the Dashboard's notifications tab or check your configured email to see the real-time location and contact report details.

---

## 📸 Screenshots / Preview

| Dashboard Overview | Item QR & Details | Finder Report Portal |
| :---: | :---: | :---: |
| ![Dashboard Overview](https://raw.githubusercontent.com/Paradoxai77/QRkFind/main/client/public/dashboard-preview.png) | ![Item QR Details](https://raw.githubusercontent.com/Paradoxai77/QRkFind/main/client/public/item-qr-preview.png) | ![Finder Form](https://raw.githubusercontent.com/Paradoxai77/QRkFind/main/client/public/finder-preview.png) |

---

## 🗺️ Roadmap

- [x] JWT Authentication & Secure Session Store
- [x] Print-ready QR Code Generation per item
- [x] Finder public portal with GPS location sharing
- [x] Auto-email notifications using Nodemailer with HTML templates
- [x] OpenStreetMap interactive maps integration
- [ ] Mobile push notifications (Web Push API)
- [ ] Secure in-app anonymous chat between finder and owner
- [ ] NFC tag integration support
- [ ] Multi-language localization support

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](file:///c:/Users/prati/QR/LICENSE) for more information.

---

## 👤 Author / Contact

**Pratik Nerpagar**
* GitHub: [@Paradoxai77](https://github.com/Paradoxai77)
* Email: [pratiknerpagar2@gmail.com](mailto:pratiknerpagar2@gmail.com)

---

<p align="center">
  <i>If this project helped you or you find it useful, please consider giving it a ⭐ on GitHub! It means a lot to the creators.</i>
</p>
