import { Logo } from "@/components/landing-page/ui/Logo";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mt-28">
        <Logo size="xl" className="mx-auto" />
      </div>
      {children}
    </div>
  );
}
