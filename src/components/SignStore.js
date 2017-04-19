module.exports = {
    currentUserCache: null,
    currentUser() {
        // return $http({
        //     url: '/service/wxqy/userId/getUserId',
        //     type: 'POST',
        //     data: {
        //         code: 'code'
        //     }
        // }).then(userId => {
        // })
        return $http({
            url: '/service/wxqy/userId/getUserInfo',
            type: 'POST',
            data: {
                oprtno: Sunset.getQueryString('userId')
            }
        }).then(data => {
            //设置用户类型
            data.isProviderBranchOperator = data.RULENO == '0'; //供应商分店操作员
            data.isProviderGroupOperator = data.RULENO == '1'; //供应商集团操作员
            data.isShopOperator = data.RULENO == '2'; //商场操作员
            //缓存用户数据权限
            data.shopvdsMap = {};
            if (data.isProviderGroupOperator || data.isProviderBranchOperator) {
                data.shoplist = data.shopvdlist.map(item => {
                    data.shopvdsMap[item.ENTNO] = data.shopvdsMap[item.ENTNO] || [];
                    data.shopvdsMap[item.ENTNO].push({
                        text: item.VDNAME,
                        value: item.VDNO
                    });
                    return {
                        SHOPCODE: item.ENTNO,
                        SHOPNA: item.SHOPNA
                    };
                });
            }
            //分店供应商对照
            if (data.isProviderBranchOperator) {
                data.firstShopNo = data.shopvdlist && data.shopvdlist[0] && data.shopvdlist[0].ENTNO;
                data.firstShopvdno = data.shopvdlist && data.shopvdlist[0] && data.shopvdlist[0].VDNO;
            }
            this.currentUserCache = data;
            return data;
        });
    },
    getCurrentUserSync() {
        return this.currentUserCache;
    }
}