<style lang="sass">
	.sunset-month-picker {
		.picker-slot:nth-child(3) {
			display: none;
		}
	}
</style>
<template>
	<div :class="['sunset-field-wrap',invalid?'field-invalid':'']">
		<label :class="['sunset-field-label',options.label?'':'sunset-field-label-empty']">{{options.label}}</label>
		<div :class="['sunset-field',this.type=='month'?'sunset-month-picker':'']">
			<div class="filter-input" style="font-size:14px;line-height:30px;" @click="open" type="text">{{showValue}}</div>
			<mt-datetime-picker :value.sync="pickerValue" :visible.sync="visible" type="date" year-format="{value} 年" month-format="{value} 月"
			    date-format="{value} 日" @confirm="handleConfirm">
			</mt-datetime-picker>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			options: {
				type: Object
			},
			value: {}
		},
		data() {
			return {
				visible: false,
				widgetValue: '',
				pickerValue: '',
				items: [{
					values: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007'],
				}, {
					values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
				}]
			};
		},
		computed: {
			type() {
				return this.options.type || 'date';
			},
			dateOptions() {
				var op = {};
				if (this.options.disabledDate) {
					op.disabledDate = this.options.disabledDate;
				}
				if (this.options.shortcuts) {
					op.shortcuts = this.options.shortcuts;
				}
				return op;
			},
			showValue() {
				var value = this.value;
				return ((value instanceof Date) && Sunset.isString(this.showFormatter)) ? Sunset.Dates.format(value,
					this.showFormatter) : value;
			},
			showFormatter() {
				return this.options.showFormatter || (this.type == 'month' ? 'yyyy-MM' : 'yyyy-MM-dd');
			},
			formatter() {
				return this.options.formatter || null;
			}
		},
		methods: {
			open() {
				this.pickerValue = (this.value instanceof Date) ? new Date(this.value.getTime()) : this.value;
				this.visible = true;
			},
			handleConfirm() {
				this.value = ((this.pickerValue instanceof Date) && Sunset.isString(this.formatter)) ? Sunset.Dates.format(this.pickerValue,
					this.formatter) : this.pickerValue;
			}
		}
	};
</script>