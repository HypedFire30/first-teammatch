import { createClient } from '@supabase/supabase-js'
import { User, Session } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Use a single Supabase client instance to avoid multiple instances warning
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'supabase-auth'
  }
})

export interface UserProfile {
  type: 'student' | 'team' | 'admin'
  profile: any
}

export interface AuthError {
  message: string
}

// Sign up a new user (student or team)
export async function signUp(email: string, password: string, userData: any, userType: 'student' | 'team') {
  try {
    console.log("signUp called with:", { email, userType, userData });

    // First, sign out any existing user to ensure clean state
    await supabase.auth.signOut();

    // Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error("Auth error:", authError);
      throw authError;
    }

    if (authData.user) {
      console.log("Auth user created:", authData.user.id);

      // Handle file upload if present (for student resumes)
      let processedUserData = { ...userData };
      if (userType === 'student' && userData.resume_file && userData.resume_file instanceof File) {
        try {
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${userData.resume_file.name.split('.').pop()}`;
          const filePath = `student-resumes/${fileName}`;

          console.log("Uploading resume file:", filePath);

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(filePath, userData.resume_file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error("File upload error:", uploadError);
            throw uploadError;
          }

          console.log("File uploaded successfully:", uploadData);

          // Get the public URL for the uploaded file
          const { data: urlData } = supabase.storage
            .from('resumes')
            .getPublicUrl(filePath);

          // Replace the file object with the file path
          processedUserData.resume_url = filePath;

        } catch (uploadError: any) {
          console.error("Resume upload failed:", uploadError);
          // Continue without the resume if upload fails
          delete processedUserData.resume_file;
        }
      }

      // Insert the user data into the appropriate table
      const tableName = userType === 'student' ? 'students' : 'teams'
      console.log("Inserting into table:", tableName);
      console.log("Inserting data:", processedUserData);

      const { data: insertData, error: insertError } = await supabase
        .from(tableName)
        .insert(processedUserData)
        .select()

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      console.log("Data inserted successfully:", insertData);

      // Force a session refresh to ensure the new user is properly authenticated
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Session error:", sessionError);
      } else {
        console.log("Session refreshed:", sessionData.session?.user.id);
      }

      return { user: authData.user, error: null }
    }

    return { user: null, error: { message: 'Failed to create user' } }
  } catch (error: any) {
    console.error("signUp error:", error);
    return { user: null, error: { message: error.message } }
  }
}

// Sign in existing user
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { user: data.user, error: null }
  } catch (error: any) {
    return { user: null, error: { message: error.message } }
  }
}

// Sign out user
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error: { message: error.message } }
  }
}

// Resend confirmation email
export async function resendConfirmationEmail(email: string) {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    })

    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error: { message: error.message } }
  }
}

// Get current user session
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return { session, error: null }
  } catch (error: any) {
    return { session: null, error: { message: error.message } }
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { user, error: null }
  } catch (error: any) {
    return { user: null, error: { message: error.message } }
  }
}

// Get user profile (student/team/admin data)
export async function getUserProfile(userId: string): Promise<{ profile: UserProfile | null, error: AuthError | null }> {
  try {
    // First, get the current user's email
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('User not found')

    // Check if user exists in admins table
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', user.email)
      .single()

    if (adminData) {
      return {
        profile: {
          type: 'admin',
          profile: adminData
        },
        error: null
      }
    }

    // Check if user exists in students table
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('email', user.email)
      .single()

    if (studentData) {
      return {
        profile: {
          type: 'student',
          profile: studentData
        },
        error: null
      }
    }

    // Check if user exists in teams table
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('email', user.email)
      .single()

    if (teamData) {
      return {
        profile: {
          type: 'team',
          profile: teamData
        },
        error: null
      }
    }

    // If neither found, return null
    return { profile: null, error: { message: 'Profile not found' } }
  } catch (error: any) {
    console.error('getUserProfile error:', error)
    return { profile: null, error: { message: error.message } }
  }
}

// Get user matches
export async function getUserMatches(userId: string): Promise<{ matches: any[] | null, error: AuthError | null }> {
  try {
    console.log("getUserMatches called with userId:", userId);

    // Get the current user's profile first
    const { profile, error: profileError } = await getUserProfile(userId)
    if (profileError) throw profileError
    if (!profile) throw new Error('Profile not found')

    if (profile.type === 'student') {
      // For students, check if they're matched to a team
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select(`
          *,
          teams (
            id,
            team_name,
            email,
            first_level,
            time_commitment,
            grade_range_min,
            grade_range_max,
            zip_code,
            areas_of_need,
            qualities
          )
        `)
        .eq('id', profile.profile.id)
        .single()

      if (studentError) throw studentError

      if (studentData && studentData.is_matched && studentData.teams) {
        // Student is matched to a team
        return {
          matches: [{
            type: 'matched',
            team: studentData.teams,
            matchedAt: studentData.created_at
          }],
          error: null
        }
      } else {
        // Student is not matched - return empty array
        return { matches: [], error: null }
      }
    } else if (profile.type === 'team') {
      // For teams, get all students matched to this team
      const { data: matchedStudents, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('matched_team_id', profile.profile.id)

      if (studentsError) throw studentsError

      return {
        matches: matchedStudents || [],
        error: null
      }
    }

    // For other user types, return empty matches
    return { matches: [], error: null }
  } catch (error: any) {
    console.error('getUserMatches error:', error)
    return { matches: null, error: { message: error.message } }
  }
}

// Update user password
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error

    return { error: null }
  } catch (error: any) {
    return { error: { message: error.message } }
  }
}

// Check if user is authenticated
export function isAuthenticated(session: Session | null): boolean {
  return session !== null && session.user !== null
}

// Get public URL for resume file
export function getResumeUrl(filePath: string): string {
  const { data } = supabase.storage
    .from('resumes')
    .getPublicUrl(filePath);
  return data.publicUrl;
}

// Get user type from session
export async function getUserType(userId: string): Promise<{ type: string | null, error: AuthError | null }> {
  try {
    // Get the current user's profile to determine type
    const { profile, error: profileError } = await getUserProfile(userId)
    if (profileError) throw profileError
    if (!profile) throw new Error('Profile not found')

    return { type: profile.type, error: null }
  } catch (error: any) {
    return { type: null, error: { message: error.message } }
  }
}
