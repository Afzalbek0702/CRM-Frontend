// navigation.js
let navigateFunction;

export const setNavigate = (func) => {
	navigateFunction = func;
};

export const navigateTo = (path) => {
	if (navigateFunction) {
		navigateFunction(path);
	} else {
		// Fallback: agar funksiya o'rnatilmagan bo'lsa, hard reload
		window.location.href = path;
	}
};
