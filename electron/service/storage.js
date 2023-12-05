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

  async deleteUser(name = "") {
    if (name == "") {
      return;
    }
    const key = this.demoDBKey.user_name;
    const data = this.demoDB.db.get(key).remove({ value: name }).write();
    this.deleteByName(name);

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

  async deleteByName(name = "") {
    if (name == "") {
      return;
    }
    const key = this.demoDBKey.test_data;
    const data = this.demoDB.db.get(key).remove({ name: name }).write();

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

  async delRecordData() {
    const key = this.demoDBKey.test_data;
    const data = this.demoDB.db
      .get(key)
      .orderBy(["date", "value"], ["desc", "desc"])
      //.orderBy(['age'], ['name']) 排序
      .slice(10, 20)
      .remove({ value: name })
      .write();
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
        if (param) {
          return o.value != "" && o.value != null && o.value.includes(param);
        }
        return o.value != "" && o.value != null;
      })
      .orderBy(["date", "value"], ["desc", "desc"])
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
    this.delTestData("");
    const key = this.demoDBKey.test_data;
    let data = this.demoDB.db
      .get(key)
      //.find({age: age}) 查找单个
      .filter(function (o) {
        return o.value != "" && o.value != null && (!name || o.name == name);
      })
      .orderBy(["date", "value"], ["desc", "desc"])
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

  async predict(param) {
    let data = (await this.getTestData(param.name)).map((item) => item.value);
    data.push(param.value);
    return this.contract(param.num, data.join(""));
  }

  contract(num, final_str) {
    let flag = 0;
    let map = new Map();
    let all_count = 0;
    for (let i = 0; i < final_str.length; i++) {
      if (flag == 1) {
        if (map.has(final_str[i])) {
          map.set(final_str[i], map.get(final_str[i]) + 1);
        } else {
          map.set(final_str[i], 1);
        }
        all_count++;
      }
      if (final_str[i] == num) {
        flag = 1;
      } else {
        flag = 0;
      }
    }
    let str =
      num +
      "共出现了:" +
      all_count +
      "次,\n" +
      num +
      "后面是1的概率是：" +
      this.getPercent(map, all_count, "1") +
      "\n" +
      num +
      "后面是2的概率是：" +
      this.getPercent(map, all_count, "2") +
      "\n" +
      num +
      "后面是3的概率是：" +
      this.getPercent(map, all_count, "3") +
      "\n" +
      num +
      "后面是4的概率是：" +
      this.getPercent(map, all_count, "4") +
      "\n";
    console.log(str);
    return str;
  }
  getPercent(map, all_count, num) {
    const newLocal = ((map.get(num) / all_count) * 100).toFixed(2);
    return (isNaN(newLocal) ? 0 : newLocal) + "%";
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
