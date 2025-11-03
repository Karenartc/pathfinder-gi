import { getCoursesDetail } from "@/libs/data/mock";
import CoursesClient from "@/components/courses/CoursesClient";

export default async function CoursesPage() {
  const courses = await getCoursesDetail();
  return <CoursesClient courses={courses} />;
}
