import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { useStudent } from "../services/student/useStudent";
import { FaArrowLeft, FaUsers } from "react-icons/fa";
import { useGroups } from "../services/group/useGroups";
import { goBack } from "../utils/navigate.js";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchById, loading, error } = useStudent();
  const [student, setStudent] = useState(null);
  const { groups } = useGroups();
  const [fullGroups, setFullGroups] = useState([]);

  useEffect(() => {
    const loadStudent = async () => {
      const data = await fetchById(id);
      setStudent(data);

      if (data?.group) {
        const mapped = groups.filter((g) => g.id === data.group.id);
        setFullGroups(mapped);
      } else {
        setFullGroups([]);
      }
    };
    loadStudent();
  }, [id, groups]);

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;
  if (!student) return <Loader />;

  const formatDate = (d) => {
    if (!d) return "";
    return String(d).split("T")[0];
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="outline" onClick={goBack}>
          Ortga
        </Button>

        <Button variant="outline" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </Button>
      </div>

      <h2 className="text-xl font-semibold">{student.full_name}</h2>

      <Card>
        <CardHeader>
          <CardTitle>Ma'lumotlar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Telefon raqam:</strong> {student.phone}
          </p>
          <p>
            <strong>Tug'ilgan kun:</strong> {formatDate(student.birthday)}
          </p>
          <p>
            <strong>Ota-ona ismi:</strong> {student.parents_name}
          </p>
          <p>
            <strong>Balance:</strong>{" "}
            {student.balance?.toLocaleString() ?? 0} so'm
          </p>
        </CardContent>
      </Card>

      <h3 className="flex items-center gap-2 text-lg font-medium">
        <FaUsers /> Guruh
      </h3>

      {fullGroups && fullGroups.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guruh nomi</TableHead>
              <TableHead>Kurs turi</TableHead>
              <TableHead>Narxi</TableHead>
              <TableHead>Dars vaqti</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fullGroups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.course_type}</TableCell>
                <TableCell>{group.price}</TableCell>
                <TableCell>{group.lesson_time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-muted-foreground">Guruh mavjud emas</p>
      )}
    </div>
  );
}
