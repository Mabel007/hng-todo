export type Filter = 'all' | 'active' | 'completed'

export type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

export type Note = {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}
