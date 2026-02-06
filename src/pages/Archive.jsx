import { useParams } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import { useArchive } from "../hooks/useArchive.js";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

import "./Archive.css";

export default function Archive() {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    archivedGroups = [],
    useAllArchivedStudents,
    useAllArchivedLeads,
    useAllArchivedPayments
  } = useArchive();

  const { data: students = [], isLoading: loadingStudents, error: errorStudents } = useAllArchivedStudents();
  const { data: leads = [], isLoading: loadingLeads, error: errorLeads } = useAllArchivedLeads();
  const { data: payments = [], isLoading: loadingPayments, error: errorPayments } = useAllArchivedPayments();

  if ((category === "students" && loadingStudents) ||
    (category === "leads" && loadingLeads) ||
    (category === "payments" && loadingPayments)) return <Loader />;
  if ((category === "students" && errorStudents) ||
    (category === "leads" && errorLeads) ||
    (category === "payments" && errorPayments)) return <div className="archive-error">Error loading {category}</div>;

  if (!["students", "leads", "payments", "groups"].includes(category)) {
    return <div className="archive-error">Invalid category</div>;
  }

  return (
    <div className="archive-container">
      <h2>Archive - {category}</h2>

      {category === "students" && (
        <div className="archive-search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search students by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="archive-table-container">
        {category === "students" && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Group</th>
                <th>Phone</th>
                <th>Birthday</th>
                <th>Parent</th>
                <th>Parent Phone</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {students
                ?.filter(s => s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
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

        {category === "leads" && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Source</th>
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
                <th>Student</th>
                <th>Amount</th>
                <th>Date</th>
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
