const PhoneUtils = {
	// Backendga yuborish uchun: +(998) 90-542-37-47 -> 998905423747
	cleanPhone: (formattedPhone) => {
		const digits = formattedPhone.replace(/\D/g, "");
		// Agar raqamlar 998 bilan boshlanmasa, uni qo'shib qo'yamiz
		return digits.startsWith("998") ? digits : `998${digits}`;
	},

	// Input uchun va Table uchun formatlash: 998905423747 -> +(998) 90-542-37-47
	formatPhone: (value) => {
		if (!value) return "+(998) ";

		// Faqat raqamlarni olamiz
		let digits = value.replace(/\D/g, "");

		// Agar boshida 998 bo'lsa, uni formatlash uchun vaqtincha olib tashlaymiz
		if (digits.startsWith("998")) {
			digits = digits.slice(3);
		}

		// Faqat 9 ta raqam qoldiramiz (kod + raqam)
		digits = digits.slice(0, 9);

		let result = "+(998) ";

		// Format: +(998) 90-542-37-47
		if (digits.length > 0) {
			result += digits.slice(0, 2); // 90
		}
		if (digits.length > 2) {
			result += "-" + digits.slice(2, 5); // 542
		}
		if (digits.length > 5) {
			result += "-" + digits.slice(5, 7); // 37
		}
		if (digits.length > 7) {
			result += "-" + digits.slice(7, 9); // 47
		}

		return result;
	},
};

export default PhoneUtils;
   