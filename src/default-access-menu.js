export const defaultAccessMenu = [
    {
        path: "",
        icon: "settings",
        title: "Website",
        name: "website",
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
                        title: "Articles",
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
        title: "System",
        name: "system",
        leftMemu: true,
        children: [
            {
                path: "/system",
                icon: "settings",
                title: "System settings",
                name: "system settings",
                leftMemu: true,
                children: [
                    {
                        path: "menu",
                        icon: "settings",
                        title: "Menu management",
                        name: "menu",
                        leftMemu: true
                    }
                ]
            },
            {
                path: "/permission",
                icon: "settings",
                title: "Authority management",
                name: "permission",
                leftMemu: true,
                children: [
                    {
                        path: "function",
                        icon: "settings",
                        title: "Function management",
                        name: "function",
                        leftMemu: true
                    },
                    {
                        path: "role",
                        icon: "settings",
                        title: "Role management",
                        name: "role",
                        leftMemu: true
                    },
                    {
                        path: "rolepermission",
                        icon: "settings",
                        title: "Role rights management",
                        name: "rolepermission",
                        leftMemu: true
                    },
                    {
                        path: "roleuser",
                        icon: "settings",
                        title: "Role user management",
                        name: "roleuser",
                        leftMemu: true
                    },
                    {
                        path: "userrole",
                        icon: "settings",
                        title: "Role user management",
                        name: "userrole",
                        leftMemu: true
                    }
                ]
            },
            {
                path: "/organization",
                icon: "settings",
                title: "Organization",
                name: "organization",
                leftMemu: true,
                children: [
                    {
                        path: "department",
                        icon: "settings",
                        title: "Department",
                        name: "department",
                        leftMemu: true
                    },
                    {
                        path: "position",
                        icon: "settings",
                        title: "Position management",
                        name: "position",
                        leftMemu: true
                    }
                ]
            },
            {
                path: "/user",
                icon: "settings",
                title: "User Management",
                name: "user",
                leftMemu: true,
                children: [
                    {
                        path: "index",
                        icon: "settings",
                        title: "User Management",
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
                title: "Home",
                name: "home_index"
            },
            {
                path: "userinfo",
                title: "Profile / User info",
                name: "userinfo"
            }
        ]
    }
]
