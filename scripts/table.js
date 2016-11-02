console.log('dane:');

console.log(persons);

var tableConfig = {
	id: 'persons',
	columns: ["id", "firstName", "lastName", "dateOfBirth", "company", "note"],
	pagination: 5,
	data: persons
};

function CustomTable(config) {
	
	this.config = config;
}

CustomTable.prototype.createTable = function() {
	var elem = document.getElementById(this.config.id);

	this.table = document.createElement('table');
	
	this.tableHeader = this.initHeader();
	this.table.appendChild(this.tableHeader);

	this.tableData = this.fillData();
	this.table.appendChild(this.tableData)

	//var test = document.createElement('div');
	//test.appendChild(table);
	elem.appendChild(document.createElement('div').appendChild(this.table));
		
	this.tablePagination = this.createPagination();
	elem.append(this.tablePagination);
}

CustomTable.prototype.initHeader = 	function() {
	var tableHeaders = document.createElement('tr');

	for (var i in this.config.columns) {
		var th = document.createElement('th');
		th.appendChild(document.createTextNode(this.config.columns[i]))
		tableHeaders.appendChild(th);
	}
	return tableHeaders;
}

CustomTable.prototype.fillData = function(page) {
	var tableBody = document.createElement("tbody");
	var firstIndex = page ? page : 0;
	var lastIndex = this.config.data.length > 5 ? 5 : this.config.data.length - 1;
	for (var i = firstIndex; i < lastIndex; i++) {
			
		var row = document.createElement('tr');
			
		for (var j in tableConfig.columns) {
			var td = document.createElement('td');
			td.appendChild(document.createTextNode(this.config.data[i][tableConfig.columns[j]]))
			row.appendChild(td);
		}
		tableBody.appendChild(row);	
	}
	return tableBody;
}

CustomTable.prototype.createPagination = function() {
	this.page = 1;
	
	var config = this.config;
	
	var pagination = document.createElement('div');
	pagination.id = 'pagination';

	var pages = document.createElement('div');
	pages.className = 'pagination';
		
//	var refreshPagination = function() {	
//		pages.innerHTML = page + " / " + Math.ceil(config.data.length / config.pagination);
//	}
		
	var prevArrow = document.createElement('div');
	prevArrow.innerHTML = '<';
	prevArrow.className = 'pagination button';
		
	prevArrow.addEventListener('click', this.prevPage(event));
		
		
	var nextArrow = document.createElement('div');
	nextArrow.innerHTML = '>';
	nextArrow.className = 'pagination button';
		
	nextArrow.addEventListener('click', this.prevPage(event));
		
	refreshPagination();

	pagination.appendChild(prevArrow);
	pagination.appendChild(pages);
	pagination.appendChild(nextArrow);	
		
	return pagination;
}

CustomTable.prototype.prevPage = function (event) {
	if (this.page > 1) {
		this.page -= 1; 
		this.tableData = this.fillData();
		refreshPagination();
	}
}
CustomTable.prototype.nextPage = function (event) {
	if (this.page < Math.ceil(config.data.length / config.pagination)) {
		this.page += 1;
		this.tableData = this.fillData();
		refreshPagination();
	}
}




var customTable = new CustomTable(tableConfig);

console.log(customTable);

customTable.createTable('persons');

