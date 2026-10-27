# RentNest - Simple Rental Property Listing Website

A clean, modern, and user-friendly **Rental Property Listing Website** built with **React.js, JavaScript, Node.js, Express.js, and MongoDB**.

This project connects tenants with property retailers/owners directly through verified phone numbers, with zero brokerage or middleman interference.

---

## 🌟 Key Features

### 👤 Tenant / Home Seeker Features
- **Browse Properties:** View houses, flats, and luxury apartments in an intuitive card layout.
- **Advanced Filtering:** Filter listings by:
  - Property Type (House, Flat, Apartment)
  - Furnishing Status (Furnished, Semi-Furnished, Unfurnished)
  - Rent Range (Under ₹20k, ₹20k-₹40k, ₹40k-₹70k, Above ₹70k)
  - Number of Bedrooms (1 BHK, 2 BHK, 3 BHK, 4+ BHK)
  - Location/Keyword Search (e.g., Bandra, Powai, Indiranagar)
  - Sorting (Newest, Rent: Low to High, Rent: High to Low)
- **Property Details Page:** Complete overview with high-res photos, rent badges, full room specs, amenities list, and detailed description.
- **Direct Owner Contact:** Prominent owner phone number with one-click **"Call Retailer Directly"** (`tel:...`) and **"Chat via WhatsApp"** buttons.

### 🏢 Property Retailer / Owner Features
- **Retailer Registration & Login:** Create a dedicated owner account to manage listings.
- **Separate Retailer Dashboard:**
  - Portfolio summary metrics (Active Listings, Total Monthly Rent, Type Breakdown).
  - **Add New Property:** Upload title, property type, location, city, monthly rent, bedrooms, bathrooms, furnishing status, phone number, image URL (with quick image presets), and amenities.
  - **Edit Property:** Update pricing, contact numbers, or photos at any time.
  - **Delete Property:** Remove outdated or rented properties with safe confirmation dialogs.
  - Access control: Retailers can only modify or delete their own listings.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, JavaScript (ES6+), React Router v7, Lucide Icons, Modern Vanilla CSS Design System |
| **Backend** | Node.js (v22), Express.js (v4), REST APIs |
| **Database** | MongoDB & Mongoose (with automated persistent fallback store if MongoDB server is offline) |
| **Auth** | JWT (JSON Web Tokens) & bcryptjs password hashing |

---

## 🚀 Quick Start Guide

## 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Optional: local MongoDB or MongoDB Atlas URI. If not installed, the project automatically uses resilient local file storage so you can review it immediately!)

### 2. Installation
From the root workspace directory:
```bash
# Install root orchestration tools
npm install

# Install server packages
cd server
npm install

# Install client packages
cd ../client
npm install
```

### 3. Running the Project
From the root directory, simply run:
```bash
npm run dev
```

This starts:
- 🚀 **Backend Server:** `http://localhost:5000`
- 💻 **Frontend React App:** `http://localhost:5173`

---

## 🔑 Demo Login Accounts

For testing, evaluation, and presentations, the following demo accounts are pre-seeded:

| Role | Email | Password | Phone |
|---|---|---|---|
| **Property Owner / Retailer** | `retailer@example.com` | `password123` | +91 98765 43210 |
| **Tenant / User** | `user@example.com` | `password123` | +91 98111 22334 |

*(Tip: On the Login Page, you can also click the **"Owner Demo"** or **"Tenant Demo"** quick-fill buttons!)*

---

## 📡 REST API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new tenant or retailer account
- `POST /api/auth/login` - Authenticate user and receive JWT token
- `GET /api/auth/me` - Fetch profile of currently logged-in user (Private)

### Properties (`/api/properties`)
- `GET /api/properties` - List properties with filtering (`?type=&furnishing=&bedrooms=&minRent=&maxRent=&search=&sort=`)
- `GET /api/properties/recent` - Top 6 recently listed properties for homepage
- `GET /api/properties/stats` - Counts of Houses, Flats, Apartments, and Total
- `GET /api/properties/:id` - Single property details with retailer info
- `GET /api/properties/my/listings` - List logged-in retailer's own properties (Private, Retailer only)
- `POST /api/properties` - Add a new property (Private, Retailer only)
- `PUT /api/properties/:id` - Edit a property listing (Private, Owner only)
- `DELETE /api/properties/:id` - Delete a property listing (Private, Owner only)

---

## 📂 Project Architecture

```
project fsd/
├── client/                     # Frontend (React.js + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, PropertyCard, FilterBar, ProtectedRoute
│   │   ├── context/            # AuthContext (JWT session management)
│   │   ├── pages/              # Home, Properties, Details, Login, Register, Dashboard
│   │   ├── services/           # Centralized API fetch client
│   │   ├── App.jsx             # Routes & Layout
│   │   ├── index.css           # Modern design system & responsive styling
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js          # Reverse proxy to backend
├── server/                     # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js               # MongoDB connection handler
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, Profile
│   │   └── propertyController.js # CRUD & filtering
│   ├── data/
│   │   ├── seedData.js         # Realistic pre-seeded properties & users
│   │   └── storage.js          # Mongoose + fallback repository layer
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT protect & retailerOnly authorization
│   ├── models/
│   │   ├── User.js             # Mongoose User Schema
│   │   └── Property.js         # Mongoose Property Schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── propertyRoutes.js
│   ├── server.js               # Express entrypoint
│   └── .env                    # Config (PORT, MONGODB_URI, JWT_SECRET)
├── package.json                # Root scripts (npm run dev)
└── README.md                   # Complete documentation
