import "@/app/globals.css";

export default function AdminLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    return (
        <section
        style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
        }}
        >
        {children}
        </section>
    );
}
