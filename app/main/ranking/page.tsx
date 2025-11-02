import { getUser } from "@/libs/data/mock";
import { getRankingGlobal, getRankingByCareer } from "@/libs/data/mock";
import RankingView from "@/components/ranking/RankingView";

export const revalidate = 0;

export default async function RankingPage() {

    const user = await getUser();
    const [globalData, careerData] = await Promise.all([
        getRankingGlobal(),
        getRankingByCareer(user.career ?? ""),
    ]);

    return (
        <main className="container">

            <RankingView
            globalData={globalData}
            careerData={careerData}
            currentUserId={user.id}
            userCareer={user.career ?? "Mi carrera"}
            />

        </main>
    );
}
