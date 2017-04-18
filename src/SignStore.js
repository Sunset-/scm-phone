module.exports = {
    currentUser() {
        return $http({
            url: '/service/wxqy/userId/getUserId',
            type: 'POST',
            data: {
                code: 'code'
            }
        }).then(userId => {
            alert('USER_ID:' + userId);
            return $http({
                url: '/service/wxqy/userId/getUserId',
                type: 'POST',
                data: {
                    code: 'code'
                }
            }).then(userId => {
                alert('USER_ID:' + userId);

            })
        })
    },
    getCurrentUserSync() {
        return {
            OPRTNO: '1'
        };
    }
}