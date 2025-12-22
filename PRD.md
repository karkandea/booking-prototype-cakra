PRD – Sports Field Booking Platform (Prototype)
1. Document Info

Product Name: Sports Field Booking Platform

Stage: Prototype (UI-first, dummy data)

Owner: Arkan

Purpose: Client demo, feedback gathering, sales & pitch deck support

Target Release: Prototype-ready (no real integration)

2. Background & Context

Saat ini banyak pemilik lapangan olahraga masih mengandalkan proses manual (WhatsApp, Excel, admin manual) untuk mengelola booking dan pembayaran. Hal ini menyebabkan:

Friksi tinggi untuk user saat booking

Overbooking & human error

Kurangnya visibilitas jadwal & revenue untuk owner

Prototype ini dibuat bukan untuk production, melainkan untuk:

Menunjukkan alur end-to-end booking

Memberi gambaran experience user & owner

Mengumpulkan feedback cepat dari klien

Mempercepat pitching & deal validation

3. Goals & Success Criteria
Goals

Menyediakan visual & interaktif prototype booking lapangan end-to-end

Memvalidasi alur booking & payment UX

Mendukung sales & pitch deck (storytelling lebih konkret)

Mengumpulkan early feedback klien sebelum real development

Success Criteria

Klien memahami alur produk tanpa penjelasan teknis

Klien bisa memberikan feedback konkret (fitur, flow, UI)

Prototype bisa dipakai sebagai demo sales tool

Pitch deck lebih cepat dilempar ke klien

4. Scope
In Scope (Prototype)

UI Frontend (Web)

Dummy data (lapangan, jadwal, booking)

Dummy payment flow (mock success / failed)

Simulasi barcode ticket

Simulasi dashboard owner

Out of Scope (Phase ini)

Real payment gateway

Real database & authentication

Security, performance, scalability

Production readiness

5. User Personas & Roles
1. User (Customer / Booker)

Orang yang ingin booking lapangan olahraga.

Goals:

Melihat lapangan

Cek jadwal

Booking cepat & jelas

Dapat bukti booking

2. Owner (Pemilik Lapangan)

Pemilik atau admin lapangan.

Goals:

Melihat jadwal booking

Melihat status booking

Validasi booking (manual / visual)

6. User Journey (High Level)
User Flow

Open landing page

Lihat foto & detail lapangan

Klik Book

Isi data user

Pilih lokasi / tanggal / jam / durasi

Konfirmasi booking

Pilih metode pembayaran (dummy)

Payment success (simulasi)

Dapat email + barcode (mock)

Owner Flow

Open dashboard

Lihat daftar booking

Lihat detail booking

Scan / validasi barcode (visual only)

7. Functional Requirements
7.1 Landing Page

Menampilkan:

Hero section

Foto lapangan

Deskripsi singkat

CTA “Book Now”

Data: dummy

7.2 Booking Form

Field:

Nama

Email

No HP

Validation:

Required field

Basic format validation

Error & confirmation state (UI only)

7.3 Schedule Selection

Pilih:

Lokasi (jika lebih dari 1)

Tanggal

Jam

Durasi

Availability:

Dummy available / unavailable slot

Confirmation screen sebelum lanjut

7.4 Payment (Dummy)

Payment method:

Fully paid

Partial / DP

Payment gateway:

Dummy screen

Button: “Simulate Success” / “Simulate Failed”

7.5 Booking Confirmation

Success state:

Success message

Booking ID (dummy)

Barcode (static / generated image)

Failed state:

Error message (static)

7.6 Owner Dashboard (Simple)

List booking:

Nama user

Jadwal

Status payment

Detail booking:

Booking info

Barcode preview

Tidak ada edit / real action

8. Non-Functional Requirements (Prototype)

Fast loading (static / lightweight)

Clear visual hierarchy

Mobile-friendly (responsive)

Fokus ke clarity, bukan security

9. User Acceptance Criteria (Prototype)
User Acceptance – Customer

User bisa menyelesaikan flow booking tanpa kebingungan

User paham kapan booking dianggap berhasil

User paham bukti booking berupa barcode

User Acceptance – Owner

Owner bisa melihat booking masuk

Owner paham cara verifikasi booking via barcode

Owner paham nilai produk tanpa penjelasan teknis

10. Assumptions

Klien paham ini prototype, bukan final product

Semua data & payment adalah simulasi

Fokus pada experience & flow, bukan backend logic

11. Risks & Mitigation
Risk	Mitigation
Klien mengira ini sudah production-ready	Jelaskan scope sejak awal
Feedback terlalu teknis	Arahkan diskusi ke flow & UX
Scope creep	Lock feature ke prototype-only
12. Next Phase (After Prototype Approved)

Finalize feature list

Define real payment & DB requirement

Architecture & tech stack decision

Real development phase