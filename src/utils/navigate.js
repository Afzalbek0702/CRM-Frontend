let navigateFunction;

export const setNavigate = (func) => {
	navigateFunction = func;
};

export const navigateTo = (path) => {
	if (navigateFunction) {
		navigateFunction(path);
	} else {
		window.location.href = path;
	}
};