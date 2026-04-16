-- Temp anon policies for CRM operations (remove after auth)

-- Notes: read and insert
CREATE POLICY "anon_read_notes" ON public.notes FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_notes" ON public.notes FOR INSERT TO anon WITH CHECK (true);

-- Verification checks: read, insert, update
CREATE POLICY "anon_read_checks" ON public.verification_checks FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_checks" ON public.verification_checks FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_checks" ON public.verification_checks FOR UPDATE TO anon USING (true);

-- Application documents: anon read (for CRM to view uploaded docs)
CREATE POLICY "anon_read_docs" ON public.application_documents FOR SELECT TO anon USING (true);

-- Applications: anon update (for status changes from CRM)
CREATE POLICY "anon_update_applications" ON public.applications FOR UPDATE TO anon USING (true);
