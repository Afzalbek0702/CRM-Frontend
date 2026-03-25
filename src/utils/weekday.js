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

	// Massivni o'zbekcha nomlarga almashtirib, vergul bilan birlashtiradi
	return (daysArray || []).map((day) => weekDayUz[day] || day);
};
