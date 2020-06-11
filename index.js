(async () => {
  const { Octokit } = require("@octokit/rest");
  const createCsvWriter = require("csv-writer").createObjectCsvWriter;

  const org = process.env.GITHUB_ORG;

  if (!org) {
    throw new Error("process.env.GITHUB_ORG is required");
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const repos = await octokit.paginate(
    octokit.repos.listForOrg,
    {
      org,
      per_page: 100,
    },
    (r) => r.data
  );

  const data = [];
  for (let r of repos) {
    data.push({
      title: r.full_name,
      created_at: r.created_at,
      updated_at: r.updated_at,
      description: r.description,
      url: r.html_url,
    });
  }

  const csvWriter = createCsvWriter({
    path: `${org}.csv`,
    header: [
      { id: "title", title: "Title" },
      { id: "created_at", title: "Created At" },
      { id: "updated_at", title: "Updated At" },
      { id: "description", title: "Description" },
      { id: "url", title: "URL" },
    ],
  });

  csvWriter.writeRecords(data);
})();
