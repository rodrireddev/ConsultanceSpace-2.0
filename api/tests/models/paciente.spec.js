const { Profesional ,conn } = require('../../src/db.js');
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const agent = session(app);

describe('Paciente', () => {
    before(() => conn.authenticate()
        .catch((err) => {
        console.error('Unable to connect to the database:', err);
        }));
    describe('Entidades', () => {
        beforeEach(() => 
        Profesional.sync({ force: true }));
        describe('DNI', () => {
            it('Deberia dar un error el DNI es null', (done) => {
                Profesional.create({
                    nombre: "nombre",
                    apellidos: 'apellidos',
                    telefono: 12312424124,
                    direccion: 'calle desconocida 234',
                    fecha_de_nacimiento: '1994-05-23',
                    pais: 'Canada'
                })
                .then(() => done(new Error('Se requiere un DNI valido')))
                .catch(() => done());
            });
            it('Deberia dar un error si solo ingresa el DNI', (done) => {
                Profesional.create({ cedula: 232332234 })
                .then(() => done(new Error('Se requiere mas datos')))
                .catch(() => done());
            });
        });
        describe('nombre', () => {
            it('Deberia dar un error si el nombre es null', (done) => {
                Profesional.create({
                    DNI: 2323423,
                    apellidos: 'apellidos',
                    telefono: 12312424124,
                    direccion: 'calle desconocida 234',
                    fecha_de_nacimiento: '1994-05-23',
                    pais: 'Canada'
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
                    DNI: 2323423,
                    nombre: 'nombre',
                    telefono: 12312424124,
                    direccion: 'calle desconocida 234',
                    fecha_de_nacimiento: '1994-05-23',
                    pais: 'Canada'
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
                    DNI: 2323423,
                    apellidos: 'apellidos',
                    nombre: 'nombre',
                    direccion: 'calle desconocida 234',
                    fecha_de_nacimiento: '1994-05-23',
                    pais: 'Canada'
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
                    DNI: 2323423,
                    nombre: 'nombre',
                    apellidos: 'apellidos',
                    telefono: 12312424124,
                    fecha_de_nacimiento: '1994-05-23',
                    pais: 'Canada'
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
        describe('fecha de nacimiento', () => {
            it('Deberia dar un error si fecha de nacimiento es null', (done) => {
                Profesional.create({
                    DNI: 2323423,
                    nombre: 'nombre',
                    apellidos: 'apellidos',
                    telefono: 12312424124,
                    direccion: 'calle desconocida 123',
                    pais: 'Canada'
                })
                .then(() => done(new Error('Se requiere una "fecha de nacimiento" valida')))
                .catch(() => done());
            });
            it('Deberia dar error si solo se ingresa "fecha de nacimiento"', (done) => {
                Profesional.create({ fecha_de_nacimiento: 'direccion desconocida 123' })
                .then(() => done(new Error('Se requiere mas datos')))
                .catch(() => done());
            });
        });
        describe('pais', () => {
            it('Deberia dar un error si pais es null', (done) => {
                Profesional.create({
                    DNI: 2323423,
                    nombre: 'nombre',
                    apellidos: 'apellidos',
                    direccion: 'calle desconocida',
                    telefono: 12312424124,
                    fecha_de_nacimiento: '1994-05-23',
                })
                .then(() => done(new Error('Se requiere un "pais" valido')))
                .catch(() => done());
            });
            it('Deberia dar error si solo se ingresa "pais"', (done) => {
                Profesional.create({ pais: 'Canada' })
                .then(() => done(new Error('Se requiere mas datos')))
                .catch(() => done());
            });
        });
    });
});