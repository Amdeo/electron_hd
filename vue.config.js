module.exports = {
    pluginOptions: {
        quasar: {
            importStrategy: 'kebab',
            rtlSupport: false
        },
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                'appId': 'com.fluid.com',
                'productName': "生产跟踪",
                'files': [
                    './**/*'
                ],
                "directories": {
                    "output": "./dist"//输出文件路径
                },
                'win': { // win相关配置
                    'icon': './favicon.ico', // 图标，当前图标在根目录下，注意这里有两个坑
                    "requestedExecutionLevel": "requireAdministrator", //获取管理员权限
                    'target': [{
                        'target': 'nsis', // 利用nsis制作安装程序
                        'arch': [
                            'x64', // 64位
                            'ia32'
                        ]
                    }]
                },
                'mac': {
                    'icon': './favicon.ico',
                    "target": [
                        "dmg"
                    ]
                },
                'nsis': {
                    'oneClick': false, // 是否一键安装
                    'allowElevation': true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
                    'allowToChangeInstallationDirectory': true, // 允许修改安装目录
                    'installerIcon': './favicon.ico', // 安装图标
                    'uninstallerIcon': './favicon.ico', // 卸载图标
                    'installerHeaderIcon': './favicon.ico', // 安装时头部图标
                    'createDesktopShortcut': true, // 创建桌面图标
                    'createStartMenuShortcut': true, // 创建开始菜单图标
                    'shortcutName': 'wyDemo' // 图标名称(项目名称)
                }
            }
        }
    },
    transpileDependencies: [
        'quasar'
    ]
}
