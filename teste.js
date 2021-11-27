const date = require("date-and-time")
const now = new Date();
let dataAdmissao = date.format(now, "DD/MM/YYYY")
console.log("data de hoje: " + dataAdmissao)