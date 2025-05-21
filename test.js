const models = require('./models');
const Persona = models.Persona;
const sequelize = models.sequelize;

async function test() {
  try {
    /*
    console.log('\n=== CREATE TEST ===');
    const newpersona = await Persona.create({
      nombre: 'Federico Paez',
      email: 'FedePaez@example.com'
    });
    console.log('New Persona created:', newpersona.toJSON());

    // READ - Find all Personas
    console.log('\n=== READ TEST (All) ===');
    const allpersonas = await Persona.findAll();
    console.log('All Personas:', JSON.stringify(allpersonas, null, 2));

    // READ - Find one Persona by ID
    console.log('\n=== READ TEST (Single) ===');
    const foundpersona = await Persona.findByPk(newpersona.id);
    console.log('Found Persona:', foundpersona.toJSON());

    // UPDATE - Modify a Persona
    //console.log('\n=== UPDATE TEST ===');
    //const updatedpersona = await foundpersona.update({
    //  nombre: 'Juan Carlos Pérez',
    //  email: 'juan.carlos@example.com'
    //});
    //console.log('Updated Persona:', updatedpersona.toJSON());

    // Create Estudante with valid values
    const estudante = await models.Estudante.create({
      Matricula: 2211,
      Nombre: 'Federico Paez',
      Email: 'FedePaez@example.com',
      personaid: newpersona.id
    });
    console.log('New Estudante created:', estudante.toJSON());
    */
    // === CREATE DOCENTE ===
    console.log('\n=== CREATE DOCENTE TEST ===');

    // Crear categoría si no existe
    const categoria = await models.CategoriaEmpleado.create({
      clave: 1234,
      nombre: 'Mate'
    });

    const docente = await models.Docente.create({
      numEmpleado: 5612,
      nombre: 'Parker Sotel',
      email: 'Parker@example.com',
      categoriaEmpleadoId: categoria.id  // FK
    });

    console.log('New Docente created:', docente.toJSON());
    // DELETE - Remove a Persona
    /*
    console.log('\n=== DELETE TEST ===');
    await updatedPersona.destroy();
    console.log('Persona deleted');
    */

    // Verify deletion
    const deletedpersona = await Persona.findByPk(newpersona.id);
    console.log('Verify deletion:', deletedpersona ? 'Still exists' : 'Not found (correct)');

  } catch (error) {
    console.error('Error during CRUD tests:', error);
  } finally {
    // Close connection
    await sequelize.close();
    console.log('\nConnection closed');
  }
}

test();