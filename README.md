# FIRST Robotics Registration System

A comprehensive platform for matching students with FIRST Robotics teams, featuring secure file uploads and a separate admin system.

## 🚀 New Features

### 1. Resume File Upload System

- **Secure Storage**: Resume files are uploaded to Supabase Storage instead of being stored as text
- **File Management**: Automatic file naming and organization in the `resumes/student-resumes/` folder
- **Public Access**: Files are accessible via public URLs for admin viewing
- **Supported Formats**: PDF, DOC, DOCX (up to 10MB)

### 2. Separate Admin System

- **Dedicated Admin Table**: Admins are stored separately from students/teams
- **Manual Admin Creation**: Admin accounts are manually added to the database
- **No Registration Forms**: Admins don't fill out student/team registration forms
- **Secure Authentication**: Admin authentication is handled separately

## 📋 Setup Instructions

### 1. Database Setup

Run the following SQL scripts in your Supabase SQL Editor:

1. **Update Database Schema**:

   ```sql
   -- Run update-database.sql
   ```

2. **Create Storage Bucket**:
   - Go to Supabase Dashboard → Storage
   - Create a new bucket named `resumes`
   - Set it as public
   - Set file size limit to 10MB
   - Allow MIME types: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### 2. Environment Variables

Ensure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Admin Account Setup

The system automatically creates an admin account for `vedrshah09@gmail.com`. To add more admins, run:

```sql
INSERT INTO admins (name, email, role) VALUES
('Admin Name', 'admin@email.com', 'admin');
```

## 🔧 How It Works

### Resume Upload Process

1. Student selects a resume file during registration
2. File is uploaded to Supabase Storage with a unique filename
3. File path is stored in the `resume_url` column
4. Admin can view files via the admin dashboard

### Admin Authentication

1. Admin logs in with email/password
2. System checks if email exists in the `admins` table
3. If found, admin is redirected to `/admin`
4. If not found, user is treated as student/team

### File Access

- **Upload**: Students can upload files during registration
- **View**: Admins can view files via the admin dashboard
- **Storage**: Files are stored securely in Supabase Storage
- **URLs**: Public URLs are generated for easy access

## 📁 File Structure

```
resumes/
├── student-resumes/
│   ├── 1703123456789_alex_resume.pdf
│   ├── 1703123456790_sarah_resume.pdf
│   └── ...
```

## 🛠️ API Functions

### File Upload Utilities (`lib/utils.ts`)

- `uploadFile()`: Upload file to Supabase Storage
- `getFileUrl()`: Generate public URL for file
- `deleteFile()`: Delete file from storage

### Authentication (`lib/auth.ts`)

- `signUp()`: Register students/teams with file upload support
- `isAdmin()`: Check if user is admin
- `getUserProfile()`: Get user profile (student/team/admin)

## 🔒 Security Features

- **Authenticated Uploads**: Only authenticated users can upload files
- **Secure Storage**: Files stored in Supabase Storage with proper policies
- **Admin Isolation**: Admin accounts separate from regular users
- **File Validation**: File type and size validation

## 📊 Database Schema

### New Tables

- `admins`: Stores admin user information
- Updated `students`: Added `resume_url` column

### Updated Views

- `potential_matches`: Updated to use new schema

## 🎯 Usage

### For Students

1. Register at `/student-registration`
2. Upload resume file (optional)
3. Fill out profile information
4. Submit registration

### For Admins

1. Login at `/login` with admin credentials
2. Access admin dashboard at `/admin`
3. View student submissions and resume files
4. Manage matches between students and teams

### For Teams

1. Register at `/team-registration`
2. Fill out team information
3. Submit registration

## 🚨 Important Notes

1. **Admin Accounts**: Must be manually added to the database
2. **File Storage**: Requires Supabase Storage bucket setup
3. **File Limits**: 10MB maximum file size
4. **Supported Formats**: PDF, DOC, DOCX only
5. **Public Access**: Resume files are publicly accessible via URLs

## 🔄 Migration from Old System

If you have existing data:

1. Run the `update-database.sql` script
2. Existing `resume_url` data will remain and new uploads also use `resume_url`
3. Admin accounts need to be manually added to the `admins` table

## 📞 Support

For issues or questions:

1. Check the database schema in `database-schema.sql`
2. Review the storage setup in `SUPABASE_STORAGE_SETUP.md`
3. Verify environment variables are correctly set
4. Ensure Supabase Storage bucket is properly configured
