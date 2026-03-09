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

export const goBack = (tenant) => {
	if (!navigateFunction) return;

	if (window.history.length > 1) {
		navigateFunction(-1);
	} else {
		navigateFunction(`/${tenant}/dashboard`);
	}
};