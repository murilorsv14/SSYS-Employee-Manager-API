const chai = require('chai');
const chaiHttp = require('chai-http');
const { Employee } = require('../src/database/models');

chai.use(chaiHttp);

const server = require('../src/server/app');
const { it, before } = require('mocha');

const { expect } = chai;

const employee = {
  name: 'Anakin Skywalker',
  department: 'Architecture',
  email: 'skywalker@ssys.com.br',
  password: 'beStrong',
  salary: '4000.00',
  birth_date: '01-01-1983',
};

describe('POST /employees', () => {
  let response;

  before(async () => {
    Employee.destroy({ where: {} });
    response = await chai.request(server).post('/employees').set('content-type', 'application/json').send(employee);
  });

  after(() => {
    Employee.destroy({ where: {} });
  });

  it('Quando é criado com sucesso', async () => {
    expect(response).to.have.status(201);

    expect(response.body).to.be.a('object');

    expect(response.body).to.have.property('employee');
    const SUT = response.body.employee;
    const arrayOfKeys = Object.keys(SUT);
    arrayOfKeys.forEach((key) => {
      if (key === 'id') return expect(SUT[key]).to.be.not.equal('');
      expect(SUT[key]).to.be.equal(employee[key]);
    });
  });

  it('Quando já existe o usuário cadastrado', async () => {
    response = await chai.request(server).post('/employees').set('content-type', 'application/json').send(employee);

    expect(response).to.have.status(409);
    expect(response.body).to.be.a('object');
    expect(response.body).to.be.deep.equal({ message: 'Employee already registered' });
  });

  it('Quando é criado sem sucesso', async () => {
    response = await chai
      .request(server)
      .post('/employees')
      .set('content-type', 'application/json')
      .send({ ...employee, password: '1' });

    expect(response).to.have.status(400);
    expect(response.body).to.be.a('object');
    expect(response.body).to.be.deep.equal({
      message: '"password" length must be at least 6 characters long',
    });
  });
});
