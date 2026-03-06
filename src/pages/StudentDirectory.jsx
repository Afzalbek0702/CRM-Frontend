import { FaSearch, FaFilter, FaDownload } from "react-icons/fa";

export default function StudentDirectory() {
  return (
    <section className="student-directory">
      {/* Header */}
      <div className="student-directory__header">
        <h2>Yalabalar katalogi</h2>

        <div className="student-directory__actions">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search student ID or name..."
            />
          </div>

          <button className="btn btn-secondary">
            <FaFilter />
            <span>Filter</span>
          </button>

          <button className="btn btn-primary">
            <FaDownload />
            <span>Yuklab olish</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="student-directory__table">
        <table>
          <thead>
            <tr>
              <th>O'quvchi ID raqami</th>
              <th>Ismi</th>
              <th>Holati</th>
              <th>Davomat</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>data</td>
              <td>data</td>
              <td>
                <span className="status status-active">data</span>
              </td>
              <td>
                <div className="attendance">
                  <div className="attendance-bar" />
                  <span>data</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
