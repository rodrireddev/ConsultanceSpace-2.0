const { Profesional ,conn } = require('../../src/db.js');
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const agent = session(app);

describe('Profesional', () => {
    before(() => conn.authenticate()
        .catch((err) => {
        console.error('Unable to connect to the database:', err);
        }));
    describe('Entidades', () => {
        beforeEach(() => 
        Profesional.sync({ force: true }));
        describe('cedula', () => {
            it('Deberia dar un error si la cedula es null', (done) => {
                Profesional.create({
                    nombre: "nombre",
                    apellidos: 'apellidos',
                    telefono: 12312424124,
                    direccion: 'calle desconocida 234'
                })
                .then(() => done(new Error('Se requiere una cedula valida')))
                .catch(() => done());
            });
            it('Deberia dar un error si solo ingresa la cedula', (done) => {
                Profesional.create({ cedula: 232332234 })
                .then(() => done(new Error('Se requiere mas datos')))
                .catch(() => done());
            });
        });
        describe('nombre', () => {
            it('Deberia dar un error si el nombre es null', (done) => {
                Profesional.create({
                    cedula: 13232323,
                    apellidos: 'apellidos',
                    telefono: 12312424124,
                    direccion: 'calle desconocida 234'
                })
                .then(() => done(new Error('Se requiere un "nombre" valido')))
                .catch(() => done());
            });
            it('Deberia dar error si solo se ingresa "nombre"', (done) => {
                Profesional.create({ nombre: 'nombre' })
                .then(() => done(new Error('Se requiere mas datos')))
                .catch(() => done());
            });
        });
        describe('apellidos', () => {
            it('Deberia dar un error si apellidos es null', (done) => {
                Profesional.create({
                    nombre: 'nombre',
                    cedula: 13232323,
                    telefono: 12312424124,
                    direccion: 'calle desconocida 234'
                })
                .then(() => done(new Error('Se requiere "apellidos" valido')))
                .catch(() => done());
            });
            it('Deberia dar error si solo se ingresa "apellidos"', (done) => {
                Profesional.create({ apellidos: 'apellidos' })
                .then(() => done(new Error('Se requiere mas datos')))
                .catch(() => done());
            });
        });
        describe('telefono', () => {
            it('Deberia dar un error si telefono es null', (done) => {
                Profesional.create({
                    cedula: 1212123,
                    nombre: 'nombre',
                    cedula: 13232323,
                    direccion: 'calle desconocida 234'
                })
                .then(() => done(new Error('Se requiere un "telefono" valido')))
                .catch(() => done());
            });
            it('Deberia dar error si solo se ingresa "telefono"', (done) => {
                Profesional.create({ telefono: 12122332 })
                .then(() => done(new Error('Se requiere mas datos')))
                .catch(() => done());
            });
        });
        describe('direccion', () => {
            it('Deberia dar un error si direccion es null', (done) => {
                Profesional.create({
                    cedula: 1122354,
                    nombre: 'nombre',
                    cedula: 13232323,
                    telefono: 12312424124,
                })
                .then(() => done(new Error('Se requiere una "direccion" valida')))
                .catch(() => done());
            });
            it('Deberia dar error si solo se ingresa "apellidos"', (done) => {
                Profesional.create({ direccion: 'direccion desconocida 123' })
                .then(() => done(new Error('Se requiere mas datos')))
                .catch(() => done());
            });
        });
    });
});