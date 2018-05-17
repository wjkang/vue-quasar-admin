export default ({ app, router, store, Vue }) => {
    Vue.directive('permission', {
        bind: function (el, binding, vnode) {
            let needPermissions = binding.value;
            let permissions = JSON.parse(localStorage.getItem('permission'));
            let isAdmin=localStorage.getItem('isAdmin');
            let hasPermission = permissions.some(s => {
                return needPermissions.indexOf(s) > -1;
            })
            if (!hasPermission&&isAdmin==0) {
                el.style.display = "none";
            }
        }
    })
}