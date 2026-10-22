# Mifta.dev Portfolio

A premium, production-grade personal portfolio website built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and Firebase.

## Features

-  **Cinematic Dark Theme** - Minimal, high-contrast design with neon violet accent
-  **Motion-First Design** - Smooth animations powered by Framer Motion
-  **Fully Responsive** - Mobile-first approach
-  **Admin Dashboard** - Protected content management system
-  **Blog System** - Markdown-based blog with Firestore
-  **Image Upload** - Upload images directly to the repository
-  **Production Ready** - Optimized for Vercel deployment

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


## Admin Dashboard

Access the admin dashboard at `/admin` (not linked in navigation for security).

- **Login**: Use your Firebase Authentication email/password
- **Projects**: Create, edit, and delete portfolio projects
- **Blog**: Manage blog posts with Markdown content
- **Requests**: View and manage contact form submissions

### Image Uploads

Images are uploaded to `public/uploads/`, `public/projects/`, or `public/blog/` folders and committed to the repository. This works seamlessly with Vercel deployment.

## License

Private - All rights reserved
