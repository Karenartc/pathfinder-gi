import { getLessonById, getCourseById } from "@/libs/data";
import LessonDetail from "./LessonDetail";

export default async function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const { courseId, lessonId } = params;

  // 🔍 Obtener curso y lección desde el mock data
  const course = await getCourseById(courseId);
  const lesson = await getLessonById(courseId, lessonId);

  if (!course || !lesson) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <h2>Lección no encontrada</h2>
        <p>Revisa que el curso y la lección existan en el mock data.</p>
      </div>
    );
  }

  return <LessonDetail courseId={course.id} lessonId={lesson.id} />;
}
