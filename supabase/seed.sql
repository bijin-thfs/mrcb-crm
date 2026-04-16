-- Re-seed: Branches
INSERT INTO public.branches (id, name, code, address, phone, manager_name) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Mayyanad Main Branch', 'MRCB-001', 'Mayyanad, Kollam, Kerala', '0474-2555265', 'Branch Manager'),
  ('b1000000-0000-0000-0000-000000000002', 'Kollam West Branch', 'MRCB-002', 'Kollam West, Kerala', '0474-2557350', 'Branch Manager'),
  ('b1000000-0000-0000-0000-000000000003', 'Paravur East Branch', 'MRCB-003', 'Paravur, Kollam, Kerala', '0474-2512345', 'Branch Manager')
ON CONFLICT (code) DO NOTHING;

-- Re-seed: Customers
INSERT INTO public.customers (id, full_name, name_malayalam, date_of_birth, gender, father_spouse_name, mobile, email, occupation, annual_income, address_line1, city, district, state, pincode, aadhaar_number, pan_number, kyc_status) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Rahul Janardhanan', 'രാഹുൽ ജനാർദ്ദനൻ', '1990-05-15', 'male', 'Janardhanan K.', '9876543210', 'rahul.j@example.com', 'salaried', '5l-10l', '12/A Lakeside Road', 'Mayyanad', 'Kollam', 'Kerala', '691302', '9876 5432 1098', 'ABCDE1234F', 'verified'),
  ('c1000000-0000-0000-0000-000000000002', 'Sreelekshmi V.', 'ശ്രീലക്ഷ്മി വി.', '1985-11-22', 'female', 'Vijayan P.', '9876543211', 'sv_22@example.com', 'self-employed', '1l-5l', '45 Temple Street', 'Kollam', 'Kollam', 'Kerala', '691001', '8765 4321 0987', 'BCDEF2345G', 'verified'),
  ('c1000000-0000-0000-0000-000000000003', 'Kiran Kumar M.', 'കിരൺ കുമാർ എം.', '1992-03-08', 'male', 'Mohan Kumar', '9876543212', 'kiran.m@example.com', 'business', '5l-10l', '78 Market Road', 'Paravur', 'Kollam', 'Kerala', '691301', '7654 3210 9876', 'CDEFG3456H', 'pending'),
  ('c1000000-0000-0000-0000-000000000004', 'Anjali Das', 'അഞ്ജലി ദാസ്', '1988-07-30', 'female', 'Das P.K.', '9876543213', 'anjali.das@example.com', 'salaried', '1l-5l', '23 Beach Road', 'Mayyanad', 'Kollam', 'Kerala', '691302', '6543 2109 8765', 'DEFGH4567I', 'verified')
ON CONFLICT (mobile) DO NOTHING;

-- Re-seed: Applications
INSERT INTO public.applications (id, reference_number, customer_id, account_type, status, source, account_variant, cheque_book, initial_deposit, vkyc_status, submitted_at) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'MRCB-20240001', 'c1000000-0000-0000-0000-000000000001', 'savings', 'reviewing', 'online_portal', 'regular', true, 5000, 'completed', now() - interval '2 days'),
  ('a1000000-0000-0000-0000-000000000002', 'MRCB-20240002', 'c1000000-0000-0000-0000-000000000002', 'current', 'approved', 'manual_entry', 'regular', true, 10000, 'completed', now() - interval '5 days'),
  ('a1000000-0000-0000-0000-000000000003', 'MRCB-20240003', 'c1000000-0000-0000-0000-000000000003', 'savings', 'new', 'online_portal', 'zero-balance', false, 0, 'not_started', now() - interval '1 day'),
  ('a1000000-0000-0000-0000-000000000004', 'MRCB-20240004', 'c1000000-0000-0000-0000-000000000004', 'fd', 'vkyc_pending', 'online_portal', 'regular', false, 50000, 'scheduled', now() - interval '3 days')
ON CONFLICT (reference_number) DO NOTHING;

-- Re-seed: Activity log
INSERT INTO public.activity_log (action, entity_type, entity_id, details) VALUES
  ('application_submitted', 'application', 'a1000000-0000-0000-0000-000000000001', '{"customer_name": "Rahul Janardhanan", "account_type": "savings"}'::jsonb),
  ('application_submitted', 'application', 'a1000000-0000-0000-0000-000000000003', '{"customer_name": "Kiran Kumar M.", "account_type": "savings"}'::jsonb),
  ('kyc_verified', 'customer', 'c1000000-0000-0000-0000-000000000001', '{"staff_name": "Elite Concierge", "doc_type": "aadhaar"}'::jsonb),
  ('application_approved', 'application', 'a1000000-0000-0000-0000-000000000002', '{"customer_name": "Sreelekshmi V.", "account_type": "current"}'::jsonb);
