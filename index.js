import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const file = "data.json";
const date = moment().format();
const data = {
    date,
};

try {
    await jsonfile.writeFile(file, data, { spaces: 2 });

    const git = simpleGit();
    await git.add([file]);
    await git.commit(date, { "--date": date });
    await git.push();

    console.log(`Committed ${file} with date ${date}`);
} catch (error) {
    console.error("CLI failed:", error.message);
    process.exit(1);
}
