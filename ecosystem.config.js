module.exports = {
    apps: [
        {
            name: "horeca-pwa",
            mode: "cluster",
            script: "/usr/bin/yarn",
            args: "start",
            watch: false,
            instances: 4,
            autorestart: true,
            max_memory_restart: "300M",
            env_development: {
                PORT: 3003,
                NODE_ENV: "development",
            },
            env_production: {
                PORT: 3000,
                NODE_ENV: "production",
            },
        },
    ],
};
