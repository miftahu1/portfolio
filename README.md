# Mifta.dev Portfolio

A premium, production-grade personal portfolio website built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and Firebase.

## Features

- 🎨 **Cinematic Dark Theme** - Minimal, high-contrast design with neon violet accent
- ✨ **Motion-First Design** - Smooth animations powered by Framer Motion
- 📱 **Fully Responsive** - Mobile-first approach
- 🔐 **Admin Dashboard** - Protected content management system
- 📝 **Blog System** - Markdown-based blog with Firestore
- 🖼️ **Image Upload** - Upload images directly to the repository
- 🚀 **Production Ready** - Optimized for Vercel deployment

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Firebase (Auth, Firestore)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio-2.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `env.local.example` to `.env.local`:
   ```bash
   cp env.local.example .env.local
   ```
   
   Then fill in your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Set up Firebase**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable **Email/Password Authentication**
   - Create a **Firestore Database** (start in test mode for development)
   - Create at least one admin user in Authentication

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup

### Firestore Collections

The app uses three collections:

1. **`projects`** - Portfolio projects
   - `title`, `slug`, `excerpt`, `description`
   - `tech` (array), `heroImageUrl`, `liveUrl`, `repoUrl`
   - `sortOrder`, `featured`, `createdAt`, `updatedAt`

2. **`posts`** - Blog posts
   - `title`, `slug`, `excerpt`, `contentMarkdown`
   - `tags` (array), `heroImageUrl`
   - `published`, `publishedAt`, `seoDescription`
   - `createdAt`, `updatedAt`

3. **`contactRequests`** - Contact form submissions
   - `name`, `email`, `budget`, `message`
   - `createdAt`, `read`

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Projects: public read, admin write
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Posts: public read published only, admin write
    match /posts/{postId} {
      allow read: if resource.data.published == true || request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Contact requests: public create, admin read/write
    match /contactRequests/{requestId} {
      allow create: if true;
      allow read, write: if request.auth != null;
    }
  }
}
```

## Admin Dashboard

Access the admin dashboard at `/admin` (not linked in navigation for security).

- **Login**: Use your Firebase Authentication email/password
- **Projects**: Create, edit, and delete portfolio projects
- **Blog**: Manage blog posts with Markdown content
- **Requests**: View and manage contact form submissions

### Image Uploads

Images are uploaded to `public/uploads/`, `public/projects/`, or `public/blog/` folders and committed to the repository. This works seamlessly with Vercel deployment.

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables (same as `.env.local`)
   - Deploy

3. **Configure Firebase**
   - Add your Vercel domain to Firebase Authentication authorized domains
   - Update Firestore security rules for production

### Environment Variables in Vercel

Add all `NEXT_PUBLIC_FIREBASE_*` variables in Vercel project settings → Environment Variables.

## Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard (protected)
│   ├── blog/              # Blog pages
│   ├── projects/          # Projects listing
│   └── api/               # API routes (upload)
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── blog/             # Blog components
│   ├── layout/           # Layout components
│   ├── projects/         # Project components
│   ├── sections/         # Page sections
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and Firebase config
├── public/               # Static assets and uploads
└── styles/               # Global styles
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

Private - All rights reserved
