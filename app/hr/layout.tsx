import AppShell from "@/components/layout/AppShell";

export default function HrLayout({ children }: { children: React.ReactNode }) {
  return <AppShell showSidebar={true}>{children}</AppShell>;
}
