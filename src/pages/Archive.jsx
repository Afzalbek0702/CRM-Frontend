import { useParams } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import { useArchive } from "../services/archive/useArchive.js";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

import "./Archive.css";

export default function Archive() {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const {
    archivedGroups = [],
    useAllArchivedStudents,
    useAllArchivedLeads,
    useAllArchivedPayments,
    useAllArchivedTeachers

  } = useArchive();

  const { data: students = [], isLoading: loadingStudents, error: errorStudents } = useAllArchivedStudents();
  const { data: leads = [], isLoading: loadingLeads, error: errorLeads } = useAllArchivedLeads();
  const { data: payments = [], isLoading: loadingPayments, error: errorPayments } = useAllArchivedPayments();
  const { data: teachers = [], isLoading: loadingTeachers, error: errorTeachers } = useAllArchivedTeachers();

  if (
    (category === "students" && loadingStudents) ||
    (category === "leads" && loadingLeads) ||
    (category === "payments" && loadingPayments) ||
    (category === "teachers" && loadingTeachers)
  )
    return <Loader />;
  if (
    (category === "students" && errorStudents) ||
    (category === "leads" && errorLeads) ||
    (category === "payments" && errorPayments) ||
    (category === "teachers" && errorTeachers)
  )
    return <div className="archive-error">Error loading {category}</div>;

  if (!["students", "leads", "payments", "groups", "teachers"].includes(category)) {
    return <div className="archive-error">Invalid category</div>;
  }

  return (
    <div className="archive-container">
      <h2>Arxiv -
        <span>
          {category === "students" ? "O'quvchilar" :
            category === "teachers" ? "O'qituvchilar" :
              category === "payments" ? "To'lovlar" :
                category === "groups" ? "Guruhlar" :
                  category === "leads" ? "Lidlar" : ""}</span>
      </h2>

      {category === "students" && (


        <>

          <div className="filters">
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(Number(e.target.value) || "")}
            >
              <option value="">Hamma O'qtuvchilar</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.full_name}</option>
              ))}
            </select>

            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(Number(e.target.value) || "")}
            >
              <option value="">Hamma Guruhlar</option>
              {archivedGroups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>





          <div className="archive-search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search students by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>


        </>


      )}

      <div className="archive-table-container">
        {category === "students" && (
          <table>
            <thead>
              <tr>
                <th>Ism</th>
                <th>Guruh</th>
                <th>Telefon raqam</th>
                <th>Tug'ilgan kun</th>
                <th>Ota-ona ismi</th>
                <th>Ota-ona raqami</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {students
                ?.filter(s => s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
                .filter((s) =>
                  s.full_name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .filter((s) =>
                  !selectedTeacher ||
                  s.groups?.some(studentGroupName => {
                    const groupObj = archivedGroups.find(g => g.name === studentGroupName);
                    return groupObj?.teacher_id === selectedTeacher;
                  })
                )
                .filter((s) =>
                  !selectedGroup || s.archivedGroups?.includes(
                    archivedGroups.find(g => g.id === selectedGroup)?.name
                  )
                )
                .map(s => (
                  <tr key={s.id}>
                    <td>{s.full_name}</td>
                    <td>{s.groups?.[0] || "No Group"}</td>
                    <td>{s.phone}</td>
                    <td>{s.birthday?.split("T")[0]}</td>
                    <td>{s.parents_name}</td>
                    <td>{s.parents_phone}</td>
                    <td><span className="balance-badge">{s.monthly_paid?.toLocaleString() ?? 0} so'm</span></td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {category === "teachers" && (
          <table>
            <thead>
              <tr>
                <th>Ism</th>
                <th>Telefon raqam</th>
                <th>Manba</th>
              </tr>
            </thead>
            <tbody>
              {teachers?.map(t => (
                <tr key={t.id}>
                  <td>{t.full_name}</td>
                  <td>{t.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {category === "leads" && (
          <table>
            <thead>
              <tr>
                <th>Isn</th>
                <th>Telefon raqam</th>
                <th>Manba</th>
              </tr>
            </thead>
            <tbody>
              {leads?.map(l => (
                <tr key={l.id}>
                  <td>{l.full_name}</td>
                  <td>{l.phone}</td>
                  <td>{l.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {category === "payments" && (
          <table>
            <thead>
              <tr>
                <th>O'quvchi</th>
                <th>Miqdor</th>
                <th>Sana</th>
              </tr>
            </thead>
            <tbody>
              {payments?.map(p => (
                <tr key={p.id}>
                  <td>{p.student_name}</td>
                  <td><span className="balance-badge">{p.amount?.toLocaleString() ?? 0}</span></td>
                  <td>{p.date?.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {category === "groups" && (
          <table>
            <thead>
              <tr>
                <th>Nomi</th>
                <th>Narx</th>
                <th>Dars vaqti</th>
                <th>Kurs turi</th>
                <th>O'qituvchi</th>
                <th>Dars kunlari</th>
              </tr>
            </thead>
            <tbody>
              {archivedGroups.map((g) => (
                <tr key={g.id}>
                  <td>{g.name}</td>
                  <td><span className="balance-badge">{g.price} ming so'm</span></td>
                  <td>{g.lesson_time}</td>
                  <td>{g.course_type}</td>
                  <td className="teacher">{g.teacher}</td>
                  <td>
                    {Array.isArray(g.lesson_days) ? (
                      g.lesson_days.map((day) => (
                        <span
                          key={day}
                          className="day-pill"
                        >
                          {day}
                        </span>
                      ))
                    ) : (
                      <span className="day-pill">{g.lesson_days}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
