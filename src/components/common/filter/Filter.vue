<style lang="sass">
	.sunset-search-form-container {
		display: inline-block;
		vertical-align: top;
		.sunset-search-form {
			display: inline-block;
			font-size: 0px;
			.search-form-button {
				margin-bottom: 0px;
			}
		}
		.sunset-search-form-tip {
			display: inline-block;
			float: right;
			margin-left: 10px;
			vertical-align: top;
			&>div {
				margin-bottom: 0px;
			}
		}
		&:after {
			content: '';
			display: block;
			clear: both;
		}
		.mint-button--small {
			width: 100%;
		}
		.sunset-search-button {
			background-image: -moz-linear-gradient(top, #08c, #04c);
			background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#08c), to(#04c));
			background-image: -webkit-linear-gradient(top, #08c, #04c);
			background-image: -o-linear-gradient(top, #08c, #04c);
			background-image: linear-gradient(to bottom, #08c, #04c);
			background-repeat: repeat-x;
		}
	}
</style>
<template>
	<div :class="['sunset-search-form-container',right?'pull-right':'']">
		<form :class="['sunset-search-form form-inline form-horizontal',right?'pull-right':'']" onsubmit="return false">
			<template v-for="field in fields">
				<div v-if="field.newline"></div>
				<filter-field :options="field" :filter="filter" :value.sync="filter[field.name]" @search="fieldTriggerSearch" @ready="fieldReady"></filter-field>
			</template>
			<mt-button class="sunset-search-button" v-if="searchButton" :type="searchButton.color||'primary'" size="small" :icon="searchButton.icon" @click="search">{{searchButton.label}}</mt-button>
		</form>
	</div>
</template>
<script>
	import FilterField from './FilterField.vue';

	export default {
		components: {
			FilterField
		},
		props: {
			options: {}
		},
		computed: {
			fields() {
				var filter = this.filter;
				return (this.options && this.options.fields || []).filter(field => (field.premise ? field.premise(filter) :
					true));
			},
			right() {
				return this.options && this.options.align == 'right';
			},
			searchButton() {
				return this.options && this.options.searchButton || '';
			}
		},
		data() {
			return {
				inited: false,
				lock: false,
				filter: {},
				waitReadyWidgetCounter: 0,
				waitReadyWidgetMap: {}
			};
		},
		methods: {
			init() {
				var filter = this.filter,
					fields = this.fields,
					defaultValueFields = [],
					prall = [];
				this.lock = true;
				fields.forEach(field => {
					this.$set(`filter.${field.name}`, void 0);
					var defaulValue = field.default || field.defaultValue;
					if (defaulValue) {
						defaultValueFields.push(field);
						prall.push(Promise.resolve().then(() => {
							return Sunset.isFunction(defaulValue) ? defaulValue() : defaulValue;
						}));
					}
					if (field.defaultFirst) {
						this.waitReadyWidgetCounter++;
						this.waitReadyWidgetMap[field.name] = true;
					}
				});
				Promise.all(prall).then((res) => {
					if (filter === this.filter) {
						res.forEach((dv, index) => {
							filter[defaultValueFields[index].name] = dv;
						});
						this.$nextTick(() => {
							this.lock = false;
							if (this.waitReadyWidgetCounter <= 0) {
								this.search();
							}
						});
					}
				});
			},
			reset(filter) {
				this.lock = true;
				this.filter = Sunset.clone(filter) || {};
				this.$nextTick(() => {
					this.lock = false;
					this.search();
				});
			},
			fieldReady(fieldName) {
				if (this.waitReadyWidgetMap[fieldName] && this.waitReadyWidgetCounter > 0) {
					this.waitReadyWidgetCounter--;
					if (this.waitReadyWidgetCounter == 0) {
						if (!this.lock) {
							this.lock = true;
							this.$nextTick(() => {
								var f = this.filter;
								this.lock = false;
								this.search();
							});
						}
					}
				}
			},
			getFilter() {
				var filter = Object.assign({}, this.filter);
				if (Sunset.isFunction(this.options.format)) {
					filter = this.options.format(filter) || filter;
				}
				return {
					filter: filter,
					localFilter: this.generateLocalFilter()
				};
			},
			fieldTriggerSearch() {
				if (this.waitReadyWidgetCounter == 0) {
					this.search();
				}
			},
			search() {
				if (!this.fields) {
					return;
				}
				if (!this.lock) {
					var filter = Sunset.clone(this.filter);
					if (Sunset.isFunction(this.options.format)) {
						filter = this.options.format(filter) || filter;
					}
					this.$emit('filter', filter, this.generateLocalFilter());
				}
			},
			generateLocalFilter() {
				var localFilterFields = this.fields.filter(item => Sunset.isFunction(item.localFilter)) || [],
					data = Sunset.clone(this.filter) || {};
				return function (record) {
					for (var i = 0, field; field = localFilterFields[i++];) {
						if (!field.localFilter.call(field, record, data[field.name])) {
							return false;
						}
					}
					return true;
				}
			}
		},
		ready() {
			this.init();
		}
	}
</script>