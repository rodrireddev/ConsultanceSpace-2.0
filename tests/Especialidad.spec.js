const { Especialidad, conn } = require('../src/db.js');



describe('Especialidad model', () => {
        before(() => conn.authenticate()
        .catch((err) => {
            console.error('Unable to connect to the database:', err);
        }));
        describe('Validators', () => {
        beforeEach(() => Especialidad.sync({ force: true }));
        describe('name', () => {
            it('should throw an error if id is null', (done) => {
            Especialidad.create({})
                .then(() => done(new Error('It requires a valid id')))
                .catch(() => done());
            });
            it('should throw an error if name is null', (done) => {
                Especialidad.create({ nombre: 'Cardiologia' })
                .then(() => done(new Error('It requires a valid name')))
                .catch(() => done());
            });

        });
        });
    });