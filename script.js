const title = ['CODE', 'NAME', 'DATE', 'PRICE', '1D', '1W', '1M', 'UW'];

let table = document.getElementById('myTable');
let judul = document.getElementById('judul');
$(document).ready(function () {
	$.ajaxSetup({ cache: false });
	$('#uw').keyup(function () {
		table.innerHTML = '';
		let searchField = $('#uw').val();
		judul.innerHTML = 'Searching: ' + searchField;
		let expression = new RegExp(searchField, 'i');
		$.getJSON('./IPO_HISTORY.json', function (data) {
			const ipo = data.ipo;
			$.each(ipo, function (key, value) {
				if (
					value.UW.search(expression) != -1 ||
					value.CODE.search(expression) != -1 ||
					value.NAME.search(expression) != -1
				) {
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
								value.D1 < 25 ? data.classList.add('bg-red-500') : data.classList.add('bg-green-500');
								data.innerHTML = value.W1 + '%';
								break;
							case 6:
								value.D1 < 25 ? data.classList.add('bg-red-500') : data.classList.add('bg-green-500');
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
		});
	});
});
