/**
 * 基础路由
 * @type { *[] }
 */

const constantRouterMap = [
  {
    path: "/",
    name: "Example",
    redirect: { name: "ExampleHelloIndex" },
    children: [
      {
        path: "/example",
        name: "ExampleHelloIndex",
        component: () => import("@/views/example/hello/Index.vue"),
      },
      {
        path: "/main",
        name: "Main",
        component: () => import("@/views/example/hello/Main.vue"),
      },
    ],
  },
];

export default constantRouterMap;
