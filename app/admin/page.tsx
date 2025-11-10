"use client";

import styles from "./admin.module.css";
import {
  getRankingGlobal,
  getCoursesDetail,
  getAchievements,
  getNotifications,
  getEvents,
  getPlaces
} from "@/libs/data/mock";
import { useEffect, useState } from "react";
import type { User, CourseDetail, Achievement, Notification, Event, Place } from "@/libs/types";
import { Users, BookOpen, Trophy, Bell, MapPin, CalendarDays, Star } from "lucide-react";
import NavbarAdmin from "@/components/commons/NavbarAdmin";
import Footer from "@/components/commons/Footer";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<CourseDetail[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function load() {
      const [u, c, a, n, e ] = await Promise.all([
        getRankingGlobal(),
        getCoursesDetail(),
        getAchievements(),
        getNotifications(),
        getEvents(),
        getPlaces(),
      ]);
      setUsers(u);
      setCourses(c);
      setEvents(e);
    }
    load();
  }, []);

  // ─────────── MÉTRICAS
  const totalUsers = users.length;
  const avgPoints = users.length ? Math.round(users.reduce((sum, u) => sum + u.points, 0) / users.length) : 0;
  const avgCourseProgress = courses.length
    ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
    : 0;
  const totalEvents = events.length;

  // ─────────── PROMEDIO DE PUNTOS POR CARRERA
  const pointsByCareer = users.reduce<Record<string, number[]>>((acc, user) => {
    if (!acc[user.career || "Desconocido"]) acc[user.career || "Desconocido"] = [];
    acc[user.career || "Desconocido"].push(user.points);
    return acc;
  }, {});

  const careerData = Object.entries(pointsByCareer).map(([career, points]) => ({
    carrera: career,
    promedio: Math.round(points.reduce((sum, p) => sum + p, 0) / points.length),
  }));

  // ─────────── KPIs
  const kpis = [
    { label: "Usuarios activos", value: totalUsers, icon: <Users /> },
    { label: "Promedio de puntos", value: avgPoints, icon: <Star /> },
    { label: "Avance promedio cursos", value: `${avgCourseProgress}%`, icon: <BookOpen /> },
    { label: "Eventos próximos", value: totalEvents, icon: <CalendarDays /> },

  ];

  const courseData = courses.map((c) => ({
    name: c.title,
    progreso: (c.lessons.filter((l) => l.completed).length / c.lessons.length) * 100,
  }));

  const topUsers = users.sort((a, b) => b.points - a.points).slice(0, 10);

  return (
    <>
      <NavbarAdmin />

      <main className={styles.adminDashboard}>
        {/* ───── KPIs principales ───── */}
        <section className={styles.kpiGrid}>
          {kpis.map((kpi) => (
            <div key={kpi.label} className={styles.kpiCard}>
              <div className={styles.iconBox}>{kpi.icon}</div>
              <div>
                <p className={styles.kpiLabel}>{kpi.label}</p>
                <h3 className={styles.kpiValue}>{kpi.value}</h3>
              </div>
            </div>
          ))}
        </section>

        {/* ───── Gráficos ───── */}
        <section className={styles.chartsRow}>
          <div className={styles.chartCard}>
            <h3>Progreso de cursos</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={courseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Bar dataKey="progreso" fill="#c7923e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <section className={styles.chartCard}>
          <h3>Promedio de puntos por carrera</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={careerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis type="number" stroke="#aaa" />
              <YAxis type="category" dataKey="carrera" stroke="#aaa" />
              <Tooltip />
              <Bar dataKey="promedio" fill="#c7923e" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        </section>

        {/* ───── Promedio de puntos por carrera ───── */}
        
        {/* ───── Estudiantes recientes ───── */}
        <section className={styles.tableCard}>
          <h3>Estudiantes destacados</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Carrera</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.career}</td>
                  <td>{u.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <Footer />
    </>
  );
}
