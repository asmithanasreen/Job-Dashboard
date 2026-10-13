let barChart;
let pieChart;
let companyChart;
let expChart;
let trendChart;
let jobTypeChart;

let csvData = [];
let allSkills = [];

// ======================
// LOAD CSV
// ======================

Papa.parse("/static/jobs.csv", {
    download: true,
    header: true,

    complete: function(results) {

        csvData = results.data.filter(
            row => row.Skill && row.Company
        );

        allSkills = [
            ...new Set(
                csvData.map(row => row.Skill)
            )
        ];

        updateCards(csvData);

        // Show Top 10 Job Roles initially
        showTop10Jobs();

        createCharts(csvData);
    }
});

// ======================
// SEARCH SKILL
// ======================

function searchSkill(){

    let skill =
    document.getElementById("searchSkill")
    .value
    .trim()
    .toLowerCase();

    if(skill === ""){

        document.getElementById("result")
        .innerHTML =
        "📊 Showing Top 10 Job Roles";

        updateCards(csvData);
        showTop10Jobs();
        createCharts(csvData);

        return;
    }

    let filteredData =
    csvData.filter(row =>
        row.Skill.toLowerCase()
        .includes(skill)
    );

    if(filteredData.length > 0){

        document.getElementById("result")
        .innerHTML =
        "✅ " + filteredData.length +
        " Jobs Available";

        updateCards(filteredData);
        fillTable(filteredData);
        createCharts(filteredData);

    }
    else{

        document.getElementById("result")
        .innerHTML =
        "❌ Skill Not Found";

        fillTable([]);
    }
}
// ======================
// RESET DASHBOARD
// ======================

function resetDashboard(){

    document.getElementById("searchSkill")
    .value = "";

    document.getElementById("result")
    .innerHTML =
    "📊 Showing Top 10 Job Roles";

    updateCards(csvData);

    showTop10Jobs();

    createCharts(csvData);
}

// ======================
// KPI CARDS
// ======================

function updateCards(data){

    document.getElementById("totalJobs")
    .innerHTML =
    data.length;

    let skills =
    [...new Set(
        data.map(row => row.Skill)
    )];

    document.getElementById("uniqueSkills")
    .innerHTML =
    skills.length;

    let companies =
    [...new Set(
        data.map(row => row.Company)
    )];

    document.getElementById("companies")
    .innerHTML =
    companies.length;

    document.getElementById("avgExp")
    .innerHTML =
    "3.5 yrs";
}

// ======================
// JOB TABLE
// ======================

function fillTable(data){

    let tbody =
    document.getElementById("jobsTable");

    tbody.innerHTML = "";

    data.forEach(row => {

        tbody.innerHTML += `
        <tr>
            <td>${row["Job Title"]}</td>
            <td>${row.Company}</td>
            <td>${row.Skill}</td>
            <td>${row.Experience}</td>
            <td>${row["Job Type"]}</td>
        </tr>
        `;

    });
}

// ======================
// TOP 10 JOB ROLES
// ======================

function showTop10Jobs(){

    let jobCount = {};

    csvData.forEach(row => {

        let job = row["Job Title"];

        jobCount[job] =
        (jobCount[job] || 0) + 1;

    });

    let topJobs =
    Object.entries(jobCount)
    .sort((a,b) => b[1] - a[1])
    .slice(0,10);

    let topRows = [];

    topJobs.forEach(item => {

        let row = csvData.find(
            r => r["Job Title"] === item[0]
        );

        if(row){
            topRows.push(row);
        }
    });

    fillTable(topRows);
}
// ======================
// CHARTS
// ======================

function createCharts(data){

    if(barChart) barChart.destroy();
    if(pieChart) pieChart.destroy();
    if(companyChart) companyChart.destroy();
    if(expChart) expChart.destroy();
    if(trendChart) trendChart.destroy();
    if(jobTypeChart) jobTypeChart.destroy();

    // ======================
    // TOP 10 SKILLS
    // ======================

    let skillCount = {};

    data.forEach(row => {

        skillCount[row.Skill] =
        (skillCount[row.Skill] || 0) + 1;

    });

    let topSkills =
    Object.entries(skillCount)
    .sort((a,b) => b[1] - a[1])
    .slice(0,10);

    let skillLabels =
    topSkills.map(item => item[0]);

    let skillValues =
    topSkills.map(item => item[1]);

    // ======================
    // BAR CHART
    // ======================

    barChart = new Chart(
        document.getElementById("barChart"),
        {
            type: "bar",
            data: {
                labels: skillLabels,
                datasets: [{
                    label: "Jobs",
                    data: skillValues
                }]
            }
        }
    );

    // ======================
    // PIE CHART
    // ======================

    pieChart = new Chart(
        document.getElementById("pieChart"),
        {
            type: "doughnut",
            data: {
                labels: skillLabels,
                datasets: [{
                    data: skillValues
                }]
            }
        }
    );

    // ======================
    // TOP 10 COMPANIES
    // ======================

    let companyCount = {};

    data.forEach(row => {

        companyCount[row.Company] =
        (companyCount[row.Company] || 0) + 1;

    });

    let topCompanies =
    Object.entries(companyCount)
    .sort((a,b) => b[1] - a[1])
    .slice(0,10);

    let companyLabels =
    topCompanies.map(item => item[0]);

    let companyValues =
    topCompanies.map(item => item[1]);

    companyChart = new Chart(
        document.getElementById("companyChart"),
        {
            type: "bar",
            data: {
                labels: companyLabels,
                datasets: [{
                    label: "Hiring",
                    data: companyValues
                }]
            }
        }
    );
        // ======================
    // EXPERIENCE CHART
    // ======================

    let expCount = {};

    data.forEach(row => {

        expCount[row.Experience] =
        (expCount[row.Experience] || 0) + 1;

    });

    expChart = new Chart(
        document.getElementById("expChart"),
        {
            type:"pie",
            data:{
                labels:Object.keys(expCount),
                datasets:[{
                    data:Object.values(expCount)
                }]
            }
        }
    );

    // ======================
    // JOB TYPE CHART
    // ======================

    let jobTypeCount = {};

    data.forEach(row => {

        jobTypeCount[row["Job Type"]] =
        (jobTypeCount[row["Job Type"]] || 0) + 1;

    });

    jobTypeChart = new Chart(
        document.getElementById("jobTypeChart"),
        {
            type:"polarArea",
            data:{
                labels:Object.keys(jobTypeCount),
                datasets:[{
                    data:Object.values(jobTypeCount)
                }]
            }
        }
    );

    // ======================
    // TREND CHART
    // ======================

    trendChart = new Chart(
        document.getElementById("trendChart"),
        {
            type:"line",
            data:{
                labels:[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun"
                ],
                datasets:[{
                    label:"Job Trend",
                    data:[
                        120,
                        150,
                        180,
                        220,
                        260,
                        320
                    ]
                }]
            }
        }
    );
}

// ======================
// NAVIGATION FUNCTIONS
// ======================

function showOverview(){

    document.getElementById("aboutSection")
    .style.display = "none";

    updateCards(csvData);

    showTop10Jobs();

    createCharts(csvData);

    document.getElementById("result")
    .innerHTML =
    "📊 Showing Top 10 Job Roles";
}

function showSkills(){

    let skillData =
    csvData.map(row => ({
        "Job Title":"-",
        Company:"-",
        Skill:row.Skill,
        Experience:"-",
        "Job Type":"-"
    }));

    fillTable(skillData);

    document.getElementById("result")
    .innerHTML =
    "📊 Skills View";
}

function showJobs(){

    document.getElementById("aboutSection")
    .style.display = "none";

    showTop10Jobs();

    document.getElementById("result")
    .innerHTML =
    "📋 Top 10 Job Roles";
}

function showAbout(){

    document.getElementById("aboutSection")
    .style.display = "block";

    document.getElementById("result")
    .innerHTML =
    "ℹ️ About Dashboard";
}

// ======================
// DASHBOARD FEATURES
// ======================

function showSkillAnalysis(){

    document.getElementById("barChart")
    .scrollIntoView({
        behavior:"smooth"
    });

    document.getElementById("result")
    .innerHTML =
    "📊 Skill Analysis Opened";
}

function showCompanyHiring(){

    document.getElementById("companyChart")
    .scrollIntoView({
        behavior:"smooth"
    });

    document.getElementById("result")
    .innerHTML =
    "🏢 Company Hiring Opened";
}

function showJobTrends(){

    document.getElementById("trendChart")
    .scrollIntoView({
        behavior:"smooth"
    });

    document.getElementById("result")
    .innerHTML =
    "📈 Job Trends Opened";
}

function showSkillSearch(){

    document.getElementById("searchSkill")
    .focus();

    document.getElementById("result")
    .innerHTML =
    "🔍 Enter a Skill";
}

function showJobListings(){

    document.querySelector(".table-box")
    .scrollIntoView({
        behavior:"smooth"
    });

    document.getElementById("result")
    .innerHTML =
    "📋 Job Listings Opened";
}