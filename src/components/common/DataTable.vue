<style lang="sass">
    .sunset-crud-table-container {
        .sunset-crud-table-wrap {
            overflow-y: auto;
            border-top: 1px solid #eeeeee;
            border-bottom: 1px solid #eeeeee;
            .text-center {
                text-align: center;
            }
            table {
                width: 100%;
                max-width: 100%;
                border-color: #eee;
                margin-top: -1px;
                background-color: transparent;
                border-collapse: collapse;
                border-spacing: 0;
                thead {
                    display: table-header-group;
                    vertical-align: middle;
                    border-color: inherit;
                }
                tr {
                    display: table-row;
                    vertical-align: inherit;
                    border-color: inherit;
                    th {
                        border-top: 0;
                        border-color: #eee;
                        position: relative;
                        border: 1px solid #eee;
                        border-bottom: 1px solid #eee;
                        color: #2c2e2f;
                        padding: 12px 15px;
                        vertical-align: bottom;
                    }
                    td {
                        border-color: #eee;
                        border-top: 0;
                        border-bottom: 1px solid #eee;
                        padding: 8px 8px;
                        border: 1px solid #eee;
                        line-height: 1.42857143;
                        vertical-align: middle;
                    }
                }
                tbody {
                    tr:nth-child(odd)>td,
                    tr:nth-child(odd)>th {
                        background-color: #f9f9f9;
                    }
                }
            }
            .table>thead>tr>td,
            .table>tbody>tr>td,
            .table>tfood>tr>td,
            .table>thead>tr>th,
            .table>tbody>tr>th,
            .table>tfood>tr>th {
                padding: 8px;
            }
            .table>tbody>tr>td.sunset-table-record-tools {
                position: relative;
                padding: 0px;
                text-align: center;
                &>div {
                    position: absolute;
                    top: 0px;
                    bottom: 0px;
                    width: 100%;
                    &>div {
                        display: table;
                        height: 100%;
                        width: 100%;
                        &>.sunset-toolbar {
                            display: table-cell;
                            vertical-align: middle;
                        }
                    }
                }
            }
        }
        .sunset-crud-table-toolbar-wrap {
            padding-bottom: 15px;
            .sunset-toolbar {
                .btn {
                    margin-bottom: 0px;
                }
            }
            &:after {
                content: '';
                display: block;
                clear: both;
            }
        }
        .sunset-crud-table-footer {
            margin-top: 15px;
        }
    }
</style>
<template>
    <div class="sunset-crud-table-container">
        <!--表格主体-->
        <div class="table-wrap sunset-crud-table-wrap">
            <table :class="['table table-bordered table-striped',options.condensed?'table-condensed':'']">
                <thead>
                    <tr class="noselect">
                        <th v-for="col in showColumns">
                            <div style="cursor:pointer;">
                                {{col.title}}
                            </div>
                        </th>
                        <th v-if="recordTools" class="text-center" :style="{width:(recordToolsWidth+'px')}">{{options.recordToolsTitle||'操作'}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in list">
                        <td v-for="col in showColumns" :style="col.style||{'text-align':col.align}">
                            <template v-if="col.link">
                                <a class="table-td-link" href="javascript:;" @click="col.link(item)">{{{ item.__sunset_col_texts[col.__sunset_col_index]}}}</a>
                            </template>
                            <template v-if="!col.link">
                                {{{ item.__sunset_col_texts[col.__sunset_col_index]}}}
                            </template>
                        </td>
                    </tr>
                </tbody>
                <tfoot></tfoot>
            </table>
        </div>
        <!--分页-->
        <div v-show="showPager" class="sunset-crud-table-footer">
            <sunset-page @change="refresh" right="true" :page-number.sync="pageNumber" :show-total="true" :page-size="pageSize" :total.sync="count"></sunset-page>
        </div>
    </div>
</template>
<script>
    function tableColTranscode(value, col, record) {
        if (col.format) {
            if (Sunset.isFunction(col.format)) {
                return col.format(value, record);
            } else {
                switch (col.format) {
                    case 'DATETIME':
                        return Sunset.Dates.format(new Date(isNaN(value) ? value : (+value)));
                        break;
                    case 'DATE':
                        return Sunset.Dates.format(new Date(isNaN(value) ? value : (+value)), 'yyyy-MM-dd');
                        break;
                    case 'MONEY':
                        return `<div style="text-align: right;">${Sunset.Numbers.fixed(value,2)}<div>`;
                        break;
                }
            }
        }
        return value;
    }

    export default {
        props: {
            options: {
                type: Object
            },
            checkeds: {
                type: Array,
                default () {
                    return [];
                }
            }
        },
        data() {
            return {
                pageNumber_: 1,
                filter: {},
                localFilter: null,
                data: null,
                localCount: 0,
                isAllCheck: false,
                sortCol: null,
                sortOrder: 'DESC',
                loading: false
            }
        },
        computed: {
            widthStyle() {
                if (this.options.minWidth) {
                    return {
                        'min-width': `${this.options.minWidth}px`
                    }
                }
            },
            //是否本地分页
            isLocalPage() {
                return !!this.options.localPage;
            },
            //列
            columns() {
                return (this.options.columns || []).map((col, index) => {
                    col.__sunset_col_index = index;
                    return col;
                });
            },
            showColumns() {
                return this.columns.filter(col => !!col.name && (col.premise ? col.premise() : true));
            },
            //行操作栏
            recordTools() {
                var result = false;
                var recordTools = this.options.recordTools;
                if (recordTools) {
                    if (Sunset.isArray(recordTools) && recordTools.length) {
                        result = {
                            size: 'small',
                            tools: recordTools
                        };
                    } else if (Sunset.isArray(recordTools.tools) && recordTools.tools.length) {
                        result = recordTools;
                        if (recordTools.size == void 0) {
                            recordTools.size = 'small';
                        }
                    }
                }
                return result;
            },
            recordToolsWidth() {
                if (this.options.recordToolsWidth) {
                    return this.options.recordToolsWidth;
                } else {
                    var w = 0,
                        recordTools = this.recordTools;
                    if (recordTools) {
                        var tools = Sunset.isArray(recordTools) ? recordTools : recordTools.tools,
                            space = recordTools.size == 'small' ? 20 : 34;
                        tools.forEach(t => {
                            w += (t.label && t.label.length || 0) * 14 + (t.icon ? 20 : 0) + space;
                        });
                    }
                    return Math.max(w, 60);
                }
            },
            format() {
                return this.options.format || {};
            },
            pageNumber: {
                set(val) {
                    this.pageNumber_ = val;
                },
                get() {
                    return this.pageNumber_;
                }
            },
            pageSize() {
                return this.options.pageSize || 10;
            },
            //数据
            formatFilter() {
                return this.options.formatFilter;
            },
            store() {
                return this.options.store;
            },
            datasource() {
                return this.options.datasource;
            },
            list() {
                var list;
                if (this.format && this.format['list'] == '') {
                    list = this.data || [];
                } else {
                    list = this.data && Sunset.getAttribute(this.data, this.format['list'] || 'list', []);
                }
                if (this.isLocalPage) {
                    //本地分页
                    var start = (this.pageNumber - 1) * this.pageSize,
                        localFilter = this.localFilter;
                    list = localFilter && list.filter(localFilter) || list || [];
                    this.localCount = list.length;
                    return list.slice(start, start + this.pageSize);
                } else {
                    return list;
                }
            },
            count() {
                if (!this.isLocalPage) {
                    return this.data && Sunset.getAttribute(this.data, this.format['count'] || 'count', 0);
                } else {
                    //本地分页
                    return this.localCount;
                }
            },
            showPager() {
                return this.count > this.pageSize;
            },
            //勾选
            idKey() {
                return this.options.idKey || 'id';
            },
            multiCheck() {
                return !!this.options.multiCheck;
            },
            checkedIds() {
                return this.checkeds.map(item => item[this.idKey]);
            },
            //排序
            sortable() {
                return !!this.options.sortable;
            },
            slientLoading() {
                return this.options.loading === false;
            }
        },
        methods: {
            search(filter, localFilter, force) {
                this.filter = Object.assign(this.filter, filter || {});
                this.localFilter = localFilter;
                this.refresh(1, force);
            },
            refresh(pageNumber, force) {
                pageNumber = pageNumber == void 0 ? this.pageNumber : pageNumber;
                this.pageNumber = pageNumber;
                //过滤条件
                var filter = $.extend(true, {}, this.filter);
                filter[this.format['currentPage'] || 'currentPage'] = (this.options.pageNumberStart === 0) ? pageNumber -
                    1 :
                    pageNumber;
                filter[this.format['pageSize'] || 'pageSize'] = this.pageSize;
                filter = this.formatFilter && this.formatFilter(filter) || filter;
                Promise.resolve((() => {
                    var datasource = this.datasource || this.store && this.store[this.options.method ||
                        'list'].bind(this.store);
                    if (datasource) {
                        this.refreshLoader(true);
                        return Sunset.isFunction(datasource) ? datasource(filter) : datasource;
                    } else {
                        throw new Error('table load data need datasource or store');
                    }
                })()).then(res => {
                    this.refreshLoader(false);
                    this.setData(res);
                });
            },
            refreshLoader(flag) {
                if (!this.slientLoading) {
                    this.loading = flag;
                }
            },
            setData(res) {
                var columns = this.columns,
                    list;
                if (this.format && this.format['list'] == '') {
                    list = res || [];
                } else {
                    list = res && Sunset.getAttribute(res, this.format['list'] || 'list', []);
                }
                list.forEach(record => {
                    record.__sunset_col_texts = {};
                    columns.forEach((col, index) => {
                        record.__sunset_col_texts[index] = tableColTranscode(
                            Sunset.getAttribute(record, col.name,
                                ''), col, record)
                    });
                });
                this.data = res;
            },
            refreshAfterRemove() {
                if (this.pageNumber > 1 && (this.count - 1 == (this.pageNumber - 1) * this.pageSize)) {
                    this.refresh(this.pageNumber - 1, true);
                } else {
                    this.refresh(void 0, true);
                }
            },
            operateRecord(signal, record) {
                this.$emit.apply(this, ['signal'].concat([].slice.call(arguments)));
            }
        },
        ready() {
            if (!this.options.lazy) {
                this.refresh(1);
            }
        }
    }
</script>