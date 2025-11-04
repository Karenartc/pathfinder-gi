import { getPlaces } from "@/libs/data";
import ExploreSection from "@/components/explore/ExploreSection";

export default async function ExplorePage() {
    const places = await getPlaces();
    return <ExploreSection places={places} />;
}
