const widgets = {
	'Input': ['Input', 'Password', 'Number'],
	'Select': 'Select',
	'Date': 'Date'
}


const apis = {};

for (var key in widgets) {
	if (widgets.hasOwnProperty(key)) {
		var widget = require(`./${key}`);
		var alias = widgets[key];
		if (typeof alias == "string") {
			apis[`Widget${alias}`] = widget;
		} else {
			alias.forEach(a => {
				apis[`Widget${a}`] = widget;
			});
		}
	}
}

export default apis;