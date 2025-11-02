import '../globals.css';
import NavbarUser from '@/components/commons/NavbarUser';
import Footer from '@/components/commons/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <NavbarUser />
        <main className="section">{children}</main>
        <Footer />
        </>
    );
}
