// const formatUzPhone = (input) => {
// 	let numbers = input.replace(/\D/g, "");

// 	if (!numbers.startsWith("998")) {
// 		numbers = "998";
// 	}

// 	numbers = numbers.slice(0, 12);

// 	let result = "+998 ";

// 	if (numbers.length > 3) {
// 		result += numbers.slice(3, 5);
// 	}
// 	if (numbers.length > 5) {
// 		result += "-" + numbers.slice(5, 8);
// 	}
// 	if (numbers.length > 8) {
// 		result += "-" + numbers.slice(8, 10);
// 	}
// 	if (numbers.length > 10) {
// 		result += "-" + numbers.slice(10, 12);
// 	}

// 	return result;
// };
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