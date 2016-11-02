console.log('dane:');

console.log(persons);

var data = persons;

var tableConfig = {
	columns: ["id", "firstName", "lastName", "dateOfBirth", "company", "note"],
	pagination: 5
}

var table;

createTable();

function createTable() {
	var elem = document.getElementById("persons");

	table = document.createElement('table');
	
	initHeader();
	fillData();

	//var test = document.createElement('div');
	//test.appendChild(table);
	elem.appendChild(document.createElement('div').appendChild(table));
	
	var tablePagination = createPagination();
	
	elem.append(tablePagination);
}

function initHeader() {
	var tableHeaders = document.createElement('tr');

	for (var i in tableConfig.columns) {
		var th = document.createElement('th');
		th.appendChild(document.createTextNode(tableConfig.columns[i]))
		tableHeaders.appendChild(th);
	}
	table.appendChild(tableHeaders);
}

function fillData() {
	for (var i in data) {
		
		var row = document.createElement('tr');
		
		for (var j in tableConfig.columns) {
			var td = document.createElement('td');
			td.appendChild(document.createTextNode(data[i][tableConfig.columns[j]]))
			row.appendChild(td);
		}
		table.appendChild(row);	
	}
}

function createPagination() {
	var page = 1;
	var pagination = document.createElement('div');
	pagination.id = 'pagination';

	var pages = document.createElement('div');
	pages.className = 'pagination';
	
	var refreshPagination = function() {	
		pages.innerHTML = page + " / " + Math.ceil(data.length / tableConfig.pagination);
	}
	
	var prevArrow = document.createElement('div');
	prevArrow.innerHTML = '<';
	prevArrow.className = 'pagination button';
	
	prevArrow.addEventListener('click', function (event) {
		if (page > 1) {
			page -= 1; 
			refreshPagination();
		}
	});
	
	
	var nextArrow = document.createElement('div');
	nextArrow.innerHTML = '>';
	nextArrow.className = 'pagination button';
	
	nextArrow.addEventListener('click', function (event) {
		if (page < Math.ceil(data.length / tableConfig.pagination)) {
			page += 1;
			refreshPagination();
		}
	});
	
	refreshPagination();

	pagination.appendChild(prevArrow);
	pagination.appendChild(pages);
	pagination.appendChild(nextArrow);	
	
	return pagination;
}

console.log(table.rows.length);

