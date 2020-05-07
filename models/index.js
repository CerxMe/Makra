import fs from 'fs'

// initialize all sequelize models
// they should be automatically added to sequelize.models
export default async function (sequelize) {
  try {
    // get files
    const modelFiles = fs.readdirSync('./models')
      .filter(file => file !== 'index.js') // Exclude this file

    const toAssociate = []
    for (const file of modelFiles) {
      const { init, associate } = await import(`./${file}`)

      // init model
      const model = await init(sequelize)
      console.log(`Loaded data model '${model.name}' from file '${file}'`)
      // associate later (so i can reference any model without worrying about order)
      if (associate) {
        toAssociate.push({ associate, model })
      }
    }

    // Associate models after all of them have been initialized
    for (const associations of toAssociate) {
      await associations.associate(sequelize)
      console.log(`Loaded data associations for '${associations.model.name}'`)
    }
  } catch (e) {
    console.log(e)
  }
}
