<div align="center">

# HEISENBERG- 🚀  
### *National Cadet Corps (NCC) Unit – Sri Sai Ram Engineering College*

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](#)
[![Firebase](https://img.shields.io/badge/Firebase-9.0+-FFD700?logo=firebase&logoColor=white)](#)
[![Styled Components](https://img.shields.io/badge/Styled_Components-5.3-DB7093?logo=styled-components&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Deployed-success?style=flat&logo=vercel)](#)

> **A modern, secure, and animated full-stack web portal for the NCC unit**  
> _Empowering cadets. Celebrating discipline. Showcasing excellence._

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2N3a2J0cW5vN2x5eW9zYXR0aW5nZ3JvdXBlc2V0dGluZ3N0YXR1c3F1b3RlL2FuaW1hdGVkLW1pbGl0YXJ5LWJhZGdlcy5naWYoZ3JpZC5jb20%3D%3D&ct=g" alt="NCC Animation" width="300"/>

</div>

---

## 🎯 Project Overview

**HEISENBERG-** is a **React-powered, Firebase-backed** web application designed exclusively for the **NCC Unit of Sri Sai Ram Engineering College**. It serves as a digital hub to:

- Showcase **Army**, **Navy**, and **Air Force** wings
- Highlight **cadets**, **batches**, **events**, and **media**
- Enable **secure admin management** of all content

---

## ✨ Key Features

| Feature | Description |
|-------|-----------|
| **Dynamic SPA** | Built with **React + React Router** for seamless navigation |
| **Smooth Animations** | Powered by **Framer Motion** for engaging transitions |
| **Modular Styling** | **Styled-Components** for clean, reusable CSS |
| **Real-time Backend** | **Firebase Firestore** for live data sync |
| **Secure Admin Panel** | Firebase Auth with **role-based access control** |
| **Media Management** | **Cloudinary** integration for fast image/video hosting |
| **Responsive Design** | Mobile-first layout using CSS Grid & Flexbox |

---

## 🧑‍💻 Tech Stack

Libraries & Tools

React Hooks (useState, useEffect, useContext)
Firebase SDK v9+ (modular)
Cloudinary Upload Widget
React Toastify for notifications
Vite / CRA for fast builds
ESLint + Prettier for code quality

---

📂 Project Structure

src/
├── components/       # Reusable UI components
│   ├── Navbar.jsx
│   ├── CadetCard.jsx
│   ├── AnimatedSection.jsx
│   └── AdminForm.jsx
├── pages/            # Route pages
│   ├── Home.jsx
│   ├── Wing.jsx
│   ├── Gallery.jsx
│   └── AdminDashboard.jsx
├── context/          # Auth & Global State
│   └── AuthContext.jsx
├── firebase/         # Firebase config & services
│   ├── firebase.js
│   └── firestore.js
├── styles/           # Global themes & animations
├── assets/           # Images, icons, animations
└── App.jsx, index.js

---

🛠️ Setup & Installation
Prerequisites

Node.js (>=16)
npm or yarn
Firebase Project
Cloudinary Account

📊 Statistics (Live Data)
<img width="1000" height="261" alt="image" src="https://github.com/user-attachments/assets/d5dc4e4b-1479-496b-a21b-6a73b4481bb8" />

<img width="988" height="625" alt="image" src="https://github.com/user-attachments/assets/166771e6-c51a-49d8-b57d-a9150a189883" />

🎨 Animations & UX Highlights

Page Transitions using Framer Motion
Hover Effects on cadet cards
Lazy-loaded Images with shimmer
Scroll-triggered Animations
Dark Mode Toggle (coming soon)

📝 License
Distributed under the MIT License. See LICENSE for more information.

AI USED
1. Gemini - for fetching code
2. Napkin AI - for generating flowcharts
3. OpenAI API - for creating AI CHAT BOT


👨‍✈️ Project By
Karthik Jayaram S K
NCC Cadet | Full-Stack Developer | Sri Sai Ram Engineering College
<img src="https://img.shields.io/github/followers/KarthikJayaram-SK?label=Follow&#x26;style=social" alt="GitHub">

"Discipline. Duty. Devotion."
HEISENBERG- — Built for the Brave.
<img src="https://raw.githubusercontent.com/KarthikJayaram-SK/HEISENBERG-/main/public/ncc-logo.png" width="100"/>

```


```mermaid
graph TD
    A[Frontend] --> B[React 18]
    A --> C[React Router]
    A --> D[Styled Components]
    A --> E[Framer Motion]

    F[Backend] --> G[Firebase Auth]
    F --> H[Firestore Database]
    F --> I[Firebase Storage]

    J[Media] --> K[Cloudinary CDN]




    style A fill:#61DAFB,stroke:#333,color:white
    style F fill:#FFCA28,stroke:#333,color:black
    style J fill:#FFA726,stroke:#333,color:black
