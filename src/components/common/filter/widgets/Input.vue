<style>
    .filter-input {
        width: 100%;
        height: 30px;
        border-radius: 3px;
        border: 1px solid #cdcdcd;
		padding:0px 5px;
        box-sizing:border-box;
    }
</style>
<template>
    <div :class="['sunset-field-wrap',invalid?'field-invalid':'']">
        <label :class="['sunset-field-label',options.label?'':'sunset-field-label-empty']">{{options.label}}</label>
        <div class="sunset-field sunset-number-input">
            <input class="filter-input" type="text" v-model="value" :placeholder="options.placeholder">
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
            return {};
        },
        computed: {
            maxlength() {
                return this.options.maxlength || this.options.validate && this.options.validate.maxlength && this.options
                    .validate.maxlength
                    .rule;
            },
            digits() {
                return this.options.digits || 0;
            }
        },
        methods: {
            blur() {
                this.value = Sunset.Numbers.fixed(this.value, this.digits);
            }
        }
    };
</script>