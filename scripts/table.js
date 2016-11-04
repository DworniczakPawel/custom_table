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
	this.page = 1;
}

CustomTable.prototype.createTable = function() {
	var elem = document.getElementById(this.config.id);

	this.table = document.createElement('table');
	
	this.tableHeader = this.initHeader();
	this.table.appendChild(this.tableHeader);

	this.fillData(0);
	this.table.appendChild(this.tableBody)

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

CustomTable.prototype.fillData = function() {
    if (!this.tableBody) {
        this.tableBody = document.createElement("tbody");
    } else {
        this.tableBody.innerHTML = '';
    }
	var firstIndex = this.page == 1 ? 0 : (this.page - 1) * this.config.pagination;
	var lastIndex = this.config.data.length - (firstIndex + 1) >= this.config.pagination ? firstIndex + this.config.pagination : this.config.data.length;
	for (var i = firstIndex; i < lastIndex; i++) {
			
		var row = document.createElement('tr');
			
		for (var j in tableConfig.columns) {
			var td = document.createElement('td');
			td.appendChild(document.createTextNode(this.config.data[i][tableConfig.columns[j]]))
			row.appendChild(td);
		}
        this.tableBody.appendChild(row);
	}
}

CustomTable.prototype.createPagination = function() {
    var self = this;

	var pagination = document.createElement('div');
	pagination.id = 'pagination';

	var pages = document.createElement('div');
	pages.className = 'pagination';
		
	var refreshPagination = function() {
		pages.innerHTML = self.page + " / " + Math.ceil(self.config.data.length / self.config.pagination);
	}
		
	var prevArrow = document.createElement('div');
	prevArrow.innerHTML = '<';
	prevArrow.className = 'pagination button';
		
	prevArrow.addEventListener('click', function (event) {
        if (self.page > 1) {
            self.page -= 1;
            self.tableData = self.fillData();
            console.log('prev');
            console.log(self.tableData);
            refreshPagination();
        }
    });
		
		
	var nextArrow = document.createElement('div');
	nextArrow.innerHTML = '>';
	nextArrow.className = 'pagination button';
		
	nextArrow.addEventListener('click', function (event) {
        if (self.page < Math.ceil(self.config.data.length / self.config.pagination)) {
            self.page += 1;
            self.tableData = self.fillData();
            console.log('next');
            console.log(self.tableData);
            refreshPagination();
        }
    });
		
	refreshPagination();

	pagination.appendChild(prevArrow);
	pagination.appendChild(pages);
	pagination.appendChild(nextArrow);	
		
	return pagination;
}



var customTable = new CustomTable(tableConfig);

console.log(customTable);

customTable.createTable('persons');

