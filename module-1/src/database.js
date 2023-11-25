import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8').then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }

  select(table) {
    const data = this.#database[table] ?? []

    return data
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  insert(table, data) {
    console.log(data)
    if(Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, data) {
    const rowIdx = this.#database[table] ? this.#database[table].findIndex(r => r.id === id) : -1

    if(rowIdx > -1) {
      const row = this.#database[table][rowIdx]
      this.#database[table][rowIdx] = { id, ...row, ...data, ...{
        completed_at: row.completed_at ? null : data.completed_at
      } }
      this.#persist()
    }

    return rowIdx === -1 ? null : data
  }

  delete(table, id) {
    const rowIdx = this.#database[table] ? this.#database[table].findIndex(r => r.id === id) : -1
    console.log(rowIdx)


    if(rowIdx > -1) {
      this.#database[table].splice(rowIdx, 1)

      console.log(this.#database[table])

      this.#persist()
    }

    return rowIdx === -1 ? null : id
  }
}