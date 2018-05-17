let permission = {

}

permission.check = function (config) {
    if (config.permission && config.permission.length > 0) {
        let needPermissions = config.permission;
        let permissions = JSON.parse(localStorage.getItem('permission'));
        let isAdmin = localStorage.getItem('isAdmin');
        let hasPermission = permissions.some(s => {
            return needPermissions.indexOf(s) > -1;
        })
        if (!hasPermission && isAdmin == 0) {
            return false
        }
    }
    return true
}

export default permission