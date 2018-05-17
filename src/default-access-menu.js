export const defaultAccessMenu = [
    {
        path: "",
        icon: "settings",
        title: "网站",
        name: "网站",
        leftMemu: true,
        children: [
            {
                path: "/cms",
                icon: "settings",
                title: "CMS",
                name: "CMS",
                leftMemu: true,
                children: [
                    {
                        path: "article",
                        icon: "settings",
                        title: "文章管理",
                        name: "article",
                        leftMemu: true
                    }
                ]
            }
        ]
    },
    {
        path: "",
        icon: "settings",
        title: "系统",
        name: "系统",
        leftMemu: true,
        children: [
            {
                path: "/system",
                icon: "settings",
                title: "系统设置",
                name: "系统设置",
                leftMemu: true,
                children: [
                    {
                        path: "menu",
                        icon: "settings",
                        title: "菜单管理",
                        name: "menu",
                        leftMemu: true
                    }
                ]
            },
            {
                path: "/permission",
                icon: "settings",
                title: "权限管理",
                name: "权限管理",
                leftMemu: true,
                children: [
                    {
                        path: "function",
                        icon: "settings",
                        title: "功能管理",
                        name: "function",
                        leftMemu: true
                    },
                    {
                        path: "role",
                        icon: "settings",
                        title: "角色管理",
                        name: "role",
                        leftMemu: true
                    },
                    {
                        path: "rolepermission",
                        icon: "settings",
                        title: "角色权限管理",
                        name: "rolepermission",
                        leftMemu: true
                    },
                    {
                        path: "roleuser",
                        icon: "settings",
                        title: "角色用户管理",
                        name: "roleuser",
                        leftMemu: true
                    },
                    {
                        path: "userrole",
                        icon: "settings",
                        title: "用户角色管理",
                        name: "userrole",
                        leftMemu: true
                    }
                ]
            },
            {
                path: "/organization",
                icon: "settings",
                title: "组织架构",
                name: "组织架构",
                leftMemu: true,
                children: [
                    {
                        path: "department",
                        icon: "settings",
                        title: "部门管理",
                        name: "department",
                        leftMemu: true
                    },
                    {
                        path: "position",
                        icon: "settings",
                        title: "职位管理",
                        name: "position",
                        leftMemu: true
                    }
                ]
            },
            {
                path: "/user",
                icon: "settings",
                title: "用户管理",
                name: "用户管理",
                leftMemu: true,
                children: [
                    {
                        path: "index",
                        icon: "settings",
                        title: "用户管理",
                        name: "user_index",
                        leftMemu: true
                    }
                ]
            }
        ]
    },
    {
        path: "/",
        name: "otherRouter",
        leftMemu: false,
        children: [
            {
                path: "home",
                title: "首页",
                name: "home_index"
            },
            {
                path: "userinfo",
                title: "个人中心",
                name: "userinfo"
            }
        ]
    }
]