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

    this.createFilterFooter();

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
			if (headElement.sortType == 'none') {
                initSorting(headElement, 'asc', '>');
			} else if (headElement.sortType == 'asc') {
                initSorting(headElement, 'desc', '<');
			} else if (headElement.sortType == 'desc') {
                initSorting(headElement, 'none');
			} else {
                initSorting(headElement, 'none');
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

	function initSorting(headElement, sortType, mark) {
        headElement.sortType = sortType;
        if (mark) {
            headElement.innerHTML  =  headElement.columnData.name + ' ' + mark;
        } else {
            headElement.innerHTML  =  headElement.columnData.name
        }
        self.sortByColumn(headElement.columnData, headElement.sortType);
        resetSorting(headElement.columnData.id);
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

CustomTable.prototype.createFilterFooter = function() {
	var self = this;
    this.filterFooter = document.createElement('tfoot');

    var footer = document.createElement('tr');

    this.config.columns.forEach(function(columnConfig) {
        footer.appendChild(createFilterElement(columnConfig));
    })
    this.filterFooter.appendChild(footer);
    this.table.appendChild(this.filterFooter);

    function createFilterElement(columnConfig) {
        var footerElement = document.createElement('td');

		var filterInput = document.createElement('input');
        filterInput.className = 'filter block';
		footerElement.appendChild(filterInput);

		var filter = document.createElement('div');
		filter.innerHTML = 'Filter';
		filter.className = 'filter filter-button block button';

        if (columnConfig.type == 'date') {
            footerElement.id = 'pick';
        }
        filter.addEventListener('click', function (event) {
			self.filterByColumn(columnConfig, filterInput.value);
        });

		footerElement.appendChild(filter);

        $(document).ready(function(){
            $('#pick input').datepicker({
                format: "dd.mm.yyyy"
            });
        });

        return footerElement;
    }
}

CustomTable.prototype.createPagination = function() {
   var self = this;

	var pagination = document.createElement('div');
	pagination.id = 'pagination';

	var pages = document.createElement('div');
	pages.className = 'block';
		
	this.refreshPagination = function() {
		pages.innerHTML = self.page + " / " + Math.ceil(self.tableData.length / self.config.pagination);
	}
		
	var prevArrow = document.createElement('div');
	prevArrow.innerHTML = '<';
	prevArrow.className = 'block button';
		
	prevArrow.addEventListener('click', function (event) {
        if (self.page > 1) {
            self.page -= 1;
            self.fillData(self.tableData);
            console.log('prev');
            self.refreshPagination();
        }
    });
		
		
	var nextArrow = document.createElement('div');
	nextArrow.innerHTML = '>';
	nextArrow.className = 'block button';
		
	nextArrow.addEventListener('click', function (event) {
        if (self.page < Math.ceil(self.tableData.length / self.config.pagination)) {
            self.page += 1;
            self.fillData(self.tableData);
            console.log('next');
            self.refreshPagination();
        }
    });

    this.refreshPagination();

	pagination.appendChild(prevArrow);
	pagination.appendChild(pages);
	pagination.appendChild(nextArrow);	
		
	return pagination;
}

CustomTable.prototype.sortByColumn = function(column, type) {
	console.log('sort ' + column + ' ' + type);

    var self = this;

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
			var tempDateA = self.toDate(a[column.id]);
			var tempDateB = self.toDate(b[column.id]);
			if (type == 'asc') {
				return tempDateA - tempDateB
			}
			if (type == 'desc') {
				return  tempDateB - tempDateA
			}
		}
		

	});
	this.fillData(data)
}

CustomTable.prototype.filterByColumn = function(columnConfig, value) {
	if (value == '') {
		this.fillData();
        this.refreshPagination();
		return;
	}

	var data = [];
	if (columnConfig.type == 'number') {
		this.config.data.forEach(function(row) {
			if (row[columnConfig.id] == value) {
				data.push(row);
			}
		})
	}
	if (columnConfig.type == 'string') {
		this.config.data.forEach(function(row) {
			if (row[columnConfig.id].indexOf(value) != -1) {
				data.push(row);
			}
		})
	}
	if (columnConfig.type == 'date') {
        this.config.data.forEach(function(row) {
            var rowDate = new Date(row[columnConfig.id]);
            var filterDate = new Date(value);
            if (rowDate.getDay() == filterDate.getDay() && rowDate.getMonth() == filterDate.getMonth() && rowDate.getYear() == filterDate.getYear()) {
                data.push(row);
            }
        })
	}

	this.fillData(data);
    this.refreshPagination();
}

CustomTable.prototype.toDate = function(date) {
    var dateString = date.match(/\d+/g);
    return new Date(dateString[2], dateString[1], dateString[0], dateString[3], dateString[4]);
}

var customTable = new CustomTable(tableConfig);

customTable.createTable('persons');