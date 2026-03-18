import { useState, useEffect } from "react";
import { FaUser, FaPhone, FaComment, FaSave, FaPlus } from "react-icons/fa";
import { useCourse } from "../services/course/useCourse";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LeadModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    source: "",
    interested_course: "",
    comment: "",
  });

  const { courseData } = useCourse();

  useEffect(() => {
    if (initialData) {
      setFormData({
        full_name: initialData.full_name || "",
        phone: initialData.phone || "",
        source: initialData.source || "",
        interested_course: initialData.interested_course || "",
        comment: initialData.comment || "",
      });
    } else {
      setFormData({
        full_name: "",
        phone: "",
        source: "",
        interested_course: "",
        comment: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      full_name: "",
      phone: "",
      source: "",
      interested_course: "",
      comment: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Lidni o'zgartirish" : "Yangi Lid"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Lid ma'lumotlarini o'zgartirish"
              : "Yangi Lid qo'shish"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="modal-inputs">
            <div>
              <Label>
                <FaUser /> Ism familiya
              </Label>
              <Input
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>
                <FaPhone /> Telefon raqam
              </Label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Manba</Label>
              <Input
                name="source"
                value={formData.source}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Qiziqgan kursi</Label>
              <Select
                value={formData.interested_course}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    interested_course: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Qiziqgan kursi" />
                </SelectTrigger>
                <SelectContent>
                  {courseData.map((course) => (
                    <SelectItem
                      key={course.id}
                      value={String(course.name)}
                    >
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>
                <FaComment /> Izoh
              </Label>
              <Textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" className={"btn-cancel"} onClick={onClose}>
              Bekor qilish
            </Button>

            <Button type="submit" className={"btn-default"}>
              {initialData ? (
                <>
                  <FaSave /> Saqlash
                </>
              ) : (
                <>
                  <FaPlus /> Yaratish
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
