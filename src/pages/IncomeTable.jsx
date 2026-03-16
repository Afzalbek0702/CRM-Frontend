import { useState } from "react";
import { usePayments } from "../services/payment/usePayments";
import Loader from "../components/Loader";
import PaymentModal from "../components/PaymentModal";
import ActionMenu from "../components/ActionMenu";
import { useConfirm } from "../components/ConfirmProvider";
import { withConfirm } from "../helpers/withConfirm";
import {
  FaEllipsisV,
  FaUserGraduate,
  FaMoneyBillWave,
  FaUsers,
} from "react-icons/fa";
import { BsCalendar2DateFill, BsCreditCard2BackFill } from "react-icons/bs";

export default function IncomeTable() {
  const confirm = useConfirm();
  const {
    payments,
    isLoading,
    createPayment,
    updatePayment,
    deletePayment,
  } = usePayments();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [actionMenu, setActionMenu] = useState({
    isOpen: false,
    position: { top: 0, left: 0 },
    payment: null,
  });

  if (isLoading) return <Loader />;


  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString() : "";

  const handleDeletePayment = withConfirm(
    confirm,
    "Are you sure you want to delete this payment?",
    async (teacher) => {
      await deletePayment(teacher.id);
      setActionMenu((m) => ({ ...m, isOpen: false }));
    }

  )

  return (
    <div className="table-container">
      {payments && payments.length < 1 ? (
        <p>To'lovlar yo'q</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <BsCalendar2DateFill /> Sana
              </TableHead>

              <TableHead>
                <FaUserGraduate /> O'quvchi
              </TableHead>

              <TableHead>
                <FaUsers /> Guruh
              </TableHead>

              <TableHead>
                <FaMoneyBillWave /> Miqdor
              </TableHead>

              <TableHead>
                <BsCreditCard2BackFill /> Tur
              </TableHead>

              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {(payments || []).map((p) => (
              <TableRow key={p.id}>
                <TableCell>{formatDate(p.paid_at)}</TableCell>

                <TableCell>{p.student_name}</TableCell>

                <TableCell>{p.group_name}</TableCell>

                <TableCell>
                  {p.amount?.toLocaleString() ?? 0} so'm
                </TableCell>

                <TableCell>{p.method}</TableCell>

                <TableCell style={{ width: "10px" }}>
                  <Button
                    className="icon-button"
                    onClick={(e) => {
                      const rect =
                        e.currentTarget.getBoundingClientRect();

                      const menuHeight = 100;
                      const menuWidth = 150;

                      const scrollY = window.scrollY;
                      const scrollX = window.scrollX;

                      const absoluteTop =
                        rect.top + scrollY;
                      const absoluteBottom =
                        rect.bottom + scrollY;

                      const viewportBottom =
                        scrollY + window.innerHeight;
                      const viewportRight =
                        scrollX + window.innerWidth;

                      const top =
                        absoluteBottom + menuHeight >
                          viewportBottom
                          ? absoluteTop -
                          menuHeight -
                          8
                          : absoluteBottom + 8;

                      let left =
                        rect.right +
                        scrollX -
                        menuWidth;
                      if (
                        left + menuWidth >
                        viewportRight
                      ) {
                        left =
                          viewportRight -
                          menuWidth -
                          10;
                      }
                      if (left < scrollX) {
                        left = scrollX + 10;
                      }

                      setActionMenu({
                        isOpen: true,
                        position: {
                          top: top + "px",
                          left: left + "px",
                        },
                        payment: p,
                      });
                    }}
                  >
                    <FaEllipsisV />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ActionMenu
        isOpen={actionMenu.isOpen}
        position={actionMenu.position}
        onClose={() =>
          setActionMenu((s) => ({ ...s, isOpen: false }))
        }
        entityLabel="Payment"
        onEdit={() => {
          const p = actionMenu.payment;
          setEditingPayment(p);
          setIsModalOpen(true);
          setActionMenu((m) => ({ ...m, isOpen: false }));
        }}
        onDelete={() => handleDeletePayment(actionMenu.payment)}
      />

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingPayment}
        onSubmit={async (formData) => {
          if (editingPayment) {
            await updatePayment(editingPayment.id, formData);
          } else {
            await createPayment(formData);
          }
          setIsModalOpen(false);
          setEditingPayment(null);
        }}
      />
    </div>
  );
}