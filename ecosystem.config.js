export default {
  apps: [
    {
      name: "web",
      cwd: "./apps/web",
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3030",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "docs",
      cwd: "./apps/docs",
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3031",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "api",
      cwd: "./apps/api",
      script: "dist/index.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
