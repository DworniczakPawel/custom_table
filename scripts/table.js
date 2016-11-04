console.log('dane:');

console.log(persons);

var tableConfig = {
	id: 'persons',
	columns: [{
		id: "id",
		name: "Id",
		type: "number"
	}, {
		id: "firstName",
		name: "First name",
		type: "string"
	}, {
		id: "lastName",
		name: "Last name",
		type: "string"
	}, {
		id: "dateOfBirth",
		name: "Date of birth",
		type: "date"
	}, {
		id: "company",
		name: "Company",
		type: "string"
	}, {
		id: "note",
		name: "Note",
		type: "number"
	}],
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
	var self = this;

	for (var i in this.config.columns) {
		var th = document.createElement('th');

		var columnHead = document.createElement('div');
		columnHead.innerHTML = this.config.columns[i].name;
		columnHead.className = 'button'
		columnHead.sortType = 'none';
		columnHead.columnData = this.config.columns[i];
		columnHead.addEventListener('click', function (event) {
			var headElement = event.target;
			console.log(headElement.innerHTML);
			if (headElement.sortType == 'none') {
				headElement.sortType = 'asc';
				headElement.innerHTML  =  headElement.columnData.name + ' >';
				self.sortByColumn(headElement.columnData, headElement.sortType);
				resetSorting(headElement.columnData.id);
			} else if (headElement.sortType == 'asc') {
				headElement.sortType = 'desc';
				headElement.innerHTML  =  headElement.columnData.name + ' <'
				self.sortByColumn(headElement.columnData, headElement.sortType);
				resetSorting(headElement.columnData.id);
			} else if (headElement.sortType == 'desc') {
				headElement.sortType = 'none';
				headElement.innerHTML  =  headElement.columnData.name
				self.sortByColumn(headElement.columnData, headElement.sortType);
				resetSorting(headElement.columnData.id);
			} else {
				headElement.sortType = 'none';
				headElement.innerHTML  =  headElement.columnData.name
				self.sortByColumn(headElement.columnData, headElement.sortType);
				resetSorting(headElement.columnData.id);
			}
		});
		th.appendChild(columnHead);
		tableHeaders.appendChild(th);
	}

	function resetSorting(columnId) {
		Array.from(tableHeaders.children).forEach(function(element) {
			var headElement = element.children[0];
			if (columnId != headElement.columnData.id) {
				headElement.innerHTML = headElement.columnData.name;
				headElement.sortType = 'none';
			}
		});
	}
	resetSorting();
	return tableHeaders;
}

CustomTable.prototype.fillData = function(data) {
    if (!this.tableBody) {
        this.tableBody = document.createElement("tbody");
    } else {
        this.tableBody.innerHTML = '';
    }

    this.tableData = data ? data : this.config.data;
	var tableData = this.tableData;

	var firstIndex = this.page == 1 ? 0 : (this.page - 1) * this.config.pagination;
	var lastIndex = tableData.length - (firstIndex + 1) >= this.config.pagination ? firstIndex + this.config.pagination : tableData.length;
	for (var i = firstIndex; i < lastIndex; i++) {
			
		var row = document.createElement('tr');
			
		for (var j in tableConfig.columns) {
			var td = document.createElement('td');
			td.appendChild(document.createTextNode(tableData[i][tableConfig.columns[j].id]))
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
            self.fillData(self.tableData);
            console.log('prev');
            refreshPagination();
        }
    });
		
		
	var nextArrow = document.createElement('div');
	nextArrow.innerHTML = '>';
	nextArrow.className = 'pagination button';
		
	nextArrow.addEventListener('click', function (event) {
        if (self.page < Math.ceil(self.config.data.length / self.config.pagination)) {
            self.page += 1;
            self.fillData(self.tableData);
            console.log('next');
            refreshPagination();
        }
    });
		
	refreshPagination();

	pagination.appendChild(prevArrow);
	pagination.appendChild(pages);
	pagination.appendChild(nextArrow);	
		
	return pagination;
}

CustomTable.prototype.sortByColumn = function(column, type) {
	console.log('sort ' + column + ' ' + type);

	if (type == 'none') {
		this.fillData()
	}
	var data = JSON.parse(JSON.stringify(this.config.data));

	data.sort(function(a, b) {
		if (column.type == 'number') {
			if (type == 'asc') {
				return a[column.id] - b[column.id]
			}
			if (type == 'desc') {
				return  b[column.id] - a[column.id]
			}
		}
		if (column.type == 'string') {
			if (type == 'asc') {
				return a[column.id].localeCompare(b[column.id])
			}
			if (type == 'desc') {
				return  b[column.id].localeCompare(a[column.id])
			}
		}
		if (column.type == 'date') {
			var tempDateA = toDate(a[column.id]);
			var tempDateB = toDate(b[column.id]);
			if (type == 'asc') {
				return tempDateA - tempDateB
			}
			if (type == 'desc') {
				return  tempDateB - tempDateA
			}
		}
		
		function toDate(date) {
			var dateString = date.match(/\d+/g);
			return new Date(dateString[2], dateString[1], dateString[0], dateString[3], dateString[4]);
		}
	});
	this.fillData(data)
}

var customTable = new CustomTable(tableConfig);

console.log(customTable);

customTable.createTable('persons');