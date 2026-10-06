const { Usuario ,conn } = require('../../src/db.js');
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const agent = session(app);

describe('Usuario', () => {
    before(() => conn.authenticate()
        .catch((err) => {
        console.error('Unable to connect to the database:', err);
        }));
    describe('Entidades', () => {
        beforeEach(() => 
        Usuario.sync({ force: true }));
        describe('email', () => {
            it('Deberia dar un error si el correo es null', (done) => {
                Usuario.create({
                    tipo_usuario:'paciente',
                })
                .then(() => done(new Error('Se requiere un email valido')))
                .catch(() => done());
            });
            it('Deberia dar un error si solo ingresa el email', (done) => {
                Usuario.create({ email: 'soyunmedico@gmail.com' })
                .then(() => done(new Error('Se requiere mas datos')))
                .catch(() => done());
            });
            it('Deberia dar un error si no se ingresa un email valido', (done) => {
                Usuario.create({ email: 'no_soy_uncorreo.a', tipo_usuario: 'paciente' })
                .then((data) =>{
                    console.log("la data es", data);
                    done(new Error('Correo incorrecto'))
                })
                .catch(() => done());
            });
            it('Deberia poder registrarse si se ingresa un email valido', (done) => {
                Usuario.create({ email: 'soy_un_paciente@gmal.com', tipo_usuario: 'paciente' })
                .then((data) =>{
                    expect(data.email).to.equal('soy_un_paciente@gmail.com')
                    expect(data.tipo_usuario).to.equal('paciente')
                })
                .catch(() => done());
            });
        });
        describe('tipo_usuario', () => {
            it('Deberia dar un error si el tipo_usuario es null', (done) => {
                Usuario.create({email: 'soy_un_medico@gmail.com'})
                .then(() => done(new Error('Se requiere un "tipo_usuario" valido')))
                .catch(() => done());
            });
            it('Deberia dar error si solo se envia "tipo_usuario"', (done) => {
                Usuario.create({ tipo_usuario: 'paciente' })
                .then(() => done(new Error('Se requiere mas datos')))
                .catch(() => done());
            });
        });
    });
});