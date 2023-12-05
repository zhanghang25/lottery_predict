/**
 * 主进程与渲染进程通信频道定义
 * Definition of communication channels between main process and rendering process
 */
const ipcApiRoute = {
  test: "controller.example.test",
  add: "controller.example.add",
  getRecord: "controller.example.find",
  addUser: "controller.example.addUser",
  deleteUser: "controller.example.deleteUser",
  selectUser: "controller.example.selectUser",
  predict: "controller.example.predict",
};

export { ipcApiRoute };
