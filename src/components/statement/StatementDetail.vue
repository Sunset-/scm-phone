<template>
    <div>
        <sunset-table v-ref:table :options="tableOptions"></sunset-table>
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
                        title: '名称',
                        name: 'GDNAME',
                        format(v) {
                            return v;
                        }
                    }, {
                        title: '数量',
                        name: 'ORDERQTY',
                        align: 'center'
                    }, {
                        title: '成本',
                        name: 'TLCOST',
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
                    this.$refs.table.search({
                        entno: this.statement.ENTNO,
                        statementno: this.statement.ORDERNO
                    });
                }
            }
        },
        watch: {
            statement(v) {
                this.loadDetail();
            }
        }
    }
</script>