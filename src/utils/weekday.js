export const getUzDays = (daysArray) => {
	const weekDayUz = {
		Mon: "Du",
		Tue: "Se",
		Wed: "Cho",
		Thu: "Pa",
		Fri: "Ju",
		Sat: "Sha",
		Sun: "Yak",
	};

	// Yordamchi funksiya: bitta kunni tarjima qilish
	const translateDay = (day) => weekDayUz[day] || day;

	// Agar null/undefined bo'lsa, bo'sh qiymat qaytarish
	if (!daysArray) return [];

	// 🎯 Agar string bo'lsa — bitta tarjima qilingan string qaytaradi
	if (typeof daysArray === "string") {
		return translateDay(daysArray);
	}

	// 🎯 Agar massiv bo'lsa — tarjima qilingan stringlar massivini qaytaradi
	if (Array.isArray(daysArray)) {
		return daysArray.map((day) => translateDay(day));
	}

	// Noma'lum tur bo'lsa — bo'sh massiv
	return [];
};
