import Model from '@ruanmartinelli/knex-model'
import { IUserInsertQuery } from 'interfaces/requests'
import { IDBUser } from 'interfaces/user'

export default class UserModel extends Model {
  constructor(options: any) {
    super(options)
  }

  public getAll(): Promise<IDBUser[]> {
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

  public findById(id: number): Promise<IDBUser> {
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

  public findByName(username: string): Promise<IDBUser> {
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

  public insert(user: IUserInsertQuery): Promise<IDBUser> {
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
