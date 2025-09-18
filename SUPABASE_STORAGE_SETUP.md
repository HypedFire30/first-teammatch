# Supabase Storage Setup for Resume Uploads

## 🗄️ **Step 1: Create Storage Bucket**

1. Go to your Supabase dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Name it `resumes`
5. Set it to **Public** (so resumes can be viewed)
6. Click **Create bucket**

## 🔧 **Step 2: Set Storage Policies**

After creating the bucket, you need to set up policies to allow uploads:

### **Policy 1: Allow Uploads**

```sql
-- Allow anyone to upload resumes
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'resumes');
```

### **Policy 2: Allow Downloads**

```sql
-- Allow anyone to download/view resumes
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'resumes');
```

## 📁 **Step 3: File Structure**

Files will be stored as:

```
resumes/
├── 1703123456789_alex_resume.pdf
├── 1703123456790_sarah_resume.pdf
└── ...
```

## 🎯 **How It Works**

1. **Student uploads PDF** → File goes to Supabase Storage
2. **File gets unique name** → `timestamp_filename.pdf`
3. **URL stored in database** → `resume_url` column gets the public URL
4. **Admin can view** → Click "Resume" button opens PDF in new tab

## ✅ **Benefits**

- ✅ **Secure file storage** in the cloud
- ✅ **Public URLs** for easy access
- ✅ **Automatic file naming** prevents conflicts
- ✅ **Scalable** - handles thousands of files
- ✅ **No server storage** needed

## 🚀 **Ready to Use**

Once you set up the storage bucket and policies, the resume upload functionality will work automatically with your existing forms!
