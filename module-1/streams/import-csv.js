import { parse } from 'csv-parse/sync';
import fs from 'node:fs/promises'

const path = new URL('tasks.csv', import.meta.url)

export async function importTasks() {
  const csv = await fs.readFile(path)
  const records = await parse(csv, {
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2
  })

  for await (let record of records) {
    const [title, description] = record

    fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description
      })
    })

    await wait(1000)
  }
}

await importTasks()

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}