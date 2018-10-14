import Util from '@/libs/util';
import { getAccessMemu } from '@/service/system/menu'
import { defaultAccessMenu } from '@/default-access-menu'

const app = {
    state: {
        currentPath: [
            {
                title: 'Home',
                path: '',
                name: 'home_index'
            }
        ], // 面包屑数组
        pageOpenedList: [
            {
                title: 'Home',
                path: '',
                name: 'home_index'
            }
        ],//打开的标签
        cachePage: [],//缓存的页面
        dontCache: ["home_index"], // 在这里定义你不想要缓存的页面的name属性值
        currentModule: '',//当前模块
        accessMenu: [],//可访问的菜单,
        openAccessMenu: [],//展开的可访问的菜单(子级包含父级name)
        moduleList: [],//模块列表
        moduleMenu: [],//模块菜单
    },
    mutations: {
        setCurrentPath(state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentModule(state, module) {
            state.currentModule = module;
        },
        setAccessMenu(state, list) {
            state.accessMenu = list;
        },
        setOpenAccessMenu(state, list) {
            state.openAccessMenu = list;
        },
        setModuleList(state, list) {
            state.moduleList = list
        },
        setModuleMenu(state, list) {
            state.moduleMenu = list
        },
        pageOpenedList(state, get) {
            let openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            //替换新标签
            state.pageOpenedList.splice(get.index, 1, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        increateTag(state, tagObj) {
            if (!Util.oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name);
                localStorage.cachePage = JSON.stringify(state.cachePage);
            }
            state.pageOpenedList.push(tagObj);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        closePage(state, name) {
            for (const [i, v] of state.cachePage.entries()) {
                if (v === name) {
                    state.cachePage.splice(i, 1)
                    break
                }
            }
            for (const [i, v] of state.pageOpenedList.entries()) {
                if (v.name === name) {
                    state.pageOpenedList.splice(i, 1)
                    break
                }
            }
        },
        closePages(state, data) {
            let type = data.type;
            let name = data.name;
            if (type === "all") {
                state.pageOpenedList = [{
                    title: 'Home',
                    path: '',
                    name: 'home_index'
                }]
                state.cachePage = []
            } else {
                for (const [i, v] of state.cachePage.entries()) {
                    if (v === name) {
                        state.cachePage = state.cachePage.splice(i, 1)
                        break
                    }
                }
                for (const [i, v] of state.pageOpenedList.entries()) {
                    if (v.name === name) {
                        state.pageOpenedList = state.pageOpenedList.splice(i, 1, )
                        if (name !== "home_index") {
                            state.pageOpenedList.unshift({
                                title: 'Home',
                                path: '',
                                name: 'home_index'
                            })
                        }
                        break
                    }
                }
            }
        }
    },
    actions: {
        async updateAccessMenu({ commit }) {
            let accesseMenu = defaultAccessMenu;
            try {
                let response = await getAccessMemu();
                accesseMenu = response.data.data;
            } catch (e) {

            }
            let openAccesseMenu = Util.openAccesseMenu(accesseMenu);
            let moduleList = accesseMenu.filter(item => {
                return item.leftMemu
            });
            let currentModule = moduleList[0].name;
            let moduleMenu = moduleList[0].children;

            commit('setModuleMenu', moduleMenu);
            commit('setCurrentModule', currentModule);
            commit('setModuleList', moduleList);
            commit('setAccessMenu', accesseMenu);
            commit('setOpenAccessMenu', openAccesseMenu);
        },
        changeModule({ commit, state }, module) {
            let accesseMenu = state.accessMenu;
            let moduleList = accesseMenu.filter(item => {
                return item.leftMemu && item.name === module
            });
            let moduleMenu = moduleList[0].children;
            commit('setModuleMenu', moduleMenu);
            commit('setCurrentModule', module);
        },
        closePage({ commit, state }, name) {
            return new Promise((resolve) => {
                commit('closePage', name)
                resolve([...state.pageOpenedList])
            })
        },
        closePages({ commit, state }, data) {
            return new Promise((resolve) => {
                commit('closePages', data)
                resolve([...state.pageOpenedList])
            })
        }
    }
};

export default app;
