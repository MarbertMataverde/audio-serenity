
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, BookPlus } from 'lucide-react';
import AdminAccountCreator from '@/components/AdminAccountCreator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface UploadFormValues {
  title: string;
  author: string;
  description: string;
}

const AdminPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<UploadFormValues>({
    defaultValues: {
      title: '',
      author: '',
      description: '',
    },
  });
  
  if (loading) {
    return <div className="container-custom py-12 text-center">Loading...</div>;
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setCoverFile(null);
      setCoverPreview(null);
      return;
    }
    
    const file = e.target.files[0];
    setCoverFile(file);
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
  };
  
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setAudioFile(null);
      return;
    }
    
    const file = e.target.files[0];
    setAudioFile(file);
  };
  
  const clearCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
  };
  
  const clearAudio = () => {
    setAudioFile(null);
  };
  
  const onSubmit = async (values: UploadFormValues) => {
    if (!coverFile || !audioFile) {
      toast({
        title: "Missing files",
        description: "Please upload both cover image and audio file.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setUploading(true);
      
      // Upload cover image
      const coverFileName = `covers/${Date.now()}_${coverFile.name}`;
      const { error: coverError, data: coverData } = await supabase.storage
        .from('audiobooks')
        .upload(coverFileName, coverFile);
        
      if (coverError) throw coverError;
      
      // Get cover URL
      const { data: coverUrl } = supabase.storage
        .from('audiobooks')
        .getPublicUrl(coverFileName);
      
      // Upload audio file
      const audioFileName = `audio/${Date.now()}_${audioFile.name}`;
      const { error: audioError, data: audioData } = await supabase.storage
        .from('audiobooks')
        .upload(audioFileName, audioFile);
        
      if (audioError) throw audioError;
      
      // Get audio URL
      const { data: audioUrl } = supabase.storage
        .from('audiobooks')
        .getPublicUrl(audioFileName);
      
      // Get audio duration (create an audio element to get duration)
      const audio = new Audio();
      audio.src = audioUrl.publicUrl;
      
      // Wait for metadata to load to get duration
      await new Promise<void>((resolve, reject) => {
        audio.addEventListener('loadedmetadata', () => resolve());
        audio.addEventListener('error', (error) => reject(error));
      });
      
      const duration = Math.round(audio.duration);
      
      // Insert audiobook record into database
      const { error: dbError } = await supabase
        .from('audiobooks')
        .insert({
          title: values.title,
          author: values.author,
          description: values.description,
          cover_url: coverUrl.publicUrl,
          audio_url: audioUrl.publicUrl,
          duration: duration
        });
        
      if (dbError) throw dbError;
      
      toast({
        title: "Success",
        description: "Audiobook uploaded successfully!",
      });
      
      // Reset form
      form.reset();
      setCoverFile(null);
      setCoverPreview(null);
      setAudioFile(null);
      
    } catch (error: any) {
      console.error('Error uploading audiobook:', error);
      toast({
        title: "Upload Error",
        description: error.message || "There was an error uploading the audiobook.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="container-custom py-8">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button className="gap-2" size="lg">
                <BookPlus />
                Upload New Audiobook
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle>Upload New Audiobook</SheetTitle>
                <SheetDescription>
                  Fill in the details and upload files to add a new audiobook to the catalog.
                </SheetDescription>
              </SheetHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Audiobook title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Author */}
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input placeholder="Author name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Audiobook description" 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Cover Image Upload */}
                  <div className="space-y-2">
                    <FormLabel htmlFor="cover-upload">Cover Image</FormLabel>
                    
                    {coverPreview ? (
                      <div className="relative inline-block">
                        <img 
                          src={coverPreview} 
                          alt="Cover preview" 
                          className="h-40 w-40 object-cover rounded-md border border-gray-200 dark:border-gray-700" 
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={clearCover}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40 w-40 bg-gray-100 dark:bg-gray-900 rounded-md border border-dashed border-gray-300 dark:border-gray-700">
                        <label 
                          htmlFor="cover-upload" 
                          className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                        >
                          <Upload size={24} className="text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Upload cover</span>
                        </label>
                        <input
                          id="cover-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCoverChange}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Audio File Upload */}
                  <div className="space-y-2">
                    <FormLabel htmlFor="audio-upload">Audio File</FormLabel>
                    
                    {audioFile ? (
                      <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-900 rounded-md">
                        <span className="text-sm truncate flex-1">{audioFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={clearAudio}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-20 bg-gray-100 dark:bg-gray-900 rounded-md border border-dashed border-gray-300 dark:border-gray-700">
                        <label 
                          htmlFor="audio-upload" 
                          className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                        >
                          <Upload size={24} className="text-gray-400 mb-1" />
                          <span className="text-sm text-gray-500">Upload audio file</span>
                        </label>
                        <input
                          id="audio-upload"
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={handleAudioChange}
                        />
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={uploading}
                    className="w-full"
                  >
                    {uploading ? 'Uploading...' : 'Upload Audiobook'}
                  </Button>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        </div>
        
        {isAdmin ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Admin Features</h2>
                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Use the button in the top right to upload new audiobooks to the catalog.
                  </p>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Create Admin Account</h2>
                <AdminAccountCreator />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Audiobook Catalog</h2>
              {/* ... keep existing code (audiobook list) */}
            </div>
          </>
        ) : (
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-red-700">
            <p className="text-lg font-semibold">Access Denied</p>
            <p>You do not have permission to access the admin dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
