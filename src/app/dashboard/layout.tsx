import DashBoardSidebar from "@/components/dashboard/dashboard-sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative">
      <div className="max-w-7xl flex flex-row w-full mx-auto">
        <DashBoardSidebar />
        <div className="w-full flex ">{children}</div>
      </div>
    </main>
  );
}
