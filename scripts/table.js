console.log('dane:');

console.log(persons);

var tableConfig = {
	columns: ["id", "firstName", "lastName", "dateOfBirth", "company", "note"],
	pagination: 5
}

var table;

createTable();

function createTable() {
	var personsTable = document.getElementById("persons");

	table = document.createElement('table');
	
	initHeader();
	fillData();

	personsTable.appendChild(table);
}

function initHeader() {
	var tableHeaders = document.createElement('tr');

	for (var i in tableConfig.columns) {
		var td = document.createElement('td');
		td.appendChild(document.createTextNode(tableConfig.columns[i]))
		tableHeaders.appendChild(td);
	}
	table.appendChild(tableHeaders);
}

function fillData() {
	for (var i in persons) {
		
		var row = document.createElement('tr');
		
		for (var j in tableConfig.columns) {
			var td = document.createElement('td');
			td.appendChild(document.createTextNode(persons[i][tableConfig.columns[j]]))
			row.appendChild(td);
		}
		table.appendChild(row);
	}
}

