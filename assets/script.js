let table = document.getElementById("myTable");

let ipoDataCache = null;

async function postData() {
	if (ipoDataCache) return ipoDataCache;
	const response = await fetch("./assets/IPO_HISTORY.json");
	ipoDataCache = await response.json();
	return ipoDataCache;
}

$(document).ready(function () {
	$.ajaxSetup({ cache: false });

	searchData("");

	$("#uw").on("input", function () {
		table.innerHTML = "";
		searchData($(this).val());
	});

	function searchData(query) {
		const expression = new RegExp(query, "i");

		postData().then((data) => {
			$.each(data.ipo, function (_, value) {
				if (!query) {
					renderData(value);
				} else {
					if (
						(typeof value.UW === "string" && value.UW.search(expression) !== -1) ||
						(typeof value.CODE === "string" && value.CODE.search(expression) !== -1) ||
						(typeof value.NAME === "string" && value.NAME.search(expression) !== -1)
					) {
						renderData(value);
					}
				}
			});
		});
	}

	function renderData(value) {
		let row = table.insertRow(-1);
		for (let i = 0; i <= 7; i++) {
			let data = row.insertCell(i);
			data.classList.add("px-3", "border", "border-black", "dark:border-slate-100");
			switch (i) {
				case 0:
					data.classList.add("text-left");
					data.innerHTML = value.CODE;
					break;
				case 1:
					data.classList.add("text-left");
					data.innerHTML = value.NAME;
					break;
				case 2:
					data.innerHTML = value.DATE;
					break;
				case 3:
					data.innerHTML = value.PRICE;
					break;
				case 4:
					value.D1 < 25
						? data.classList.add("bg-red-400", "dark:bg-red-700")
						: data.classList.add("bg-green-400", "dark:bg-green-700");
					data.innerHTML = value.D1 + "%";
					break;
				case 5:
					value.W1 < 25
						? data.classList.add("bg-red-400", "dark:bg-red-700")
						: data.classList.add("bg-green-400", "dark:bg-green-700");
					data.innerHTML = value.W1 + "%";
					break;
				case 6:
					value.M1 < 25
						? data.classList.add("bg-red-400", "dark:bg-red-700")
						: data.classList.add("bg-green-400", "dark:bg-green-700");
					data.innerHTML = value.M1 + "%";
					break;
				case 7:
					data.classList.add("text-left");
					data.innerHTML = value.UW;
					break;
			}
		}
	}
});
