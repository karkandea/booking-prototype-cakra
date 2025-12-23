X. Brand Theme Customization (Prototype – Frontend Only)
Objective

Memberikan kemampuan kepada Owner untuk mengatur warna brand (theme) yang akan diterapkan secara konsisten di:

Homepage / landing page

Booking flow

Payment page

Booking confirmation

Fitur ini bertujuan untuk:

Simulasi pengalaman white-label ke klien

Mendukung demo & pitching

Mengumpulkan feedback visual dari klien

Fitur ini bersifat prototype-only dan frontend-only.

Scope & Constraints
In Scope

Custom warna berbasis theme

Akses melalui halaman /owner/settings

Perubahan langsung terlihat di homepage & booking flow

Data bersifat dummy (local state / static)

Out of Scope

Custom layout

Custom component behavior

Custom font family

Backend persistence

Multi-user / multi-brand logic

User Role

Owner (Pemilik Lapangan)

Owner memiliki akses ke halaman pengaturan brand untuk mengatur warna identitas lapangan.

User Flow – Brand Customization

Owner membuka halaman /owner

Owner masuk ke menu Brand Settings

Owner mengatur warna brand

Owner menyimpan pengaturan (dummy save)

Owner membuka homepage

Homepage & booking flow tampil sesuai theme yang diatur

Brand Settings – Functional Requirements
Location

URL: /owner/settings

Editable Theme Properties (Dummy)

Owner dapat mengatur warna berikut:

Property	Description
Primary Color	Warna utama (button, CTA, highlight)
Secondary Color	Warna pendukung
Accent Color	Badge, active state
Background Color	Background utama
Text Primary Color	Teks utama
Text Secondary Color	Teks pendukung
UI Behavior

Menggunakan color picker atau preset color

Preview langsung (real-time preview)

Tombol:

Save Changes (dummy)

Reset to Default

Theme Application Rules

Theme yang diatur oleh Owner akan diterapkan ke:

Homepage / landing page

Booking CTA & button

Booking step indicator

Payment method highlight

Badge & status label

Success & error message highlight

❗ Layout dan struktur UI tidak berubah

Data Handling (Prototype)

Theme disimpan sebagai:

Local state

Static object

In-memory config

Tidak ada:

Database

API call

Authentication check

Preview & Simulation Rules

Perubahan warna langsung terlihat tanpa refresh

Theme hanya berlaku untuk sesi demo

Data akan reset saat reload (acceptable for prototype)

Acceptance Criteria – Brand Customization
Owner Acceptance

Owner bisa mengubah warna brand dengan mudah

Owner langsung melihat dampaknya di homepage

Owner paham bahwa ini simulasi white-label

Client Acceptance

Klien bisa membayangkan brand mereka menggunakan sistem ini

Klien merasa UI “milik mereka”

Klien bisa memberi feedback warna sebelum real development

Assumptions

Klien memahami ini adalah prototype

Customisasi hanya sebatas warna

Tidak ada komitmen teknis untuk custom layout

Risks & Mitigation
Risk	Mitigation
Klien minta custom desain penuh	Jelaskan batasan sejak demo
Ekspektasi persistence	Tegaskan ini frontend-only
Scope creep	Lock customization ke color token
Next Phase (After Prototype Approval)

Persist theme ke database

Multi-brand support

Theme validation (contrast, accessibility)

Advanced theme management (preset + custom)