import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updatePassword as firebaseUpdatePassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  getAuth
} from 'firebase/auth'
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  updateDoc,
  Timestamp
} from 'firebase/firestore'
import { 
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { auth, db, storage, isFirebaseConfigured } from './firebase'

// Re-export isFirebaseConfigured for convenience
export { isFirebaseConfigured }

export interface UserProfile {
  type: 'student' | 'team' | 'admin'
  profile: any
}

export interface AuthError {
  message: string
}

export interface Session {
  user: FirebaseUser
}

// Sign up a new user (student or team)
export async function signUp(email: string, password: string, userData: any, userType: 'student' | 'team') {
  if (!isFirebaseConfigured()) {
    return { user: null, error: { message: 'Firebase is not configured. Please set Firebase environment variables in .env.local' } }
  }
  
  try {
    console.log("signUp called with:", { email, userType, userData });

    // Sign out any existing user to ensure clean state
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      // Ignore errors if no user is signed in
    }

    // Create the auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);

    console.log("Auth user created:", user.uid);

    // Handle file upload if present (for student resumes)
    let processedUserData = { ...userData };
    if (userType === 'student' && userData.resume_file && userData.resume_file instanceof File) {
      try {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${userData.resume_file.name.split('.').pop()}`;
        const filePath = `student-resumes/${fileName}`;

        console.log("Uploading resume file:", filePath);

        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, userData.resume_file);

        console.log("File uploaded successfully");

        // Replace the file object with the file path
        processedUserData.resume_url = filePath;

      } catch (uploadError: any) {
        console.error("Resume upload failed:", uploadError);
        // Continue without the resume if upload fails
        delete processedUserData.resume_file;
      }
    }

    // Add metadata
    processedUserData.created_at = Timestamp.now();
    processedUserData.updated_at = Timestamp.now();
    if (userType === 'student') {
      processedUserData.is_matched = false;
    }

    // Insert the user data into the appropriate collection
    const collectionName = userType === 'student' ? 'students' : 'teams'
    console.log("Inserting into collection:", collectionName);
    console.log("Inserting data:", processedUserData);

    await setDoc(doc(db, collectionName, user.uid), processedUserData);

    console.log("Data inserted successfully");

    return { user, error: null }
  } catch (error: any) {
    console.error("signUp error:", error);
    
    // Handle rate limiting specifically
    if (error.code === 'auth/too-many-requests') {
      return { 
        user: null, 
        error: { 
          message: 'Too many requests. Please wait a few minutes before trying again. Firebase has rate limits to prevent abuse.' 
        } 
      }
    }
    
    // Handle other common errors
    let errorMessage = error.message;
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please sign in instead.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Please use a stronger password.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address. Please check your email and try again.';
    }
    
    return { user: null, error: { message: errorMessage } }
  }
}

// Sign in existing user
export async function signIn(email: string, password: string) {
  if (!isFirebaseConfigured()) {
    return { user: null, error: { message: 'Firebase is not configured. Please set Firebase environment variables in .env.local' } }
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    // Handle rate limiting specifically
    if (error.code === 'auth/too-many-requests') {
      return { 
        user: null, 
        error: { 
          message: 'Too many sign-in attempts. Please wait a few minutes before trying again.' 
        } 
      }
    }
    
    // Handle other common errors
    let errorMessage = error.message;
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email. Please check your email or sign up.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address. Please check your email and try again.';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled. Please contact support.';
    }
    
    return { user: null, error: { message: errorMessage } }
  }
}

// Sign out user
export async function signOut() {
  try {
    await firebaseSignOut(auth)
    return { error: null }
  } catch (error: any) {
    return { error: { message: error.message } }
  }
}

// Resend confirmation email
export async function resendConfirmationEmail(email: string) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { error: { message: 'No user is currently signed in' } }
    }
    await sendEmailVerification(user);
    return { error: null }
  } catch (error: any) {
    // Handle rate limiting specifically
    if (error.code === 'auth/too-many-requests') {
      return { 
        error: { 
          message: 'Too many verification email requests. Please wait a few minutes before requesting another email.' 
        } 
      }
    }
    
    return { error: { message: error.message } }
  }
}

// Send password reset email
export async function sendPasswordReset(email: string) {
  if (!isFirebaseConfigured()) {
    return { error: { message: 'Firebase is not configured' } }
  }
  
  // Validate email format
  if (!email || !email.trim()) {
    return { error: { message: 'Please enter a valid email address' } }
  }
  
  try {
    console.log('Sending password reset email to:', email);
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent successfully');
    return { error: null }
  } catch (error: any) {
    console.error('Password reset error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Handle rate limiting specifically
    if (error.code === 'auth/too-many-requests') {
      return { 
        error: { 
          message: 'Too many password reset requests. Please wait a few minutes before requesting another reset email.' 
        } 
      }
    }
    
    // Handle other common errors
    let errorMessage = error.message;
    if (error.code === 'auth/user-not-found') {
      // Don't reveal if email exists - security best practice
      // But still return success to user to prevent email enumeration
      console.log('User not found, but returning success for security');
      return { error: null }
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address. Please check your email and try again.';
    } else if (error.code === 'auth/missing-email') {
      errorMessage = 'Email address is required.';
    }
    
    return { error: { message: errorMessage } }
  }
}

// Get current user session
export async function getSession() {
  if (!isFirebaseConfigured()) {
    return { session: null, error: { message: 'Firebase is not configured' } }
  }
  
  try {
    const user = auth.currentUser;
    if (user) {
      return { session: { user }, error: null }
    }
    return { session: null, error: null }
  } catch (error: any) {
    return { session: null, error: { message: error.message } }
  }
}

// Get current user
export async function getCurrentUser() {
  if (!isFirebaseConfigured()) {
    return { user: null, error: { message: 'Firebase is not configured' } }
  }
  
  try {
    const user = auth.currentUser;
    return { user, error: null }
  } catch (error: any) {
    return { user: null, error: { message: error.message } }
  }
}

// Get user profile (student/team/admin data)
export async function getUserProfile(userId: string): Promise<{ profile: UserProfile | null, error: AuthError | null }> {
  if (!isFirebaseConfigured()) {
    return { profile: null, error: { message: 'Firebase is not configured' } }
  }
  
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    console.log('getUserProfile: Checking profile for userId:', userId)

    // Check if user exists in admins collection
    try {
      const adminDoc = await getDoc(doc(db, 'admins', userId));
      if (adminDoc.exists()) {
        console.log('getUserProfile: Found admin profile')
        return {
          profile: {
            type: 'admin',
            profile: { id: adminDoc.id, ...adminDoc.data() }
          },
          error: null
        }
      }
    } catch (adminError: any) {
      console.error('getUserProfile: Error checking admins:', adminError)
      // Continue to check other collections
    }

    // Check if user exists in students collection
    try {
      const studentDoc = await getDoc(doc(db, 'students', userId));
      if (studentDoc.exists()) {
        console.log('getUserProfile: Found student profile')
        return {
          profile: {
            type: 'student',
            profile: { id: studentDoc.id, ...studentDoc.data() }
          },
          error: null
        }
      }
    } catch (studentError: any) {
      console.error('getUserProfile: Error checking students:', studentError)
      // Continue to check other collections
    }

    // Check if user exists in teams collection
    try {
      const teamDoc = await getDoc(doc(db, 'teams', userId));
      if (teamDoc.exists()) {
        console.log('getUserProfile: Found team profile')
        return {
          profile: {
            type: 'team',
            profile: { id: teamDoc.id, ...teamDoc.data() }
          },
          error: null
        }
      }
    } catch (teamError: any) {
      console.error('getUserProfile: Error checking teams:', teamError)
    }

    // If neither found, return error with more context
    console.warn('getUserProfile: No profile found for userId:', userId)
    return { profile: null, error: { message: 'Profile not found. Please complete your registration.' } }
  } catch (error: any) {
    console.error('getUserProfile error:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    
    // Provide more helpful error messages
    let errorMessage = error.message
    if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied. Please check Firestore security rules.'
    } else if (error.code === 'unavailable') {
      errorMessage = 'Firestore is temporarily unavailable. Please try again.'
    }
    
    return { profile: null, error: { message: errorMessage } }
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
      const studentDoc = await getDoc(doc(db, 'students', userId));
      if (!studentDoc.exists()) {
        return { matches: [], error: null }
      }

      const studentData = { id: studentDoc.id, ...studentDoc.data() } as any;
      
      if (studentData.is_matched && studentData.matched_team_id) {
        // Get the matched team
        const teamDoc = await getDoc(doc(db, 'teams', studentData.matched_team_id));
        if (teamDoc.exists()) {
          const teamData = { id: teamDoc.id, ...teamDoc.data() };
          return {
            matches: [{
              type: 'matched',
              team: teamData,
              matchedAt: studentData.created_at
            }],
            error: null
          }
        }
      }
      
      // Student is not matched - return empty array
      return { matches: [], error: null }
    } else if (profile.type === 'team') {
      // For teams, get all students matched to this team
      const studentsQuery = query(
        collection(db, 'students'),
        where('matched_team_id', '==', userId)
      );
      const studentsSnapshot = await getDocs(studentsQuery);
      const matchedStudents = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

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
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in')
    }
    await firebaseUpdatePassword(user, newPassword);
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
export async function getResumeUrl(filePath: string): Promise<string> {
  try {
    const storageRef = ref(storage, filePath);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error: any) {
    console.error('Error getting resume URL:', error);
    return '';
  }
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

// Export auth instance for onAuthStateChange
export { auth, onAuthStateChanged }
