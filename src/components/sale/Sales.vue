<style lang="sass">
    .sale-container {
        .mint-navbar {
            .mint-tab-item {
                padding: 10px 0px;
            }
        }
        .btn-group {
            position: relative;
            display: block;
            margin: 5px auto;
            text-align: center;
            font-size: 0;
            white-space: nowrap;
            vertical-align: middle;
            .btn {
                display: inline-block;
                padding: 5px 12px;
                margin-bottom: 0;
                font-size: 14px;
                line-height: 20px;
                color: #333;
                text-align: center;
                text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
                vertical-align: middle;
                cursor: pointer;
                background-color: #f5f5f5;
                background-image: -moz-linear-gradient(top, #fff, #e6e6e6);
                background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#fff), to(#e6e6e6));
                background-image: -webkit-linear-gradient(top, #fff, #e6e6e6);
                background-image: -o-linear-gradient(top, #fff, #e6e6e6);
                background-image: linear-gradient(to bottom, #fff, #e6e6e6);
                background-repeat: repeat-x;
                border: 1px solid #ccc;
                border-color: #e6e6e6 #e6e6e6 #bfbfbf;
                border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
                border-bottom-color: #b3b3b3;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
                -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
            }
            &>.btn {
                position: relative;
                -webkit-border-radius: 0;
                -moz-border-radius: 0;
                border-radius: 0;
            }
            &>.btn:first-child {
                margin-left: 0;
                -webkit-border-bottom-left-radius: 4px;
                border-bottom-left-radius: 4px;
                -webkit-border-top-left-radius: 4px;
                border-top-left-radius: 4px;
                -moz-border-radius-bottomleft: 4px;
                -moz-border-radius-topleft: 4px;
            }
            &>.btn:last-child {
                -webkit-border-top-right-radius: 4px;
                border-top-right-radius: 4px;
                -webkit-border-bottom-right-radius: 4px;
                border-bottom-right-radius: 4px;
                -moz-border-radius-topright: 4px;
                -moz-border-radius-bottomright: 4px;
            }
            .btn.active,
            .btn:active {
                background-image: none;
                outline: 0;
                -webkit-box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05);
                -moz-box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05);
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05);
            }
        }
    }
</style>
<template>
    <div class="sale-container">
        <mt-header title="销售查询"></mt-header>
        <div class="btn-group">
            <button :class="['btn',filterType=='day'?'active':'']" @click="changeFilterType('day')">日销售查询</button>
            <button :class="['btn',filterType=='month'?'active':'']" @click="changeFilterType('month')">月销售查询</button>
            <button :class="['btn',filterType=='range'?'active':'']" @click="changeFilterType('range')">区段销售查询</button>
        </div>
        <div class="content-container" style="top:70px">
            <div>
                <sunset-filter style="margin-top:10px;" v-ref:dayfilter :options="commonFilterOptions" @filter="setFilter"></sunset-filter>
            </div>
            <div v-show="filterType=='day'">
                <sunset-filter style="margin-bottom:10px;margin-top:5px;" v-ref:dayfilter :options="dayFilterOptions" @filter="loadSales"></sunset-filter>
            </div>
            <div v-show="filterType=='month'">
                <sunset-filter style="margin-bottom:10px;margin-top:5px;" v-ref:monthfilter :options="monthFilterOptions" @filter="loadSales"></sunset-filter>
            </div>
            <div v-show="filterType=='range'">
                <sunset-filter style="margin-bottom:10px;margin-top:5px;" v-ref:rangefilter :options="rangeFilterOptions" @filter="loadSales"></sunset-filter>
            </div>
            <sunset-table v-ref:table :options="tableOptions"></sunset-table>
        </div>
    </div>
</template>
<script>
    import SignStore from '../SignStore.js';
    import Saletore from './Saletore';

    export default {
        computed: {
            isDetail() {
                return this.$route.path == '/order/detail';
            }
        },
        data() {
            return {
                filterType: 'day',
                filter: {},
                commonFilterOptions: {
                    align: 'left',
                    fields: [{
                        label: '分店',
                        name: 'entno',
                        widget: 'select',
                        placeholder: '请选择分店',
                        clearable: false,
                        valuePlace: 'SHOPCODE',
                        textPlace: 'SHOPNA',
                        changeFilter: true,
                        data() {
                            return SignStore.getCurrentUserSync().shoplist || [];
                        }
                    }, (SignStore.getCurrentUserSync().isShopOperator ? {
                        label: '供应商',
                        name: 'vdno',
                        widget: 'input',
                        changeFilter: true,
                        placeholder: '供应商编号'
                    } : {
                        label: '供应商',
                        name: 'vdno',
                        widget: 'select',
                        changeFilter: true,
                        placeholder: '供应商编号',
                        watch: ['entno', (deps, options, filter) => {
                            filter.vdno = null;
                            options.data = SignStore.getCurrentUserSync().shopvdsMap[deps.entno] ||
                                [];
                        }]
                    })],
                    format: function (filter) {
                        filter.type = 'day';
                        filter.begdate = filter.enddate = Sunset.Dates.format(filter.date, 'yyyyMMdd');
                        return filter;
                    }
                },
                dayFilterOptions: {
                    align: 'left',
                    fields: [{
                        label: '选择日期',
                        name: 'date',
                        widget: 'date',
                        type: 'daterange',
                        newline: true,
                        placeholder: '时间范围',
                        default: (function () {
                            var now = new Date();
                            now.setDate(now.getDate() - 1);
                            now.setHours(0);
                            now.setMinutes(0);
                            now.setSeconds(0);
                            now.setMilliseconds(0);
                            return now;
                        })()
                    }],
                    format: function (filter) {
                        filter.type = 'day';
                        filter.begdate = filter.enddate = Sunset.Dates.format(filter.date, 'yyyyMMdd');
                        return filter;
                    },
                    searchButton: {
                        label: '查询',
                        icon: 'search'
                    }
                },
                monthFilterOptions: {
                    align: 'left',
                    fields: [{
                        label: '选择月份',
                        name: 'date',
                        widget: 'date',
                        type: 'month',
                        placeholder: '时间范围',
                        default: (function () {
                            var now = new Date();
                            now.setDate(now.getDate() - 1);
                            now.setHours(0);
                            now.setMinutes(0);
                            now.setSeconds(0);
                            now.setMilliseconds(0);
                            return now;
                        })()
                    }],
                    format: function (filter) {
                        var start = new Date(filter.date.getTime());
                        start.setDate(1);
                        var end = new Date(filter.date.getTime());
                        end.setMonth(end.getMonth() + 1);
                        end.setDate(0);
                        filter.begdate = Sunset.Dates.format(start, 'yyyyMMdd');
                        filter.enddate = Sunset.Dates.format(end, 'yyyyMMdd');
                        filter.type = 'month';
                        return filter;
                    },
                    searchButton: {
                        label: '查询',
                        icon: 'search'
                    }
                },
                rangeFilterOptions: {
                    align: 'left',
                    fields: [{
                        label: '开始日期',
                        name: 'begdate',
                        widget: 'date',
                        type: 'daterange',
                        placeholder: '时间范围',
                        default: (function () {
                            var now = new Date();
                            now.setDate(now.getDate() - 1);
                            now.setHours(0);
                            now.setMinutes(0);
                            now.setSeconds(0);
                            now.setMilliseconds(0);
                            return now;
                        })()
                    }, {
                        label: '结束日期',
                        name: 'enddate',
                        widget: 'date',
                        type: 'daterange',
                        placeholder: '时间范围',
                        default: (function () {
                            var now = new Date();
                            now.setDate(now.getDate() - 1);
                            now.setHours(0);
                            now.setMinutes(0);
                            now.setSeconds(0);
                            now.setMilliseconds(0);
                            return now;
                        })()
                    }],
                    format: function (filter) {
                        filter.begdate = Sunset.Dates.format(filter.begdate, 'yyyyMMdd');
                        filter.enddate = Sunset.Dates.format(filter.enddate, 'yyyyMMdd');
                        filter.type = 'range';
                        return filter;
                    },
                    searchButton: {
                        label: '查询',
                        icon: 'search'
                    }
                },
                tableOptions: {
                    columns: [{
                        title: '分店号',
                        name: 'ENTNO',
                        align: 'center'
                    }, {
                        title: '次分类号',
                        name: 'GDNO',
                        align: 'center'
                    }, {
                        title: '次分类号',
                        name: 'GDNAME',
                        align: 'center'
                    }, {
                        title: '销售金额',
                        name: 'TLPRC',
                        format: 'MONEY',
                        align: 'center'
                    }],
                    showIndex: false,
                    pageSize: 10,
                    localPage: false,
                    multiCheck: true,
                    sortable: false,
                    lazy: true,
                    idKey: 'ORDERNO',
                    format: {
                        list: 'list',
                        count: 'count',
                        pageSize: 'count',
                        currentPage: 'pageno'
                    },
                    formatFilter: (filter) => {
                        filter.oprtno = SignStore.getCurrentUserSync().OPRTNO;
                        return filter;
                    },
                    method: 'loadSales',
                    store: Saletore
                }
            };
        },
        methods: {
            changeFilterType(type) {
                this.filterType = type;
            },
            setFilter(filter) {
                Object.assign(this.filter, filter);
            },
            loadSales(filter) {
                Object.assign(this.filter, filter);
                if (filter.type == this.filterType) {
                    delete filter.type;
                    this.$refs.table.search(this.filter);
                }
            },
            back() {
                Router.go('/order');
            }
        },
        watch: {
            filterType(v) {
                this.$refs[`${v}filter`].search();
            }
        },
        ready() {
            document.title = '销售查询';
        }
    }
</script>