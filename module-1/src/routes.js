import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()
const tasksTableName = 'tasks'

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body
      const updatedCreatedAt = new Date()

      database.insert(tasksTableName, {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: updatedCreatedAt,
        update_at: updatedCreatedAt
      })

      return res.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select(tasksTableName)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { title, description } = req.body

      const result = database.update(tasksTableName, req.params.id, {
        title,
        description,
      })

      return result ? res.writeHead(204).end() : res.writeHead(404).end(JSON.stringify({
        message: 'Task not found!'
      }))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const result = database.delete(tasksTableName, req.params.id)

      return result ? res.writeHead(204).end() : res.writeHead(404).end(JSON.stringify({
        message: 'Task not found!'
      }))
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const result = database.update(tasksTableName, req.params.id, {
        completed_at: new Date()
      })

      return result ? res.writeHead(204).end() : res.writeHead(404).end(JSON.stringify({
        message: 'Task not found!'
      }))
    }
  },
]