
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const AdminAccountCreator = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<AdminFormValues>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
  });
  
  const onSubmit = async (values: AdminFormValues) => {
    if (values.password !== values.confirmPassword) {
      form.setError('confirmPassword', { 
        type: 'manual', 
        message: 'Passwords do not match' 
      });
      return;
    }
    
    setIsCreating(true);
    try {
      // 1. Create the user account
      const { data: userData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      
      if (signUpError) throw signUpError;
      
      if (!userData.user) {
        throw new Error('Failed to create user');
      }
      
      // 2. Assign admin role to the user
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userData.user.id,
          role: 'admin'
        });
      
      if (roleError) throw roleError;
      
      toast({
        title: "Admin account created",
        description: `Admin account for ${values.email} has been created successfully.`,
      });
      
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error creating admin account",
        description: error.message || "An error occurred while creating the admin account.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Admin Account</CardTitle>
        <CardDescription>
          Create a new admin account that can manage audiobooks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="admin@example.com" 
                      type="email" 
                      {...field} 
                      required 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="••••••••" 
                      type="password" 
                      {...field} 
                      required 
                      minLength={8}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="••••••••" 
                      type="password" 
                      {...field} 
                      required 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Admin Account'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AdminAccountCreator;
