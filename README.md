# 🎯 Professional Resume Builder

A full-stack, production-ready resume builder application built with **React**, **Vite**, and **Supabase**. This application demonstrates advanced React engineering, API design, database architecture, and modern web development best practices.

## ✨ Features

### 🔐 Authentication & User System
- ✅ User registration with email verification
- ✅ Secure login/logout with JWT authentication
- ✅ Password reset functionality
- ✅ User profile management
- ✅ Row-level security (RLS) in Supabase
- ✅ Protected routes

### 🧑‍💼 Resume Management
- ✅ Create unlimited resumes
- ✅ Edit, delete, and duplicate resumes
- ✅ Resume version history
- ✅ Draft and published status
- ✅ Set active resume
- ✅ Auto-save every 5 seconds

### 🧱 Resume Sections
Complete structured sections for professional resumes:
- ✅ Personal Information (contact details, links)
- ✅ Professional Summary
- ✅ Work Experience
- ✅ Education
- ✅ Skills
- ✅ Projects
- ✅ Certifications
- ✅ Languages
- ✅ References (optional)

Each section supports:
- Add, edit, delete entries
- Reorder sections
- Hide/show sections
- Auto-save changes

### 🎨 Templates & Design System
- ✅ Multiple professional templates (Modern, Classic, Minimal, Creative)
- ✅ Customizable color themes (Blue, Green, Purple, Red, Gray)
- ✅ Font selection (Inter, Roboto, Open Sans, Lato, Montserrat)
- ✅ Layout options (One-column, Two-column)
- ✅ Real-time preview

### 🖥️ Live Preview Engine
- ✅ Instant resume preview
- ✅ Real-time formatting updates
- ✅ Print-ready layouts
- ✅ Responsive design

### 📤 Export & Sharing
- 🚧 PDF export (Ready for implementation with jsPDF)
- 🚧 Printable view
- 🚧 Public share links
- 🚧 Password-protected sharing
- 🚧 Download and view analytics

### 📊 Analytics Dashboard
- 🚧 Resume views tracking
- 🚧 Download statistics
- 🚧 Link click tracking
- 🚧 View timestamps

### 🗂️ File & Media Handling
- 🚧 Profile photo upload
- 🚧 Document attachments
- 🚧 Image optimization
- 🚧 Supabase Storage integration

### 🧠 Smart Features
- ✅ Auto-save functionality
- ✅ Draft and publish modes
- 🚧 Undo/redo changes
- 🚧 Offline support
- 🚧 Multi-device sync

## 🏗️ Technical Architecture

### Frontend Stack
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **jsPDF & html2canvas** - PDF generation

### Backend Stack
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Row Level Security
  - Real-time subscriptions
  - File storage

### Database Schema
Comprehensive schema with 14+ tables:
- `profiles` - User profiles
- `resumes` - Resume metadata
- `personal_info` - Contact information
- `education` - Education history
- `experience` - Work experience
- `skills` - Skills and competencies
- `projects` - Project portfolio
- `certifications` - Professional certifications
- `languages` - Language proficiency
- `references` - Professional references
- `section_visibility` - Section display settings
- `resume_versions` - Version history
- `public_shares` - Sharing configuration
- `resume_analytics` - Usage analytics
- `file_uploads` - Uploaded files


## 📁 Project Structure

```
resume-builder/
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Dashboard and resume list
│   │   ├── editor/            # Resume editor
│   │   │   └── sections/      # Individual section components
│   │   └── preview/           # Resume preview and templates
│   ├── store/                 # State management (Zustand)
│   ├── lib/                   # Utilities and configuration
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Entry point
├── .env.example
├── package.json
├── SUPABASE_SETUP.md          # Detailed Supabase setup guide
└── README.md
```

## 🔑 Key Features Implementation

### Auto-Save System
The application implements intelligent auto-save that triggers 5 seconds after user stops typing. This prevents overwhelming the database with requests while ensuring no data is lost.

### State Management
Uses Zustand for lightweight, efficient state management:
- `authStore` - Authentication and user profile
- `resumeStore` - Resume CRUD operations and section management

### Row-Level Security
All database tables have RLS policies ensuring users can only access their own data. Shared resumes are handled through a separate public shares table with token-based access.

### Responsive Design
Mobile-first design approach ensures the application works seamlessly across devices.

## 🚧 Roadmap & Future Enhancements

### Phase 1: Complete Core Features ✅
- [x] Authentication system
- [x] Resume CRUD operations
- [x] All resume sections
- [x] Live preview
- [x] Templates and design system

### Phase 2: Export & Sharing (In Progress)
- [ ] PDF export with custom styling
- [ ] Public share links with analytics
- [ ] Password-protected shares
- [ ] Email sharing

### Phase 3: Analytics & Insights
- [ ] View tracking
- [ ] Download statistics
- [ ] Popular sections analysis
- [ ] Performance metrics

### Phase 4: AI Enhancement
- [ ] Resume content suggestions
- [ ] Skill gap detection
- [ ] ATS keyword optimization
- [ ] Job matching score
- [ ] Grammar and style checking

### Phase 5: Advanced Features
- [ ] Resume templates marketplace
- [ ] Cover letter builder
- [ ] LinkedIn import
- [ ] Multi-language support
- [ ] Collaborative editing
- [ ] Version comparison

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Tech Highlights

**Security Best Practices:**
- JWT authentication with Supabase Auth
- Row Level Security policies
- SQL injection prevention
- XSS protection
- CSRF tokens

**Performance Optimizations:**
- Code splitting with React.lazy
- Optimistic UI updates
- Debounced auto-save
- Indexed database queries
- Lazy loading of resume data

**User Experience:**
- Real-time preview updates
- Toast notifications
- Loading states
- Error handling
- Form validation

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ for the hackathon

---

## 📞 Support

For setup issues or questions, check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) or create an issue.

**Happy Resume Building! 🎉**
