# 🔍 FindIt — Smart QR-Based Lost Item Recovery Platform

> Never lose your things again. Generate QR codes for your valuables and get instantly notified when someone finds them.

![FindIt](https://img.shields.io/badge/FindIt-Smart%20QR%20Recovery-2563EB?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=nodedotjs)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login/register with persistent sessions
- 📦 **Item Management** — Register items with categories, descriptions, and photos
- 🔳 **QR Code Generation** — Unique QR per item, downloadable as PNG or print-ready label
- 🌍 **Public Found Page** — No login required for finders; privacy-first design
- 📍 **GPS Location Capture** — Finder can share their location via browser Geolocation API
- 📧 **Email Notifications** — Beautiful HTML email sent to owner on every finder report
- 🗺️ **Interactive Map** — OpenStreetMap embed for each found report with GPS data
- 🔔 **Notifications Page** — All found reports across all items in one place
- 📱 **Mobile-First UI** — Fully responsive with Tailwind CSS

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Routing | React Router v6 |
| HTTP Client | Axios |
| QR Code | qrcode |
| Maps | react-leaflet + OpenStreetMap |
| Toasts | react-hot-toast |
| Icons | lucide-react |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Email | Nodemailer (Gmail SMTP) |
| File Upload | multer |
| ID Generation | nanoid |

---

## 📁 Project Structure

```
QR/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── pages/             # Landing, Login, Register, Dashboard, AddItem, ItemDetail, FoundPage, Notifications
│   │   ├── components/        # Navbar, QRCard, ItemCard, Modal, StatusBadge, SkeletonCard, ProtectedRoute
│   │   ├── context/           # AuthContext (JWT management)
│   │   └── utils/             # api.js (Axios), dateFormat.js
│   ├── index.html
│   ├── vite.config.js         # Proxy /api → localhost:5001
│   └── tailwind.config.js
│
└── server/                    # Express backend
    ├── models/                # User, Item, FoundReport (Mongoose)
    ├── routes/                # auth.js, items.js, found.js
    ├── middleware/            # authMiddleware.js (JWT verify)
    ├── utils/                 # sendEmail.js (Nodemailer HTML template)
    ├── uploads/               # Item photos (auto-created by multer)
    ├── server.js              # Entry point
    └── .env                   # Environment variables
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **MongoDB** — Either:
  - Local: [Install MongoDB Community](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier available)
  - **Mock DB Mode (Zero Setup)**: No local MongoDB installation needed! Just set `USE_MOCK_DB=true` in `server/.env` to run with an automatic local file database (stored in `server/uploads/db.json`).
- **Gmail App Password** (for email notifications):
  1. Enable 2FA on your Google account
  2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
  3. Generate an App Password for "Mail"

---

### 1. Configure Environment Variables

Open `server/.env` and fill in your values:

```env
MONGODB_URI=mongodb://localhost:27017/findit
JWT_SECRET=your_long_random_secret_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
CLIENT_URL=http://localhost:5173
PORT=5001

# Mock DB fallback (set to true to run without a local MongoDB service)
USE_MOCK_DB=true
```

> **MongoDB Atlas**: Replace `MONGODB_URI` with your Atlas connection string, e.g.:
> `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/findit` (And make sure `USE_MOCK_DB` is set to `false`).

---

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### 3. Run the Application

Open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# ✅ MongoDB connected
# 🚀 FindIt server running on http://localhost:5001
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# ➜ Local: http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📖 How to Use

1. **Register** → Create an account at `/register`
2. **Add Item** → Go to Dashboard → "Add Item" → fill in name, category, optional description/photo
3. **Get QR Code** → Download the PNG QR label or print it directly
4. **Attach QR** → Print and stick the QR code on your item
5. **Someone Finds It** → They scan the QR code (no app needed!)
6. **They Submit a Report** → They fill in their contact info and optionally share GPS location
7. **You Get Notified** → An email is sent to you instantly with all finder details

---

## 🔐 Security Notes

- All passwords are hashed with **bcryptjs** (12 salt rounds)
- Item IDs are **random nanoid strings** — not sequential or guessable
- The public `/found/:itemId` page **never exposes** the owner's name, email, or phone
- All dashboard routes are protected by **JWT middleware**
- JWTs expire after **7 days**

---

## 🎨 Color Palette

| Color | Hex | Usage |
|---|---|---|
| Primary Blue | `#2563EB` | Buttons, links, primary actions |
| Accent Green | `#10B981` | Active status, success states |
| Amber | `#F59E0B` | Lost status, warnings |
| Background | `#F8FAFC` | Page background |
| Ink | `#0F172A` | Primary text |

---

## 📧 Email Notifications

When a finder submits a report, the item owner receives a beautiful HTML email with:
- Finder's name, phone, and email
- Their message
- Google Maps link (if GPS was shared)
- Timestamp
- Direct link to the dashboard

> **Note:** Emails are sent via Gmail SMTP (Nodemailer). If email credentials are not configured, the report is still saved and accessible in the dashboard — email failure is non-fatal.

---

## 🗺️ QR Code URLs

In development, QR codes encode:
```
http://localhost:5173/found/{itemId}
```

For production, set `VITE_PUBLIC_URL` in `client/.env`:
```env
VITE_PUBLIC_URL=https://your-domain.com
```
And update `QRCard.jsx` to use `import.meta.env.VITE_PUBLIC_URL`.

---

## 📦 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login and get JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/items` | Yes | List user's items |
| POST | `/api/items` | Yes | Create new item |
| GET | `/api/items/:id` | Yes | Get item + found reports |
| PATCH | `/api/items/:id/status` | Yes | Update item status |
| DELETE | `/api/items/:id` | Yes | Delete item |
| GET | `/api/items/notifications/all` | Yes | All reports across all items |
| GET | `/api/found/:itemId` | No | Public item info |
| POST | `/api/found/:itemId` | No | Submit finder report |

---

## 🤝 Contributing

Pull requests welcome! For major changes, please open an issue first.

---

*Made with ❤️ — FindIt Team*
