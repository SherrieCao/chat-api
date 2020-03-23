/*
 * Import Environment variables
 */

require('dotenv').config();

/*
 * Set Globals
 */

global.chai = require('chai');
global.chaiHttp = require('chai-http');
global.server = `http://localhost:${process.env.PORT}`;

global.testUserOne = { phone: 5555555555 };
global.testUserTwo = { phone: 6666666666 };
global.testUserThree = { phone: 8888888888 };

/*
 * Configure Chai
 */

chai.should();
chai.use(chaiHttp);

/*
 * Setup Test Environment
 */

const waitPort = require('wait-port');
const Sequelize = require('sequelize');
const {
  MYSQL_DATABASE,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_WRITE_HOST,
  MYSQL_PORT,
} = process.env;

before(done => {
  (async () => {
    const database = new Sequelize(MYSQL_DATABASE, MYSQL_USERNAME, MYSQL_PASSWORD, {
      dialect: 'mysql',
      host: MYSQL_WRITE_HOST,
      port: MYSQL_PORT,
    });

    fatLog('Waiting for API Server...');
    await waitPort({
      host: 'localhost',
      port: parseInt(process.env.PORT),
    });

    fatLog('Testing DB Connection...');
    await database.authenticate();

    fatLog('Truncating DB...');
    await database.transaction(transaction => {
      return database.query('SET FOREIGN_KEY_CHECKS = 0', { transaction }).then(() => {
        return database.query(
          `SELECT Concat('TRUNCATE TABLE ',table_schema,'.',TABLE_NAME, ';')
          FROM INFORMATION_SCHEMA.TABLES
          WHERE table_schema in ('${MYSQL_DATABASE}');`,
          { transaction },
        );
      }).then(results => {
        let truncatePromises = [];

        results[0].forEach(result => {
          Object.keys(result).forEach(key => {
            truncatePromises.push(database.query(result[key], { transaction }));
          });
        });

        return Promise.all(truncatePromises);
      });
    });

    fatLog('Creating global test user one...');
    await chai.request(server).post('/users').send(testUserOne);
    const createdTestUserOneResponse = await chai.request(server).post('/users').send(Object.assign({}, testUserOne, { phoneLoginCode: '000000' }));
    Object.assign(testUserOne, createdTestUserOneResponse.body);

    fatLog('Creating global test user two...');
    await chai.request(server).post('/users').send(testUserTwo);
    const createdTestUserTwoResponse = await chai.request(server).post('/users').send(Object.assign({}, testUserTwo, { phoneLoginCode: '000000' }));
    Object.assign(testUserTwo, createdTestUserTwoResponse.body);

    fatLog('Creating global test user three...');
    await chai.request(server).post('/users').send(testUserThree);
    const createdTestUserThreeResponse = await chai.request(server).post('/users').send(Object.assign({}, testUserThree, { phoneLoginCode: '000000' }));
    Object.assign(testUserThree, createdTestUserThreeResponse.body);

    done();
  })();
});

/*
 * Helpers
 */

function fatLog(message) {
  let divider = Array(message.length + 1).join('=');

  console.log('\n');
  console.log(divider);
  console.log(message);
  console.log(divider);
  console.log('\n');
}
