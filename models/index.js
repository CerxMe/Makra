import fs from 'fs'
import { Collection } from 'discord.js'

// initialize all sequelize models and return them
export default async function (client, sequelize) {
  try {
    // get files
    const modelFiles = fs.readdirSync('./models')
      .filter(file => file !== 'index.js') // Exclude this file

    const toAssociate = []
    const models = new Collection()
    for (const file of modelFiles) {
      const { init, associate } = await import(`./${file}`)

      // init model
      const model = await init(sequelize)

      models.set(model.name, model)
      console.log(`Loaded data model '${model.name}' from file '${file}'`)
      // associate later (so i can reference any model without worrying about order)
      if (associate) {
        toAssociate.push({ associate, model })
      }
    }

    // Associate models after all of them have been initialized
    for (const associations of toAssociate) {
      await associations.associate(models, sequelize)
      console.log(`Loaded data associations for '${associations.model.name}'`)
    }
    return models
  } catch (e) {
    console.log(e)
  }
}
