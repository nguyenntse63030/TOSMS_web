const mongoose = require("mongoose");
require("../configs/loadModelsMongoose");
const User = mongoose.model("User");
const District = mongoose.model("District");
const constants = require("../configs/constant");

let workers = require("../public/javascripts/employee/MOCK_DATA.json");

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
async function createWorker() {
  try {
    let count = 0;
    let districts = await District.find({ cityID: 79 });

    for (let worker of workers) {
      //   console.log(worker.fullname);
      let data = {
        username: "worker" + count++,
        name: worker.fullname,
        gender: constants.genderEnums[getRandomInt(2)],
        birthday: Date.now(),
        district: districts[getRandomInt(districts.length - 1)]._id,
        email: worker.email,
        address: worker.address,
      };
      let user = new User(data);
      user.password = "1111";
      await user.save();
    }
  } catch (error) {
    console.log(error);
    process.exit();
  }

  console.log("success");
  process.exit();
}

createWorker();
