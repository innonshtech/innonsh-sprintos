# 🎨 Sprint 1 — UI/UX Figma Design: 3 Master User Stories (Stories #14, #15, #16)

> **Sprint Structure Note**:
> - **Moved to Sprint 2**: Former backend/device stories **G13** (*Panel App — Boot & License Validation*), **G15** (*Remote Device Lock / Unlock*), and **G16** (*Device Health Monitoring*).
> - **Added to Sprint 1 (at the end)**: These **3 Master UI/UX Figma User Stories** as **#14, #15, and #16**.

---

### 🖥️ Story #14: UI/UX — Admin Portal & Management Suite (Figma Desktop)
**User Story:**
An Admin (Super Admin or School Admin) logs into the desktop admin web portal using their registered email with OTP or Google SSO. The Super Admin registers new schools, generates 16-character panel license keys, and tracks platform metrics. The School Admin customizes school branding (logo, colors, language), invites teachers with class assignments, approves student registrations, and remotely monitors/locks classroom IFP panels.

**Acceptance Criteria:**
- **Admin Authentication**:
  - Email input with 6-digit OTP verification boxes (60s countdown timer + resend link) and Google SSO button.
  - Inline error alerts for invalid OTP, expired OTP, and account locked (15 min).
- **Super Admin Operations**:
  - **School Onboarding Form**: School Name, Board (CBSE/ICSE/State), Address, Contact Info, Logo upload, and Primary Color picker. Generates a unique 6-character School Code (e.g. `GYO001`) with a copy button.
  - **License Key Management**: Table displaying `GYSH-XXXX-XXXX-XXXX` license keys, mapped school/classroom, expiry dates, renewal actions, and 30-day "Expiring Soon" amber warning badges.
- **School Admin Operations**:
  - **Branding & Settings**: Logo upload, brand primary color picker, default language dropdown (English, Hindi, Marathi, etc.), and live preview card of mobile/panel headers.
  - **Teacher & Student Management**: Teacher roster with class assignment tags + "Add Teacher" modal; Student registration queue with 1-click Approve (✓) and Reject (✕) actions.
  - **Device Health & Remote Lock**: Grid view of classroom panels showing live status (`Online` green, `Offline` grey, `Locked` red), Storage/RAM %, and 1-click "Lock / Unlock Panel" toggle with confirmation modal.
- **Figma Deliverable**: Desktop Frame (1440 × 1024 px) — Login, Super Admin Dashboard, School Modal, License Table, School Admin Branding, Teacher/Student Lists, and Device Monitor Grid.

---

### 📺 Story #15: UI/UX — Interactive IFP Whiteboard Panel (Figma Touch)
**User Story:**
An IFP panel operator boots the panel to validate its license key or see a full-screen lock overlay if unlicensed/expired. On the main panel start screen, a teacher sees a large dynamic QR code with a 60s countdown timer to scan with their phone for instant login. Once logged in, the teacher lands on an infinite whiteboard canvas with an ergonomic floating toolbar to write, highlight, erase, change colors, and manage pages.

**Acceptance Criteria:**
- **Boot, License Activation & Remote Lock**:
  - License entry screen with 4-part input (`GYSH-XXXX-XXXX-XXXX`) and large touch keyboard mockup.
  - Full-screen Lock Overlay with red lock icon, school name, and "Panel Locked / License Expired — Contact Administrator" notice.
- **Dynamic QR Code Login Screen**:
  - Large centered QR code box with a 60-second circular countdown timer ("Refreshes in 45s").
  - 3-step graphic instruction ("1. Open Teacher App → 2. Tap Scan → 3. Point at QR") + fallback "Or Login with Email" link.
- **Whiteboard Canvas & Floating Toolbar**:
  - **Header Bar**: School logo, Class/Subject title ("Grade 10 - Mathematics"), Page selector ("Page 1 of 1" + `+` Add Page), and Teacher profile avatar with Logout button.
  - **Main Canvas**: Infinite dotted grid workspace optimized for touch and pen input.
  - **Floating Draggable Dock**: Pen, Highlighter, Eraser, Clear Board, Undo/Redo, 6-color quick palette (Black, Blue, Red, Green, Yellow, White), and Stroke thickness slider (Fine, Medium, Thick). Dock can snap to bottom or side edges.
- **Figma Deliverable**: Large Touch Display Frame (1920 × 1080 px / 4K) — Activation Screen, Lock Overlay, Dynamic QR Login Screen, and Whiteboard Canvas with expanded toolbar states.

---

### 📱 Story #16: UI/UX — Teacher & Student Mobile/Web Applications (Figma)
**User Story:**
A Teacher logs into the mobile app via Email OTP or Google SSO, uses the built-in camera QR scanner to pair and log into the classroom IFP panel with one tap, and views their assigned classes and daily schedule. A Student or Parent enters their unique 6-character School Code (`GYO001`), completes self-registration, logs in, and views their enrolled subjects, notices, and timetable.

**Acceptance Criteria:**
- **Teacher Mobile App (390 × 844 px)**:
  - **Auth & Onboarding**: Clean login screen with Email OTP (30s resend timer), Google SSO, and first-time password setup screen.
  - **Camera QR Scanner**: Full-screen camera viewfinder with a glowing target square, flashlight toggle, and an instant "Connected to Room 9-B Panel! ✓" success confirmation sheet.
  - **Teacher Dashboard**: Greeting header with school logo, hero "Scan to Board" action card, today's classes list (Grade, Section, Subject, Room, Time), and 4-tab bottom navigation (`Home`, `Classes`, `Schedule`, `Settings`).
- **Student Mobile & Tablet App (390 × 844 px & 768 × 1024 px)**:
  - **School Code Onboarding**: 6-character School Code lookup (`GYO001`) with verified school name & logo preview card.
  - **Registration Form**: Student Name, Class dropdown (1-12), Section dropdown (A, B, C), Parent Email & Mobile Number, followed by a "Registration Submitted for Admin Approval" status screen.
  - **Student Dashboard**: Branded school header, student ID badge (Class & Section), enrolled subject cards grid (Maths, Science, English, etc.), school notice board banner, and bottom navigation (`Home`, `Subjects`, `Profile`).
- **Figma Deliverable**: Mobile Frames (390 × 844 px) & Tablet Frame (768 × 1024 px) — Teacher Auth, QR Scanner, Teacher Dashboard, Student Code Lookup, Student Registration, and Student Dashboard.
