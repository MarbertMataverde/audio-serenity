
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileFormValues {
  email: string;
  fullName: string;
  avatarUrl: string;
}

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      email: '',
      fullName: '',
      avatarUrl: '',
    },
  });
  
  // Redirect if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);
  
  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      
      try {
        // Get user metadata which might contain fullName
        let fullName = '';
        if (user.user_metadata && user.user_metadata.full_name) {
          fullName = user.user_metadata.full_name;
        }
        
        // Get avatar URL from storage if it exists
        let avatarUrl = '';
        if (user.user_metadata && user.user_metadata.avatar_url) {
          avatarUrl = user.user_metadata.avatar_url;
        }
        
        form.reset({
          email: user.email || '',
          fullName,
          avatarUrl,
        });
        
        if (avatarUrl) {
          setAvatarPreview(avatarUrl);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast({
          title: "Error loading profile",
          description: "Could not load your profile information.",
          variant: "destructive"
        });
      }
    };
    
    loadProfileData();
  }, [user, form, toast]);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      let avatarUrl = values.avatarUrl;
      
      // Upload new avatar if selected
      if (avatarFile) {
        const fileName = `avatar-${user.id}-${Date.now()}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('audiobooks')
          .upload(`avatars/${fileName}`, avatarFile);
          
        if (uploadError) throw uploadError;
        
        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('audiobooks')
            .getPublicUrl(`avatars/${fileName}`);
            
          avatarUrl = publicUrl;
        }
      }
      
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: values.fullName,
          avatar_url: avatarUrl
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="container-custom flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update your profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <Avatar className="w-24 h-24">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt="Profile" />
              ) : (
                <AvatarFallback className="text-xl">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" type="email" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Picture</Label>
                <Input 
                  id="avatar" 
                  type="file" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
