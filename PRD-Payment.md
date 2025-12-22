7.X Payment Flow (Prototype – Dummy, Xendit-like)
Objective

Mensimulasikan pengalaman pembayaran seperti menggunakan payment gateway Xendit untuk membantu klien memahami:

Opsi metode pembayaran yang tersedia

Alur user setelah memilih metode

State sukses / gagal pembayaran

Tidak ada real transaksi. Semua flow bersifat simulasi UI.

Supported Payment Methods (Dummy)

Prototype WAJIB menampilkan opsi metode pembayaran yang umum disediakan oleh Xendit:

1. Virtual Account (Bank Transfer)

BCA Virtual Account

BNI Virtual Account

BRI Virtual Account

Mandiri Virtual Account

Permata Virtual Account

CIMB Niaga Virtual Account

UI Behavior (Dummy):

User memilih bank

Sistem menampilkan:

Nomor Virtual Account (dummy)

Total pembayaran

Instruksi singkat

Tombol:

Simulate Payment Success

Simulate Payment Failed

2. QRIS

QRIS (All Payment)

UI Behavior (Dummy):

Tampilkan QR code statis (dummy)

Countdown timer (opsional, visual only)

Tombol:

I’ve Paid (Simulate Success)

Cancel Payment

3. E-Wallet

GoPay

OVO

DANA

ShopeePay

LinkAja

UI Behavior (Dummy):

Tampilkan logo e-wallet

Info instruksi singkat (contoh: “Open GoPay app to complete payment”)

Tombol:

Simulate Success

Simulate Failed

4. Retail Outlet (Over-the-counter)

Alfamart

Indomaret

UI Behavior (Dummy):

Tampilkan:

Payment code (dummy)

Instruksi singkat

Tombol:

Simulate Paid

Cancel

5. Credit / Debit Card

Visa

Mastercard

UI Behavior (Dummy):

Input field:

Card number (masked)

Expiry date

CVV

Tidak ada validasi real

Tombol:

Pay Now (Simulate Success)

Fail Payment

Payment Flow Detail (Prototype)

User memilih payment method

Sistem menampilkan detail pembayaran sesuai metode

User menekan tombol simulasi

Sistem mengarahkan ke state:

✅ Payment Success

❌ Payment Failed

Payment States
Success State

Tampilkan:

Success message

Booking ID (dummy)

Payment method used

Lanjut ke:

Booking confirmation

Barcode / QR booking ticket

Failed State

Tampilkan:

Error message non-teknis

CTA:

“Choose another payment method”

“Try again”

Rules & Constraints

Tidak ada:

Callback

Webhook

Retry logic

Timeout handling

Semua payment state dikontrol oleh UI action

Tujuan utama: visual clarity & storytelling

Acceptance Criteria (Payment – Prototype)

User bisa melihat beragam opsi pembayaran

User memahami perbedaan alur tiap metode

Klien bisa membayangkan integrasi payment real di fase berikutnya

Flow payment mendukung pitching & demo