// Autenticación, autorización y validaciones. No usan la base de datos real.
const request = require("supertest");
const { expect } = require("chai");
const { install, restore, stub, bearer, db } = require("../helpers/setup");
const app = require("../../src/app");

describe("Autenticación", () => {
  beforeEach(install);
  afterEach(restore);

  it("rechaza rutas protegidas sin token (401)", async () => {
    for (const [method, url] of [
      ["post", "/login"],
      ["post", "/newUser"],
      ["get", "/stock"],
      ["post", "/cita"],
      ["get", "/medicalRecord?idPaciente=1"],
      ["get", "/patients"],
      ["post", "/addSub"],
    ]) {
      const res = await request(app)[method](url).send({});
      expect(res.status, `${method} ${url}`).to.equal(401);
    }
  });

  it("rechaza un token inválido (401)", async () => {
    const res = await request(app).get("/stock").set(bearer("falso"));
    expect(res.status).to.equal(401);
  });

  it("exige email verificado en rutas de datos (403)", async () => {
    const res = await request(app).get("/stock").set(bearer("unverified-token"));
    expect(res.status).to.equal(403);
  });

  it("rechaza usuarios autenticados que no están registrados (403)", async () => {
    const res = await request(app).get("/stock").set(bearer("ghost-token"));
    expect(res.status).to.equal(403);
  });

  it("deja pasar rutas públicas sin token", async () => {
    expect((await request(app).get("/specialities")).status).to.equal(404);
  });

  it("POST /login solo permite consultar la propia cuenta", async () => {
    const res = await request(app)
      .post("/login")
      .set(bearer("pac-token"))
      .send({ email: "prof@test.com" });
    expect(res.status).to.equal(403);
  });

  it("POST /info solo permite consultar la propia cuenta", async () => {
    const res = await request(app)
      .post("/info")
      .set(bearer("pac-token"))
      .send({ email: "prof@test.com", tipo_usuario: "profesional" });
    expect(res.status).to.equal(403);
  });
});

describe("Autorización por rol y pertenencia", () => {
  beforeEach(install);
  afterEach(restore);

  it("un paciente no accede a rutas de profesional", async () => {
    for (const [method, url] of [
      ["get", "/stock"],
      ["get", "/patients"],
      ["get", "/my-patients"],
      ["post", "/add-patients"],
      ["post", "/addSub"],
      ["post", "/checkout"],
      ["post", "/profesionalpayments"],
      ["post", "/profesionaltoken"],
    ]) {
      const res = await request(app)[method](url).set(bearer("pac-token")).send({});
      expect(res.status, `${method} ${url}`).to.equal(403);
    }
  });

  it("un profesional no accede a /relation (solo pacientes)", async () => {
    const res = await request(app).get("/relation?pacienteId=1").set(bearer("prof-token"));
    expect(res.status).to.equal(403);
  });

  it("no se pueden ver las citas de otro profesional", async () => {
    const res = await request(app)
      .post("/cita")
      .set(bearer("prof-token"))
      .send({ get: true, profesionalId: 20 });
    expect(res.status).to.equal(403);
  });

  it("no se pueden ver las citas de otro paciente", async () => {
    const res = await request(app)
      .post("/cita")
      .set(bearer("pac-token"))
      .send({ get: true, pacienteId: 2 });
    expect(res.status).to.equal(403);
  });

  it("no se pueden crear citas a nombre de otros", async () => {
    const res = await request(app)
      .post("/cita")
      .set(bearer("pac-token"))
      .send({ date: "2030-01-01 10:00", profesionalId: 10, pacienteId: 2 });
    expect(res.status).to.equal(403);
  });

  it("no se puede borrar una cita ajena", async () => {
    stub(db.Cita, "findByPk", async () => ({ id: 5, profesionalId: 20, pacienteId: 2 }));
    const res = await request(app).delete("/cita").set(bearer("prof-token")).send({ id: 5 });
    expect(res.status).to.equal(403);
  });

  it("el participante sí puede borrar su cita", async () => {
    let destroyed = false;
    stub(db.Cita, "findByPk", async () => ({
      id: 5,
      profesionalId: 10,
      pacienteId: 2,
      destroy: async () => {
        destroyed = true;
      },
    }));
    const res = await request(app).delete("/cita").set(bearer("prof-token")).send({ id: 5 });
    expect(res.status).to.equal(200);
    expect(destroyed).to.equal(true);
  });

  describe("historia clínica", () => {
    const paciente = { id: 1, antecedentesPatologicoId: 1, antecedentesNoPatologicoId: 1 };
    beforeEach(() => {
      stub(db.Paciente, "findByPk", async () => paciente);
    });

    it("la lee el propio paciente", async () => {
      const res = await request(app).get("/medicalRecord?idPaciente=1").set(bearer("pac-token"));
      expect(res.status).to.equal(200);
    });

    it("no la lee otro paciente", async () => {
      const res = await request(app).get("/medicalRecord?idPaciente=1").set(bearer("pac2-token"));
      expect(res.status).to.equal(403);
    });

    it("no la lee un profesional sin vínculo con el paciente", async () => {
      stub(db.ProfesionalPaciente, "findOne", async () => null);
      stub(db.Cita, "findOne", async () => null);
      const res = await request(app).get("/medicalRecord?idPaciente=1").set(bearer("prof-token"));
      expect(res.status).to.equal(403);
    });

    it("la lee un profesional con vínculo", async () => {
      stub(db.ProfesionalPaciente, "findOne", async () => ({}));
      const res = await request(app).get("/medicalRecord?idPaciente=1").set(bearer("prof-token"));
      expect(res.status).to.equal(200);
    });

    it("un paciente no puede modificar su historia clínica", async () => {
      const res = await request(app)
        .put("/medicalRecord")
        .set(bearer("pac-token"))
        .send({ idPaciente: 1, antecedentesPatologicos: true, diabetes: false });
      expect(res.status).to.equal(403);
    });

    it("un profesional sin vínculo no puede modificarla", async () => {
      stub(db.ProfesionalPaciente, "findOne", async () => null);
      stub(db.Cita, "findOne", async () => null);
      const res = await request(app)
        .put("/medicalRecord")
        .set(bearer("prof-token"))
        .send({ idPaciente: 1, antecedentesPatologicos: true, diabetes: false });
      expect(res.status).to.equal(403);
    });
  });

  it("no se puede escribir a usuarios no registrados (sin relay de mails)", async () => {
    stub(db.Usuario, "findOne", async (opts) =>
      String(opts.where.logic).toLowerCase() === "pac@test.com"
        ? { email: "pac@test.com", tipo_usuario: "paciente" }
        : String(opts.where.logic).toLowerCase() === "prof@test.com"
        ? { email: "prof@test.com", tipo_usuario: "profesional" }
        : null
    );
    const res = await request(app)
      .post("/contactEmail")
      .set(bearer("pac-token"))
      .send({ emailProfesional: "victima@externo.com", subject: "x", text: "y", isPatient: true });
    expect(res.status).to.equal(404);
  });
});

describe("Validaciones", () => {
  beforeEach(install);
  afterEach(restore);

  it("POST /newUser rechaza un tipo de usuario inválido", async () => {
    const res = await request(app)
      .post("/newUser")
      .set(bearer("unverified-token"))
      .send({ type: "otro" });
    expect(res.status).to.equal(400);
  });

  it("POST /newUser informa los campos faltantes", async () => {
    const res = await request(app)
      .post("/newUser")
      .set(bearer("unverified-token"))
      .send({ type: "paciente" });
    expect(res.status).to.equal(400);
    expect(res.text).to.include("dni");
  });

  it("POST /login sin email responde 404", async () => {
    const res = await request(app).post("/login").set(bearer("pac-token")).send({});
    expect(res.status).to.equal(404);
  });

  it("GET /horarios rechaza un día inválido", async () => {
    const res = await request(app).get("/horarios?day=foo").set(bearer("pac-token"));
    expect(res.status).to.equal(400);
  });

  it("GET /profesional exige fullName o email", async () => {
    const res = await request(app).get("/profesional").set(bearer("pac-token"));
    expect(res.status).to.equal(400);
  });

  it("PUT /medicalRecord exige el tipo de antecedente", async () => {
    const res = await request(app).put("/medicalRecord").set(bearer("prof-token")).send({});
    expect(res.status).to.equal(400);
  });

  it("POST /sendEmail exige paciente o profesional", async () => {
    const res = await request(app).post("/sendEmail").set(bearer("pac-token")).send({});
    expect(res.status).to.equal(400);
  });

  it("DELETE /del-mypatients exige un array", async () => {
    const res = await request(app).delete("/del-mypatients").set(bearer("prof-token")).send({});
    expect(res.status).to.equal(400);
  });
});

describe("GET info del profesional", () => {
  beforeEach(install);
  afterEach(restore);

  const info = (token) => {
    stub(db.Profesional, "findOne", async (opts) =>
      opts.where.usuarioEmail === "prof@test.com"
        ? db.Profesional.build({ id: 10, nombre: "A", apellidos: "B" })
        : null
    );
    stub(db.Profesional, "unscoped", () => ({ findByPk: async () => ({ token }) }));
    return request(app)
      .post("/info")
      .set(bearer("prof-token"))
      .send({ email: "prof@test.com", tipo_usuario: "profesional" });
  };

  it("informa mpLinked=true sin exponer el token", async () => {
    const res = await info("APP_USR-secreto");
    expect(res.status).to.equal(200);
    expect(res.body.mpLinked).to.equal(true);
    expect(res.text).to.not.include("secreto");
  });

  it("informa mpLinked=false si no vinculó Mercado Pago", async () => {
    const res = await info(null);
    expect(res.body.mpLinked).to.equal(false);
  });
});

describe("Token de Mercado Pago del profesional", () => {
  it("no se serializa nunca", () => {
    const prof = db.Profesional.build({ nombre: "A", apellidos: "B", token: "APP_USR-secreto" });
    expect(JSON.stringify(prof)).to.not.include("secreto");
    expect(prof.toJSON()).to.not.have.property("token");
  });
});
