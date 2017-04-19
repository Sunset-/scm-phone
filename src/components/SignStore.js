module.exports = {
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
                oprtno: '1'
            }
        });
    },
    getCurrentUserSync() {
        return {
            OPRTNO: '1'
        };
    }
}