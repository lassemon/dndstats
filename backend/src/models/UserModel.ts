import { User, UserInsertQuery } from '@dmtool/domain/src/entities/User'
import Model from '@ruanmartinelli/knex-model'

export default class UserModel extends Model {
  constructor(options: any) {
    super(options)
  }

  public getAll(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.knex('users')
        .select('*')
        .whereNot('active', false)
        .then((result: any) => {
          resolve(result)
        })
        .catch((error: any) => {
          reject(error)
        })
    })
  }

  public findById(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
      this.knex('users')
        .select('*')
        .where('id', id)
        .whereNot('active', false)
        .first()
        .then((result: any) => {
          resolve(result)
        })
        .catch((error: any) => {
          reject(error)
        })
    })
  }

  public findByName(username: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.knex('users')
        .select('*')
        .where('name', username)
        .whereNot('active', false)
        .first()
        .then((result: any) => {
          resolve(result)
        })
        .catch((error: any) => {
          reject(error)
        })
    })
  }

  public insert(user: UserInsertQuery): Promise<User> {
    return this.knex('users').insert(user, '*').first()
  }

  public remove(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.knex('users')
        .where('id', id)
        .update({ active: false })
        .then(() => {
          resolve(true)
        })
        .catch((error: any) => {
          reject(error)
        })
    })
  }
}
