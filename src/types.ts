export type Filter = 'all' | 'active' | 'completed'

export type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: number
}
