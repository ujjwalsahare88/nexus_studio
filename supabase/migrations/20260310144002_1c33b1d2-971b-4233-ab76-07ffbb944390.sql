INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

CREATE POLICY "Media files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Users can upload their own media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);