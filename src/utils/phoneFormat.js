const cleanUzPhone = (formattedPhone) => {
	return formattedPhone.replace(/\D/g, "");
};
function formatPhone(value) {
	let digits = value.replace(/\D/g, "");

	if (digits.startsWith("998")) {
		digits = digits.slice(3);
	}

	if (digits.length > 9) {
		digits = digits.slice(0, 9);
	}

	let result = "+(998) ";

	if (digits.length >= 1) result += digits.slice(0, 2);
	if (digits.length >= 3) result += "-" + digits.slice(2, 5);
	if (digits.length >= 6) result += "-" + digits.slice(5, 7);
	if (digits.length >= 8) result += "-" + digits.slice(7, 9);

	return result;
}
export default {cleanUzPhone, formatPhone}