(function initTheme() {
	var theme = localStorage.getItem("theme") || "light";
	if (theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
		localStorage.setItem("theme", "light");
		// document.querySelector("html").classList.add("dark");
	}
})();
