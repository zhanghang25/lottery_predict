"use strict";

const { Service } = require("ee-core");
// 框架提供的数据库对象
// ee-core:v2.0.1
const Storage = require("ee-core/storage");
const _ = require("lodash");

/**
 * 数据存储
 * @class
 */
class StorageService extends Service {
  constructor(ctx) {
    super(ctx);

    this.demoDBKey = {
      test_data: "data",
      user_name: "username",
    };
    // jsondb数据库

    // ee-core所使用的库
    this.systemDB = Storage.connection("system");

    // demo库
    let jsondbOptions = {
      driver: "jsondb",
    };
    this.demoDB = Storage.connection("demo", jsondbOptions);
  }

  /*
   * 增 Test data
   */
  async addTestData(user) {
    const key = this.demoDBKey.test_data;
    if (!this.demoDB.db.has(key).value()) {
      this.demoDB.db.set(key, []).write();
    }

    const data = this.demoDB.db.get(key).push(user).write();

    return data;
  }

  async addUser(user) {
    const key = this.demoDBKey.user_name;
    if (!this.demoDB.db.has(key).value()) {
      this.demoDB.db.set(key, []).write();
    }

    const data = this.demoDB.db.get(key).push(user).write();

    return data;
  }
  /*
   * 删 Test data
   */
  async delTestData(name = "") {
    const key = this.demoDBKey.test_data;
    const data = this.demoDB.db.get(key).remove({ value: name }).write();

    return data;
  }

  /*
   * 改 Test data
   */
  async updateTestData(name = "", age = 0) {
    const key = this.demoDBKey.test_data;
    const data = this.demoDB.db
      .get(key)
      .find({ name: name }) // 修改找到的第一个数据，貌似无法批量修改 todo
      .assign({ age: age })
      .write();

    return data;
  }

  async getUserData(param) {
    const key = this.demoDBKey.user_name;
    let data = this.demoDB.db
      .get(key)
      //.find({age: age}) 查找单个
      .filter(function (o) {
        if(param){
          return o.value != "" && o.value != null&& o.value.includes(param)
        }
        return o.value != "" && o.value != null;
      })
      .orderBy(["date","value"], ['desc',"desc"])
      //.slice(0, 10) 分页
      .value();

    if (_.isEmpty(data)) {
      data = [];
    }

    return data;
  }
  /*
   * 查 Test data
   */
  async getTestData(name) {
    this.delTestData("")
    const key = this.demoDBKey.test_data;
    let data = this.demoDB.db
      .get(key)
      //.find({age: age}) 查找单个
      .filter(function (o) {
        return (o.value != "" && o.value != null )&& (!name || o.name == name);
      })
      .orderBy(["date","value"], ["desc", "desc"])
      //.orderBy(['age'], ['name']) 排序
      .slice(0, 10)
      .reverse()
      .value();

    if (_.isEmpty(data)) {
      data = [];
    }
    console.log(data);

    return data;
  }

  /*
   * all Test data
   */
  async getAllTestData() {
    const key = this.demoDBKey.test_data;
    if (!this.demoDB.db.has(key).value()) {
      this.demoDB.db.set(key, []).write();
    }
    let data = this.demoDB.db.get(key).value();

    if (_.isEmpty(data)) {
      data = [];
    }

    return data;
  }
}

module.exports = StorageService;
