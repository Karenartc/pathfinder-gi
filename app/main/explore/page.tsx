import Link from "next/link";
import { ROUTES } from "@/libs/routes";

export default function ExplorePage() {
    return (
        <main>
        <h1>Explorar</h1>

        <Link
            href={ROUTES.details.place("p1")} 
        >
            Ver detalles de la Biblioteca
        </Link>
        </main>
    );
}
