<template>
    <div>
        <sunset-table style="margin-bottom:10px;" v-ref:table :options="tableOptions"></sunset-table>
        <mt-button v-if="statement&&statement.CHKTAG == '0'" :type="'primary'" size="large" icon="" @click="ensure">确认</mt-button>
    </div>
</template>
<script>
    import StatementStore from './StatementStore.js';

    export default {
        props: {
            statement: {

            }
        },
        data() {
            return {
                tableOptions: {
                    columns: [{
                        title: '描述',
                        name: 'desc'
                    }, {
                        title: '销售',
                        name: 'prc',
                        format: 'MONEY'
                    }, {
                        title: '成本',
                        name: 'cost',
                        format: 'MONEY'
                    }],
                    showIndex: false,
                    pageSize: 10,
                    localPage: true,
                    multiCheck: true,
                    sortable: false,
                    lazy: true,
                    idKey: 'ORDERNO',
                    format: {
                        list: 'list',
                        count: 'list.length',
                        pageSize: 'count',
                        currentPage: 'pageno'
                    },
                    formatFilter: (filter) => {
                        return filter;
                    },
                    method: 'loadDetail',
                    store: StatementStore
                }
            }
        },
        methods: {
            loadDetail() {
                if (this.statement) {
                    this.$refs.table.setData({});
                    this.$refs.table.search({
                        entno: this.statement.ENTNO,
                        orderno: this.statement.SHEETNO,
                        pageno: 1,
                        count: 9999,
                        type: this.statement.WLTYPE,
                        desc: `${this.statement.WORKDATE}${{
                                'BY': '收货',
                                'RT': '退货',
                                'SL': '销售',
                                'AJ': '销售调整',
                                'FE': '供应商费用'
                            }[this.statement.WLTYPE]}`
                    });
                }
            },
            ensure() {
                Sunset.confirm({
                    title: '',
                    message: '确认对账单？'
                }).then(res => {
                    StatementStore.confirm({
                        entno: this.statement.ENTNO,
                        sheetno: this.statement.SHEETNO
                    }).then(res => {
                        Sunset.tip('确认成功', 'success');
                        this.statement.CHKTAG = '1';
                        this.$emit('refresh');
                        Router.go('/statement');
                    });
                });
            }
        },
        watch: {
            statement(v) {
                this.loadDetail();
            }
        }
    }
</script>