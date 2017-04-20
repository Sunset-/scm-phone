const URLS = {
    LIST: '/service/scm/select/getVdacctsumList',
    DETAIL_RECEIVE: '/service/scm/select/getReceiveDetailList',
    DETAIL_RETURN: '/service/scm/select/getReturnDetailList',
    CONFIRM: '/service/scm/select/confirmAcc'
};

module.exports = {
    loadStatements(filter) {
        return $http({
            url: URLS.LIST,
            type: 'POST',
            data: filter
        });
    },
    loadDetail(filter) {
        var type = filter.type,
            desc = filter.desc;
        delete filter.type;
        delete filter.desc;
        var urlType = {
            BY: 'DETAIL_RECEIVE',
            RT: 'DETAIL_RETURN'
        };
        return $http({
            url: URLS[urlType[type]],
            type: 'POST',
            data: filter
        }).then(res => {
            if (res) {
                var totalPrc = 0,
                    totalCost = 0;
                var prc = type == 'BY' ? 'TLPRC' : 'RTNPRC';
                var cost = type == 'BY' ? 'TLCOST' : 'RTNCOST';
                res.list = res.list || [];
                res.list.forEach(item => {
                    item.desc = desc;
                    item.prc = item[prc];
                    item.cost = item[cost];
                    totalPrc += item[prc];
                    totalCost += item[cost];
                });
                res.list.push({
                    SUNSET_APPEND_LABEL: true,
                    desc: '<span style="float:right;">总计：</span>',
                    prc: totalPrc,
                    cost: totalCost
                })
            }
            return res;
        });
    },
    confirm(model) {
        return $http({
            url: URLS.CONFIRM,
            type: 'POST',
            data: model
        });
    }
}