import { getLessonById, getCourseById } from "@/libs/data";
import LessonDetail from "@/app/main/courses/[courseId]/lesson/[lessonId]/LessonDetail";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {

  const { courseId, lessonId } = await params;

  // Obtener curso y lección desde el mock data
  const course = await getCourseById(courseId);
  const lesson = await getLessonById(courseId, lessonId);

  // Manejo básico si no se encuentra
  if (!course || !lesson) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "80vh",
          color: "gray",
        }}
      >
        <h2>Lección no encontrada</h2>
      </div>
    );
  }
  return <LessonDetail courseId={courseId} lessonId={lessonId} />;
}
