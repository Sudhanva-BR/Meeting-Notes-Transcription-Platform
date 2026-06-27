# Meeting Notes & Transcription Platform (Fireflies.ai Clone)

This is a fullstack Meeting Notes & Transcription platform built as a clone of **Fireflies.ai**. It replicates its design, user experience, and core post-meeting review workflows.

---

## 🎨 Tech Stack
- **Frontend**: Next.js 14+ (TypeScript, App Router, React context, Lucide icons, premium CSS animations, vanilla CSS design token theme system).
- **Backend**: Python 3+ with Django and Django REST Framework (DRF) for building a secure, RESTful, and clean API.
- **Database**: SQLite database with a custom normalized schema supporting cascading deletes and relationship managers.

---

## ⚙️ Project Architecture Overview

```
                                  +------------------------------+
                                  |      Next.js Frontend        |
                                  |     (React, TypeScript)      |
                                  +--------------+---------------+
                                                 |
                                                 | (HTTP JSON Requests)
                                                 v
                                  +--------------+---------------+
                                  |        Django API            |
                                  |   (Django REST Framework)    |
                                  +--------------+---------------+
                                                 |
                                                 | (SQL Queries)
                                                 v
                                  +--------------+---------------+
                                  |       SQLite Database        |
                                  |        (db.sqlite3)          |
                                  +------------------------------+
```

---

## 📊 Database Schema

Our SQLite schema represents a fully relational system. Relationships between entities are detailed below:

### 1. `Meeting`
Core entity storing basic session info.
- `id` (Primary Key, Auto Increment)
- `title` (CharField, max 255)
- `date` (DateTimeField)
- `duration_seconds` (IntegerField)
- `meeting_type` (CharField, e.g., retrospect, planning, standup)
- `created_at` (DateTimeField)
- `updated_at` (DateTimeField)

### 2. `MeetingParticipant`
Many-to-one relationship with `Meeting`. Represents active users or guests in the meeting.
- `id` (Primary Key)
- `meeting` (ForeignKey referencing `Meeting`, cascades on delete)
- `name` (CharField)
- `email` (EmailField)
- `avatar_color` (CharField, Hex color representation)

### 3. `TranscriptSegment`
Many-to-one relationship with `Meeting`. Stores parsed segments of the dialog.
- `id` (Primary Key)
- `meeting` (ForeignKey referencing `Meeting`, cascades on delete)
- `speaker_name` (CharField)
- `start_time` (FloatField, starting time in seconds)
- `end_time` (FloatField, ending time in seconds)
- `content` (TextField, spoken text block)
- `segment_order` (IntegerField, order index)

### 4. `MeetingSummary`
One-to-one relationship with `Meeting`. Holds AI summaries, topics, and key chapters.
- `id` (Primary Key)
- `meeting` (OneToOneField referencing `Meeting`, cascades on delete)
- `overview` (TextField)
- `key_topics` (TextField, JSON string of strings)
- `outline` (TextField, Markdown-formatted list details)

### 5. `ActionItem`
Many-to-one relationship with `Meeting`. Actionable items checklist.
- `id` (Primary Key)
- `meeting` (ForeignKey referencing `Meeting`, cascades on delete)
- `title` (TextField, description)
- `assignee` (CharField, assigned name)
- `is_completed` (BooleanField)
- `due_date` (DateField, optional)
- `created_at` (DateTimeField)

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup (Django)
Navigate to the `backend` folder and follow these instructions:

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
python -m pip install -r requirements.txt

# 3. Create migrations and migrate SQLite DB
python manage.py makemigrations meetings
python manage.py migrate

# 4. Seed the database with 5 realistic meetings
python manage.py seed_data

# 5. Run the development server (runs on port 8000)
python manage.py runserver 8000
```

The Django server will run at `http://127.0.0.1:8000/`.

---

### 2. Frontend Setup (Next.js)
Navigate to the `frontend` folder and follow these instructions:

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server (runs on port 3000)
npm run dev
```

Open `http://localhost:3000` in your web browser to access the Fireflies app!

---

## 🔌 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/meetings/` | List all meetings. Supports queries: `?search=<term>&sort=<field>` |
| `POST` | `/api/meetings/` | Create a new meeting (with transcript parsing) |
| `GET` | `/api/meetings/{id}/` | Get detailed view (transcript, summary, action items, participants) |
| `PUT` | `/api/meetings/{id}/` | Update metadata (title, participants, category) |
| `DELETE` | `/api/meetings/{id}/` | Delete meeting (cascading cleanup) |
| `POST` | `/api/action-items/` | Create a new action item |
| `PATCH` | `/api/action-items/{id}/` | Update action item (complete/incomplete toggle) |
| `DELETE` | `/api/action-items/{id}/` | Remove an action item |
| `GET` | `/api/search/?q=<term>` | Global search query across transcripts & titles |

---

## 💡 Assumptions Made
1. **Mock Authentication**: We assume a default logged-in user ("Sudha") representing the workspace owner.
2. **AI Pre-seeding**: AI Summaries, key outline chapters, and action items are seeded directly into the database to bypass costly LLM APIs.
3. **Pasted Transcript Format**: When creating a meeting, the user pastes a raw transcript using the format `Speaker Name [MM:SS]: content`. If the format is not matched, it defaults to standard sequential 15-second intervals automatically.
