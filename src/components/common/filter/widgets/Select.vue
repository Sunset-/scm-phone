<style lang="sass">
	.filter-select {
		width: 100%;
		height: 30px;
		border-radius: 3px;
		border: 1px solid #cdcdcd;
	}
</style>
<template>
	<div :class="['sunset-field-wrap',invalid?'field-invalid':'']">
		<label :class="['sunset-field-label',options.label?'':'sunset-field-label-empty']">{{options.label}}</label>
		<div class="sunset-field">
			<select class="filter-select" :model.sync="widgetValue">
				<option v-for="item in items" :value="item.value">{{ item.text }}</option>
			</select>
		</div>
	</div>
</template>
<script>
	import Utils from './Helper.js';

	export default {
		props: {
			options: {
				type: Object
			},
			value: {},
			invalid: {}
		},
		data() {
			return {
				groupable: false,
				items: [],
				widgetValue: [],
				lock: false
			};
		},
		computed: {
			spliter() {
				return this.options.spliter || ',';
			}
		},
		methods: {
			init() {
				Utils.generateItems(this.options).then(items => {
					var groups = {},
						others = [],
						groupable = false;
					items && items.forEach(item => {
						if (item.group) {
							groupable = true;
							(groups[item.group] || (groups[item.group] = [])).push(item);
						} else {
							others.push(item);
						}
					});
					if (this.groupable = groupable) {
						var groupItems = [];
						for (var g in groups) {
							if (groups.hasOwnProperty(g)) {
								groupItems.push({
									group: g,
									items: groups[g]
								});
							}
						}
						others.length && groupItems.push({
							group: '其他',
							items: others
						});
						this.items = groupItems;
					} else {
						this.items = items;
					}
					if (this.options.defaultFirst && (this.value === void 0 || this.value.length == 0)) {
						this.value = this.items[0].group ? this.items[0].items[0].value : this.items[0].value;
					}
					this.refreshWidgetValue(this.value || '');
					this.$emit('ready', this.options.name, this.value);
				});
			},
			refreshWidgetValue(v) {
				if (this.options.multiple) {
					if (Sunset.isArray(v)) {
						this.widgetValue = v;
					} else {
						this.widgetValue = !!v ? v.split(this.spliter) : [];
					}
				} else {
					this.widgetValue = v;
				}
			}
		},
		ready() {
			this.init();
		},
		watch: {
			widgetValue(v) {
				this.$nextTick(() => {
					this.lock = true;
					if (Sunset.isArray(v)) {
						if (this.options.max) {
							if (v.length > this.options.max) {
								Sunset.tip(`最多选择${this.options.max}个`);
								v.pop();
							}
						}
						this.value = v.length ? v.join(this.spliter) : '';
					} else {
						this.value = v;
					}
					this.$nextTick(() => {
						this.lock = false;
					});
				});
			},
			value(v) {
				if (!this.lock) {
					this.refreshWidgetValue(v);
				}
			}
		}
	};
</script>