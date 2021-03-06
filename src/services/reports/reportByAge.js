const moment = require('moment');
const returnEmployeesIfExists = require('./validateEmployeesExists');

const buildReport = (employees) => {
  const report = {};
  const ages = employees.map((employee) => moment(moment(employee.birth_date, 'DD-MM-YYYY').format('YYYY-MM-DD')));
  const older = moment.min(ages);
  const younger = moment.max(ages);

  employees.forEach((employee) => {
    if (employee.birth_date === moment(younger).format('DD-MM-YYYY')) {
      report.younger = employee;
    }

    if (employee.birth_date === moment(older).format('DD-MM-YYYY')) {
      report.older = employee;
    }
  });

  return report;
};

module.exports = async () => {
  const employees = await returnEmployeesIfExists();

  const report = buildReport(employees);
  return report;
};
