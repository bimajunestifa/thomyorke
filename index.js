import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "data.json";
const git = simpleGit();

const daysToFill = Number(process.env.DAYS_TO_FILL ?? 120);
const minCommitsPerDay = Number(process.env.MIN_COMMITS_PER_DAY ?? 1);
const maxCommitsPerDay = Number(process.env.MAX_COMMITS_PER_DAY ?? 4);
const skipChance = Number(process.env.SKIP_CHANCE ?? 0.18);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const makeCommit = async (date) => {
  const data = { date };

  await jsonfile.writeFile(path, data, { spaces: 2 });
  await git.add([path]);
  await git.commit(date, { "--date": date });
  console.log(`Committed ${date}`);
};

let totalCommits = 0;

for (let dayOffset = daysToFill - 1; dayOffset >= 0; dayOffset -= 1) {
  const day = moment().subtract(dayOffset, "days");

  if (Math.random() < skipChance) {
    console.log(`Skipped ${day.format("YYYY-MM-DD")}`);
    continue;
  }

  const commitsToday = randomInt(minCommitsPerDay, maxCommitsPerDay);

  for (let commitIndex = 0; commitIndex < commitsToday; commitIndex += 1) {
    const date = moment()
      .subtract(dayOffset, "days")
      .hour(12)
      .minute(10 + commitIndex * 15)
      .second(0)
      .format();

    await makeCommit(date);
    totalCommits += 1;
  }
}

await git.push();
console.log(`Pushed ${totalCommits} commits to origin.`);
