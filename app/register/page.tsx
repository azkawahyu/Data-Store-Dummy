"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import RegisterForm from "@/components/register/RegisterForm";
import type {
  UserFormErrors,
  UserFormState,
} from "@/components/register/types";
import {
  EMAIL_MAX_LENGTH,
  EMAIL_REGEX,
  NIP_MAX_LENGTH,
  NIP_MIN_LENGTH,
  NIP_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from "@/lib/validations/userRules";

const initialForm: UserFormState = {
  username: "",
  nip: "",
  email: "",
  password: "",
  role_id: "",
  employee_id: "",
};

function validateForm(form: UserFormState): UserFormErrors {
  const errors: UserFormErrors = {};

  if (!form.username.trim()) {
    errors.username = "Username wajib diisi.";
  } else if (!USERNAME_REGEX.test(form.username.trim())) {
    errors.username =
      "Username hanya boleh huruf, angka, titik, garis bawah, atau strip.";
  } else if (form.username.trim().length < USERNAME_MIN_LENGTH) {
    errors.username = "Username minimal 3 karakter.";
  } else if (form.username.trim().length > USERNAME_MAX_LENGTH) {
    errors.username = "Username maksimal 100 karakter.";
  }

  if (!form.nip.trim()) {
    errors.nip = "NIP wajib diisi.";
  } else if (!NIP_REGEX.test(form.nip.trim())) {
    errors.nip = "NIP hanya boleh berisi angka.";
  } else if (form.nip.trim().length < NIP_MIN_LENGTH) {
    errors.nip = "NIP minimal 8 digit.";
  } else if (form.nip.trim().length > NIP_MAX_LENGTH) {
    errors.nip = "NIP maksimal 50 digit.";
  }

  if (!form.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (form.email.trim().length > EMAIL_MAX_LENGTH) {
    errors.email = "Email maksimal 150 karakter.";
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = "Format email tidak valid.";
  }

  if (!form.password.trim()) {
    errors.password = "Password wajib diisi.";
  } else if (form.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = "Password minimal 8 karakter.";
  } else if (!PASSWORD_REGEX.test(form.password)) {
    errors.password = "Password harus mengandung huruf dan angka tanpa spasi.";
  }

  return errors;
}

async function fetchJson(
  input: RequestInfo,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; data: unknown }> {
  const response = await fetch(input, init);
  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return { ok: response.ok, status: response.status, data };
}

function extractMessage(data: unknown, fallback: string): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as { message?: unknown }).message === "string"
  ) {
    return (data as { message: string }).message;
  }

  return fallback;
}

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState<UserFormState>(initialForm);
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof UserFormState, boolean>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const isFormValid = useMemo(
    () => Object.keys(validateForm(form)).length === 0,
    [form],
  );

  function onChangeField(field: keyof UserFormState, value: string) {
    const normalizedValue = field === "nip" ? value.replace(/\D/g, "") : value;

    setForm((previous) => {
      const next = { ...previous, [field]: normalizedValue };

      if (touched[field]) {
        const currentErrors = validateForm(next);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: currentErrors[field],
        }));
      }

      return next;
    });
  }

  function onBlurField(field: keyof UserFormState) {
    setTouched((previous) => ({ ...previous, [field]: true }));
    const currentErrors = validateForm(form);
    setErrors((previous) => ({ ...previous, [field]: currentErrors[field] }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const allTouched: Partial<Record<keyof UserFormState, boolean>> = {
      username: true,
      nip: true,
      email: true,
      password: true,
      role_id: true,
      employee_id: true,
    };
    setTouched(allTouched);

    const validation = validateForm(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      toast.push("Mohon lengkapi data registrasi.", "error");
      return;
    }

    setSubmitting(true);
    const result = await fetchJson("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: form.username.trim(),
        password: form.password,
        nip: form.nip.trim(),
        email: form.email.trim(),
      }),
    });

    setSubmitting(false);

    if (!result.ok) {
      toast.push(extractMessage(result.data, "Registrasi gagal."), "error");
      return;
    }

    toast.push(
      extractMessage(result.data, "User berhasil didaftarkan."),
      "success",
    );
    setForm(initialForm);
    setErrors({});
    setTouched({});
    router.replace("/login");
  }

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
        <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Daftar Akun
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Daftarkan akun baru untuk mengakses sistem.
              </p>
            </div>
            {/* <Link
              href="/login"
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-800"
            >
              Kembali ke Login
            </Link> */}
          </div>

          {!isFormValid ? (
            <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Pastikan semua field wajib terisi dan format data benar.
            </p>
          ) : null}

          <RegisterForm
            form={form}
            errors={errors}
            roles={[]}
            employees={[]}
            autoLinkHint=""
            showAdminFields={false}
            submitLabel="Daftar"
            submitting={submitting}
            onChangeField={onChangeField}
            onBlurField={onBlurField}
            onSubmit={onSubmit}
          />

          <p className="mt-4 text-center text-sm text-slate-600">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-700 hover:text-indigo-800"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
