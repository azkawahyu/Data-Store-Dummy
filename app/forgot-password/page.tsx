import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/background/background_login.jpeg')",
        }}
      />
      <div className="absolute inset-0 bg-slate-900/35" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/90 p-6 text-center shadow-xl backdrop-blur-sm sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Lupa Password
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Fitur reset password masih dalam pengembangan.
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Silakan hubungi admin untuk bantuan sementara.
          </p>

          {/* <Link
            href="/login"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 px-4 text-sm font-semibold text-white transition hover:from-indigo-700 hover:to-violet-700"
          >
            Kembali ke Login
          </Link> */}
        </div>
      </div>
    </main>
  );
}
