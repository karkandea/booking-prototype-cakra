1. Agent Purpose

Agent ini bertugas membangun prototype UI booking lapangan olahraga dengan tujuan:

Demo ke klien

Mengumpulkan feedback

Mendukung pitching & sales deck

Agent TIDAK membangun production system.

2. Core Principles

UI-first

Speed over perfection

Dummy data over real integration

Visual clarity over technical correctness

Jika ragu antara:

“Ini realistis secara backend?”
atau
“Ini enak dilihat & mudah dipahami klien?”

➡️ Pilih yang kedua.

3. Scope of Work (Agent Allowed)
✅ Allowed

Frontend UI (Web)

Static / mock data

Simulated flows

Dummy payment behavior

Fake booking states

Static barcode / mock QR

Hardcoded JSON / local state

Simple conditional logic (success / failed)

❌ Not Allowed

Real payment gateway

Real authentication

Real database

Security logic

Edge-case production handling

Performance optimization

Complex backend logic

4. User Roles (Prototype Context)
4.1 Customer (User)

Book lapangan

Isi data

Pilih jadwal

Simulasi payment

Terima booking confirmation + barcode

4.2 Owner (Lapangan)

Lihat dashboard

Lihat booking list

Lihat detail booking

Scan / lihat barcode (visual only)

5. Functional Expectations per Role
Customer Flow (Must Work)

Open landing page

View lapangan & photos

Click “Book”

Fill form (dummy validation)

Select schedule

Confirm booking

Choose payment method

Simulate payment success / failed

See booking confirmation

❗ No login required

Owner Flow (Must Work)

Open owner dashboard (direct access)

View list of bookings (dummy)

Click booking detail

See barcode & status

❗ No role-based access control

6. Dummy Data Rules

Semua data boleh:

Hardcoded

JSON static

Local state

Contoh:

{
  "field_name": "Futsal Arena A",
  "price_per_hour": 150000,
  "available_slots": ["18:00", "19:00", "20:00"]
}


Booking ID, barcode, email → fake but realistic

7. Dummy Payment Rules
Payment States

Agent WAJIB menyediakan:

Success

Failed

Contoh implementasi:

Button:

“Simulate Payment Success”

“Simulate Payment Failed”

Tidak ada:

Retry logic

Timeout

Callback handling

8. UI/UX Rules

Flow harus bisa dipahami tanpa penjelasan verbal

Copywriting sederhana & non-teknis

Fokus ke:

CTA jelas

Step-by-step flow

Clear success / error state

❌ Hindari:

Error teknis

Terminologi developer

Loading state kompleks

9. Assumptions to Always Hold

Ini prototype demo

Klien tidak akan input data real

Semua flow adalah visual simulation

Tujuan utama: cerita produk, bukan sistem

10. Output Definition (Done Criteria)

Agent dianggap DONE jika:

Flow booking bisa diselesaikan end-to-end

Payment bisa disimulasikan

Barcode tampil

Owner dashboard bisa dilihat

Prototype bisa dipresentasikan ke klien

11. Communication Rule

Jika agent ingin:

Menambah fitur

Mengubah flow

Menyentuh backend real

➡️ WAJIB STOP & ASK OWNER (Arkan).

12. Next Phase Awareness

Agent harus sadar bahwa:

Real development akan dilakukan di fase berikutnya

Prototype ini akan jadi referensi, bukan fondasi teknis

Kalau lo mau, next step paling efektif:

🔹 Convert agent.md + prd.md → prompt Codex / Task Master

🔹 Bikin checklist halaman (Landing, Booking, Payment, Dashboard)

🔹 Mapping agent ini ke pitch deck slide-by-slide