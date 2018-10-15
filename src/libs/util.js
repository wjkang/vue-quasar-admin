let util = {

};
util.title = function (title) {
    title = title || 'vue.quasar.admin';
    window.document.title = title;
};

util.getMenuByName = function (name, menulist) {
    let menu = {};
    let forFn = function (name, menulist) {
        for (var item of menulist) {
            if (item.name === name) {
                menu = item;
            } else {
                if (item.children && item.children.length > 0) {
                    forFn(name, item.children)
                }
            }
            if (menu.name) {
                break;
            }
        }
    }
    forFn(name, menulist);
    return menu;
}

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};
util.getParentMenusByName = function (openAccesseMenu, name) {
    let temp = [];
    let forFn = function (openAccesseMenu, name) {
        for (var item of openAccesseMenu) {
            if (item.name === name && item.path !== "/") {
                temp.push(item);
                forFn(openAccesseMenu, item.parentName);
            }
        }
    };
    forFn(openAccesseMenu, name);
    temp.reverse()
    return temp;
};

util.handleTitle = function (vm, item) {
    return item.title;
};

util.setCurrentPath = function (vm, name) {
    let openAccesseMenu = vm.$store.state.app.openAccessMenu;
    let menulistWithParent = util.getParentMenusByName(openAccesseMenu, name);
    let currentPathArr = [];
    if (!menulistWithParent.some(item => {
        return item.name === "home_index"
    })) {
        currentPathArr.push({
            title: vm.$t("Home"),
            path: "/home",
            name: 'home_index'
        });
    }
    currentPathArr.push(...menulistWithParent);
    vm.$store.commit('setCurrentPath', currentPathArr);
};
util.setCurrentModule = function (vm, name) {
    let openAccesseMenu = vm.$store.state.app.openAccessMenu;
    let moduleList = vm.$store.state.app.moduleList;
    let currentModule = vm.$store.state.app.currentModule;
    let menulistWithParent = util.getParentMenusByName(openAccesseMenu, name);
    if (menulistWithParent.length > 0) {
        let moduleName = menulistWithParent[0].name;
        if (moduleList.some(item => {
            return item.name === moduleName
        }) && currentModule !== moduleName) {
            vm.$store.dispatch('changeModule', moduleName);
        }
    }

};
util.toDefaultPage = function (menulist, to, routes, next) {
    if (to.path == "/") {
        next({ name: 'home_index', replace: true })
    }
    else {
        next()
    }
};
util.openAccesseMenu = function (accesseMenu) {
    let openAccesseMenu = [];
    let forFn = function (menulist, parentName) {
        for (var item of menulist) {
            item.parentName = parentName;
            openAccesseMenu.push(item)
            if (item.children && item.children.length > 0) {
                forFn(item.children, item.name)
            }
        }
    }
    forFn(accesseMenu, '');
    return openAccesseMenu;
}

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) {  // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tags = vm.$store.state.app.openAccessMenu.filter((item) => {
            return name === item.name;
        });
        if (tags.length > 0) {
            let tag = tags[0];
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
};

export default util;
