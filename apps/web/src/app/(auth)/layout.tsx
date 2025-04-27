export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex place-content-center justify-center">{children}</div>
  );
}
