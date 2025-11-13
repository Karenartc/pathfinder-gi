"use client";

import styles from "./admin.module.css";
import { useEffect, useState } from "react";
import { Users, BookOpen, Trophy, Bell, MapPin, CalendarDays, Star } from "lucide-react";
import NavbarAdmin from "@/components/commons/NavbarAdmin";
import Footer from "@/components/commons/Footer";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.ok) {
          setUsers(data.users);
          setCourses(data.modules);
          setEvents(data.events);
        } else {
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("❌ Error cargando dashboard:", err);
      }
    };

    load();
  }, [user]);

  // ─────────── MÉTRICAS
  const totalUsers = users.length;
  const avgPoints = users.length
    ? Math.round(users.reduce((sum, u) => sum + (u.totalPoints || 0), 0) / users.length)
    : 0;
  const avgCourseProgress = courses.length
    ? Math.round(
        courses.reduce((sum, c) => sum + (c.progress || 0), 0) / courses.length
      )
    : 0;
  const totalEvents = events.length;

  const pointsByCareer = users.reduce<Record<string, number[]>>((acc, u) => {
    const career = u.career || "Desconocido";
    if (!acc[career]) acc[career] = [];
    acc[career].push(u.totalPoints || 0);
    return acc;
  }, {});

  const careerData = Object.entries(pointsByCareer).map(([career, points]) => ({
    carrera: career,
    promedio: Math.round(points.reduce((sum, p) => sum + p, 0) / points.length),
  }));

  const kpis = [
    { label: "Usuarios activos", value: totalUsers, icon: <Users /> },
    { label: "Promedio de puntos", value: avgPoints, icon: <Star /> },
    { label: "Avance promedio cursos", value: `${avgCourseProgress}%`, icon: <BookOpen /> },
    { label: "Eventos próximos", value: totalEvents, icon: <CalendarDays /> },
  ];

  const topUsers = [...users].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0)).slice(0, 10);

  return (
    <>
      <NavbarAdmin />

      <main className={styles.adminDashboard}>
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

        <section className={styles.chartsRow}>
          <div className={styles.chartCard}>
            <h3>Progreso de cursos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Bar dataKey="progress" fill="#c7923e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartCard}>
            <h3>Promedio de puntos por carrera</h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={careerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />

                <XAxis type="number" stroke="#aaa" />

                <YAxis
                  type="category"
                  dataKey="carrera"
                  width={160}                          
                  interval={0}                       
                  tick={{ fontSize: 14, fontWeight: 500 }} 
                  stroke="#aaa"
                />

                <Tooltip wrapperStyle={{ fontSize: 14 }} />

                <Bar
                  dataKey="promedio"
                  fill="#c7923e"
                  radius={[0, 6, 6, 0]}
                  barSize={24}  // opcional: barras más delgadas
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </section>

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
                  <td>{u.fullName || u.name}</td>
                  <td>{u.career || "—"}</td>
                  <td>{u.totalPoints || 0}</td>
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
