import {
    FaTachometerAlt,
    FaUsers,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaThList,
    FaWallet,
    FaArchive,
    FaCog
} from "react-icons/fa";

export const sidebarConfig = [
    {
        key: "dashboard",
        label: "Asosiy panel",
        icon: FaTachometerAlt,
        path: "dashboard",
        roles: ["CEO", "ADMIN", "MANAGER"]
    },
    {
        key: "leads",
        label: "Lidlar",
        icon: FaThList,
        path: "leads",
        roles: ["CEO","ADMIN", "MANAGER"]
    },
    {
        key: "groups",
        label: "Guruhlar",
        icon: FaUsers,
        path: "groups",
        roles: ["CEO", "ADMIN", "MANAGER"]
    },
    {
        key: "students",
        label: "O'quvchilar",
        icon: FaUserGraduate,
        path: "students",
        roles: ["CEO", "ADMIN", "MANAGER", "TEACHER"]
    },
    {
        key: "teachers",
        label: "O'qituvchilar",
        icon: FaChalkboardTeacher,
        path: "teachers",
        roles: ["CEO","ADMIN", "MANAGER"]
    },
    {
        key: "workers",
        label: "Ishchilar",
        icon: FaUsers,
        path: "workers",
        roles: ["CEO"]
    },

    {
        key: "payments",
        label: "Moliya",
        icon: FaWallet,
        roles: ["CEO"],
        children: [
            {
                key: "payments_income",
                label: "To'lovlar",
                path: "payments/income",
                roles: ["CEO"]
            },
            {
                key: "payments_salary",
                label: "Ish haqi",
                path: "payments/salary",
                roles: ["CEO"]
            },
            {
                key: "payments_debtors",
                label: "Qarzdorlar",
                path: "payments/debtors",
                roles: ["CEO"]
            },
            {
                key: "payments_expenses",
                label: "Xarajatlar",
                path: "payments/expenses",
                roles: ["CEO"]
            }
        ]
    },

    {
        key: "archive",
        label: "Arxiv",
        icon: FaArchive,
        roles: ["CEO"],
        children: [
            {
                key: "archive_leads",
                label: "Lidlar",
                path: "archive/leads",
                roles: ["CEO"]
            },
            {
                key: "archive_students",
                label: "Talabalar",
                path: "archive/students",
                roles: ["CEO"]
            },
            {
                key: "archive_teachers",
                label: "O'qituvchilar",
                path: "archive/teachers",
                roles: ["CEO"]
            },
            {
                key: "archive_groups",
                label: "Guruhlar",
                path: "archive/groups",
                roles: ["CEO"]
            },
            {
                key: "archive_payments",
                label: "Moliya",
                path: "archive/payments",
                roles: ["CEO"]
            }
        ]
    },

    {
        key: "settings",
        label: "Sozlamalar",
        icon: FaCog,
        path: "settings",
        roles: ["CEO"]
    }
];