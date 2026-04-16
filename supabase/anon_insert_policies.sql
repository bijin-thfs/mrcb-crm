-- Anon INSERT policies for PWA submissions (no auth yet)

CREATE POLICY "anon_insert_customers" ON public.customers
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_applications" ON public.applications
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_docs" ON public.application_documents
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_activity" ON public.activity_log
  FOR INSERT TO anon WITH CHECK (true);

-- Storage bucket for KYC documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc-documents', 'kyc-documents', true)
ON CONFLICT DO NOTHING;

-- Allow anon to upload to kyc-documents
CREATE POLICY "anon_upload_kyc" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'kyc-documents');

-- Allow anon to read kyc-documents
CREATE POLICY "anon_read_kyc" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'kyc-documents');
