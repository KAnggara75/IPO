let table = document.getElementById('myTable');

async function postData() {
	const response = await fetch('./assets/IPO_HISTORY.json');
	return response.json();
}

$(document).ready(function () {
	$.ajaxSetup({ cache: false });

	// INIT data
	searchData(0);

	// search user input
	$('#uw').keyup(function () {
		table.innerHTML = '';
		searchData(1);
	});

	function searchData(int) {
		let searchField = $('#uw').val();
		let expression = new RegExp(searchField, 'i');

		postData().then((data) => {
			$.each(data.ipo, function (key, value) {
				if (int === 0) {
					renderData(value);
				} else if (int === 1) {
					if (
						value.UW.search(expression) != -1 ||
						value.CODE.search(expression) != -1 ||
						value.NAME.search(expression) != -1
					) {
						renderData(value);
					}
				}
			});
		});
	}

	function renderData(value) {
		let row = table.insertRow(0);
		for (let i = 0; i <= 7; i++) {
			let data = row.insertCell(i);
			data.classList.add('px-3');
			data.classList.add('border');
			data.classList.add('border-black');
			switch (i) {
				case 0:
					data.classList.add('text-left');
					data.innerHTML = value.CODE;
					break;
				case 1:
					data.classList.add('text-left');
					data.innerHTML = value.NAME;
					break;
				case 2:
					data.innerHTML = value.DATE;
					break;
				case 3:
					data.innerHTML = value.PRICE;
					break;
				case 4:
					value.D1 < 25 ? data.classList.add('bg-red-500') : data.classList.add('bg-green-500');
					data.innerHTML = value.D1 + '%';
					break;
				case 5:
					value.W1 < 25 ? data.classList.add('bg-red-500') : data.classList.add('bg-green-500');
					data.innerHTML = value.W1 + '%';
					break;
				case 6:
					value.M1 < 25 ? data.classList.add('bg-red-500') : data.classList.add('bg-green-500');
					data.innerHTML = value.M1 + '%';
					break;
				case 7:
					data.classList.add('text-left');
					data.innerHTML = value.UW;
					break;
			}
		}
	}
});
