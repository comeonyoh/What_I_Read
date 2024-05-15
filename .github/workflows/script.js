const { Octokit } = require("@octokit/rest");
const { exec } = require("child_process");

const octokit = new Octokit({ auth: process.env.SECRET_KEY });

async function checkOpenPRs() {
  const { data } = await octokit.rest.pulls.list({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: 'open'
  });

  if (data.length > 0) {
    const message = `There are currently ${data.length} open pull requests.`;
    const curlCommand = `curl -X POST -H 'Content-type: application/json' --data '{"text":"${message}"}' ${process.env.SLACK_WEBHOOK_URL}`;
    exec(curlCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  }
}

checkOpenPRs();
