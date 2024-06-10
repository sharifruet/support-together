const { processAssignments } = require("./assignmentService");

const run = () => {
    console.log("Scheduler started at: " + Date.now());
    processAssignments();
}

module.exports = { run };