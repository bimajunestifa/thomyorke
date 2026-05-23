import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "data.json";
const git = simpleGit();

const daysToFill = Number(process.env.DAYS_TO_FILL ?? 120);
const commitsPerDay = Number(process.env.COMMITS_PER_DAY ?? 3);

const makeCommit = async (date) => {
  const data = { date };

  await jsonfile.writeFile(path, data, { spaces: 2 });
  await git.add([path]);
  await git.commit(date, { "--date": date });
  console.log(`Committed ${date}`);
};

for (let dayOffset = daysToFill - 1; dayOffset >= 0; dayOffset -= 1) {
  for (let commitIndex = 0; commitIndex < commitsPerDay; commitIndex += 1) {
    const date = moment()
      .subtract(dayOffset, "days")
      .hour(12)
      .minute(commitIndex * 10)
      .second(0)
      .format();

    await makeCommit(date);
  }
}

await git.push();
console.log(`Pushed ${daysToFill * commitsPerDay} commits to origin.`);
