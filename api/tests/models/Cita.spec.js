const { Cita ,conn } = require('../../src/db.js');
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const agent = session(app);




    describe('Cita model', () => {
        before(() => conn.authenticate()
        .catch((err) => {
            console.error('Unable to connect to the database:', err);
        }));
        describe('Validators', () => {

            it('should throw an error if date is null', (done) => {
                Cita.create({})
                .then(() => done(new Error('It requires a valid date')))
                .catch(() => done());
            });
            it('should throw an error if time is null', (done) => {
                Cita.create({ hora: '11.00am' })
                .then(() => done(new Error('It requires a valid description')))
                .catch(() => done());
            });
            it('should throw an error if status is null', (done) => {
                Cita.create({})
                .then(() => done(new Error('It requires a status')))
                .catch(() => done());
            });
        })
    });