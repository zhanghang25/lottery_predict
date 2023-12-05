"use strict";

const { Controller } = require("ee-core");
const Log = require("ee-core/log");
const Services = require("ee-core/services");

/**
 * example
 * @class
 */
class ExampleController extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值。详情见：控制器文档
   */

  /**
   * test
   */
  async test() {
    const result = await Services.get("example").test("electron");
    Log.info("service result:", result);

    return "hello electron-egg";
  }

  async addUser(name) {
    const resutl = await Services.get("storage").addUser(name);
    return result;
  }
  async selectUser(params) {
    const result = await Services.get("storage").getUserData(params);
    console.log(result);
    return result;
  }

  async add(params, num) {
    if (num >= 10) {
      await Services.get("storage").delRecordData();
    }
    const result = await Services.get("storage").addTestData(params);
    console.log(result);
    return result;
  }

  async deleteUser(params) {
    const result = await Services.get("storage").deleteUser(params);
    console.log(result);
    return result;
  }

  async find(params) {
    const result = await Services.get("storage").getTestData(params);
    console.log(result);
    return result;
  }

  async predict(params) {
    const result = await Services.get("storage").predict(params);
    console.log(result);
    return result;
  }
}

ExampleController.toString = () => "[class ExampleController]";
module.exports = ExampleController;
