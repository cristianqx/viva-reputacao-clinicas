import { supabase } from '@/integrations/supabase/client';

/**
 * Utility to clean up Supabase auth state
 * This helps prevent auth limbo states and session conflicts
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

/**
 * Helper to perform a robust login with proper state cleanup
 */
export const performRobustLogin = async (email: string, password: string) => {
  try {
    console.log('Starting robust login process for email:', email);
    
    // Clean up existing auth state to prevent conflicts
    cleanupAuthState();
    
    // Attempt global sign out first to ensure clean state
    try {
      console.log('Attempting preliminary signout');
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continue even if this fails
      console.log('Preliminary signout failed, continuing with login');
    }
    
    // Perform the login with Supabase
    console.log('Attempting to sign in with password');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Login error:', error);
      throw error;
    }
    
    // Store the session right away
    if (data && data.session) {
      console.log('Login successful, session established');
      
      // Ensure we immediately fetch the user profile to prevent race conditions
      const { data: userData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.session.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.warn('Could not fetch user profile after login:', profileError);
      } else if (userData) {
        console.log('User profile fetched after login:', userData);
      }
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Authentication error:', error);
    return { success: false, error };
  }
};

/**
 * Helper to perform a robust logout
 */
export const performRobustLogout = async () => {
  try {
    // Clean up auth state
    cleanupAuthState();
    
    // Attempt global sign out
    await supabase.auth.signOut({ scope: 'global' });
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error };
  }
};

/**
 * Helper to check current auth status
 */
export const checkAuthStatus = async () => {
  try {
    console.log('Checking auth status');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth status check error:', error);
      throw error;
    }
    
    if (!data.session) {
      console.log('No active session found');
      return {
        isAuthenticated: false,
        session: null,
        user: null,
      };
    }
    
    console.log('Auth status check result:', data);
    
    // Also get user profile from the users table to check onboarding status
    const userId = data.session.user.id;
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    } else if (userProfile) {
      console.log('User profile found:', userProfile);
    }
    
    return {
      isAuthenticated: !!data.session,
      session: data.session,
      user: data.session?.user || null,
      profile: userProfile || null,
    };
  } catch (error) {
    console.error('Auth check error:', error);
    return {
      isAuthenticated: false,
      session: null,
      user: null,
      error,
    };
  }
};

/**
 * Update onboarding completion status
 * This function updates the onboarding_completo field as well as other onboarding-related fields
 */
export const updateOnboardingCompletionStatus = async (
  completed: boolean,
  onboardingData?: {
    google_calendar_integrado?: boolean;
    google_my_business_link?: string | null;
    nome_completo?: string;
    nome_clinica?: string | null;
    endereco_clinica?: string | null;
  }
) => {
  try {
    // Get the current user session to retrieve the user ID
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error('Erro ao obter sessão:', sessionError);
      return { success: false, error: sessionError };
    }
    
    const userId = sessionData.session.user.id;
    console.log('Atualizando onboarding para usuário:', userId);
    
    // Prepare update data
    const updateData: Record<string, any> = { 
      onboarding_completo: completed 
    };
    
    // Add optional onboarding data if provided
    if (onboardingData) {
      if (onboardingData.nome_completo !== undefined) {
        updateData.nome_completo = onboardingData.nome_completo;
      }
      
      if (onboardingData.nome_clinica !== undefined) {
        updateData.nome_clinica = onboardingData.nome_clinica;
      }
      
      if (onboardingData.endereco_clinica !== undefined) {
        updateData.endereco_clinica = onboardingData.endereco_clinica;
      }
      
      if (onboardingData.google_calendar_integrado !== undefined) {
        updateData.google_calendar_integrado = onboardingData.google_calendar_integrado;
      }
      
      if (onboardingData.google_my_business_link !== undefined) {
        updateData.google_my_business_link = onboardingData.google_my_business_link;
      }
    }
    
    console.log('Dados de atualização:', updateData);
    
    // Update the user record
    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId);
    
    if (error) {
      console.error('Erro ao atualizar status de onboarding:', error);
      return { success: false, error };
    }
    
    // Refresh the session to ensure changes are reflected
    await supabase.auth.refreshSession();
    
    // Verify that the update was successful by checking the database again
    const { data: verifyData, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (verifyError) {
      console.error('Erro ao verificar atualização:', verifyError);
    } else if (verifyData) {
      console.log('Verificação após atualização:', verifyData);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar status de onboarding:', error);
    return { success: false, error };
  }
};

/**
 * Register a new user with Supabase Auth
 */
export const registerNewUser = async (email: string, password: string, userData: Record<string, any>) => {
  try {
    // Clean up any existing auth state
    cleanupAuthState();
    
    // Attempt to sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    
    if (error) {
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error };
  }
};

/**
 * Update user password directly in Supabase Auth
 * This requires admin privileges and should be used carefully
 */
export const updateUserPassword = async (userId: string, newPassword: string) => {
  try {
    console.log('Attempting to update password for user:', userId);
    
    // We use the admin api (service role) for this, which should be done in a secure context
    // In a production app, this should be done via a secure server-side function
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );
    
    if (error) {
      console.error('Password update error:', error);
      throw error;
    }
    
    console.log('Password updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Password update error:', error);
    return { success: false, error };
  }
};
