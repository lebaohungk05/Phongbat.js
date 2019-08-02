import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

// Đường dẫn tới file dữ liệu
const path = "./data.json";

// Hàm kiểm tra tính hợp lệ của ngày
const isValidDate = (date) => {
  const startDate = moment("2019-01-01");
  const endDate = moment("2024-12-13");
  return date.isBetween(startDate, endDate, null, "[]");
};

// Hàm tạo commit với ngày cụ thể
const markCommit = async (date) => {
  const data = { date: date.toISOString() };
  await jsonfile.writeFile(path, data);

  const git = simpleGit();
  await git.add([path]);
  await git.commit(date.toISOString(), { "--date": date.toISOString() });
};

// Hàm tạo nhiều commit ngẫu nhiên
const makeCommits = async (n) => {
  const git = simpleGit();

  for (let i = 0; i < n; i++) {
    // Tạo ngày ngẫu nhiên
    const randomWeeks = random.int(0, 544);
    const randomDays = random.int(0, 6);

    const randomDate = moment("2019-01-01")
      .add(randomWeeks, "weeks")
      .add(randomDays, "days");

    // Kiểm tra nếu ngày hợp lệ thì commit
    if (isValidDate(randomDate)) {
      console.log(`Creating commit: ${randomDate.toISOString()}`);
      await markCommit(randomDate);
    } else {
      console.log(`Invalid date: ${randomDate.toISOString()}, skipping...`);
    }
  }

  // Đẩy tất cả commit lên repository
  console.log("Pushing all commits...");
  await git.push();
};

// Tạo 50,000 commit ngẫu nhiên
makeCommits(50000);
