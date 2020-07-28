// firestoreルールを使ったテストを実行する

import * as firebase from '@firebase/testing'
import * as fs from 'fs'
import { randomID } from './testHelper'

const projectID = 'test sample'
const databaseName = 'firebase-database-name'
const rules = fs.readFileSync('./firestore.rules', 'utf8')

// firestore client for admin
const adminDB = firebase.initializeAdminApp({ projectId: projectID, databaseName }).firestore()

type Auth = {
    uid?: string,
    // auther fields are used as request.auth.token in firestore.rules
    [key: string]: any
}

// firesore client for client-side user
const clientDB = (auth?: Auth) => firebase.initializeTestApp({ projectId: projectID, databaseName, auth }).firestore()

// setup and clean up

const serverTimestamp = () => firebase.firestore.FieldValue.serverTimestamp()

beforeAll(async () => {
    await firebase.loadFirestoreRules({ projectId: projectID, rules});
})

beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId: projectID });
})

afterAll(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()));
})

// testing with Jest
describe('/users', () => {
    describe('create', () => {
        it('作成できる', async () => {
            const userID = randomID()
            const db = clientDB({ uid: userID })
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).set({
                    name: 'yusuke',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            )
        })

        it('nameがなくても作成できる', async () => {
            const userID = randomID()
            const db = clientDB({ uid: userID })
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).set({
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            )
        })

        it('名前20文字以下', async () => {
            const userID = randomID()
            const db = clientDB({ uid: userID })
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).set({
                    name: 'nameis20thisisOK....',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            )
        })
    })

    describe('get', () => {
        const userID = randomID()
        const db = clientDB({ uid: userID })
        beforeEach(async () => {
            await adminDB.collection('users').doc(userID).set({
                name: 'yusuke',
                userID: userID,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })
        })
        it('取得できる', async () => {
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).get()
            )
        })
    })

    describe('not create', () => {
        const userID = randomID()
        const db = clientDB({ uid: userID })
        beforeEach(async () => {
            await adminDB.collection('users').doc(userID).set({
                name: 'yusuke',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })
        })
    
        it('すでにuserが存在する', async () => {
            await firebase.assertFails(
                db.collection('users').doc(userID).set({
                    name: 'salmon',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            )
        })

        it('名前20文字を超えている', async () => {
            const userID = randomID()
            const db = clientDB({ uid: userID })
            await firebase.assertFails(
                db.collection('users').doc(userID).set({
                    name: 'nameisover21thisiserror',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            )
        })
    })

    describe('update', () => {
        const userID = randomID()
        const db = clientDB({ uid: userID })
        beforeEach(async () => {
            await adminDB.collection('users').doc(userID).set({
                name: 'yusuke',
                userID: userID,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })
        })

        it('userを更新できる', async () => {
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).update({
                    name: 'salmon',
                    userID: userID,
                    updatedAt: serverTimestamp()
                })
            )
        })
    })

    describe('delete', () => {
        const userID = randomID()
        const anotherID = randomID()
        const db = clientDB({ uid: userID })
        beforeEach(async () => {
            await adminDB.collection('users').doc(userID).set({
                name: 'yusuke',
                userID: userID,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })
        })

        it('userを削除できない', async () => {
            await firebase.assertFails(
                db.collection('users').doc(anotherID).delete()
            )
        })

        it('userを削除できる', async () => {
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).delete()
            )
        })
    })
})

describe('/users/did', () => {
    describe('create', () => {
        const userID = randomID()
        const db = clientDB({ uid: userID })
        it('作成できる', async () => {
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).collection('did').doc().set({
                    title: 'ご飯を作った',
                    isCompleted: true,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    completedAt: serverTimestamp()
                })
            )
        })
    })

    describe('not create', () => {
        const userID = randomID()
        const db = clientDB({ uid: userID })
        it('タイトルがない', async () => {
            await firebase.assertFails(
                db.collection('users').doc(userID).collection('did').doc().set({
                    isCompleted: true,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    completedAt: serverTimestamp()
                })
            )
        })

        it('作成した時間がない', async () => {
            await firebase.assertFails(
                db.collection('users').doc(userID).collection('did').doc().set({
                    title: 'ご飯を作った',
                    isCompleted: true,
                    updatedAt: serverTimestamp(),
                    completedAt: serverTimestamp()
                })
            )
        })

        it('完了の値がない', async () => {
            await firebase.assertFails(
                db.collection('users').doc(userID).collection('did').doc().set({
                    title: 'ご飯を作った',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    completedAt: serverTimestamp()
                })
            )
        })

        it('完了されてない', async () => {
            await firebase.assertFails(
                db.collection('users').doc(userID).collection('did').doc().set({
                    title: 'ご飯を作った',
                    isCompleted: false,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    completedAt: serverTimestamp()
                })
            )
        })

        it('完了時間がない', async () => {
            await firebase.assertFails(
                db.collection('users').doc(userID).collection('did').doc().set({
                    title: 'ご飯を作った',
                    isCompleted: true,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            )
        })

        it('完了がnullである', async () => {
            await firebase.assertFails(
                db.collection('users').doc(userID).collection('did').doc().set({
                    title: 'ご飯を作った',
                    isCompleted: null,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    completedAt: serverTimestamp()
                })
            )
        })
    })

    describe('read', () => {
        const userID = randomID()
        const didID = randomID()
        const did2ID = randomID()
        const db = clientDB({ uid: userID })
        beforeEach(async () => {
            await adminDB.collection('users').doc(userID).collection('did').doc(didID).set({
                title: '掃除した',
                userID: userID,
                isCompleted: true,
                completedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })

            await adminDB.collection('users').doc(userID).collection('did').doc(did2ID).set({
                title: '片付けした',
                userID: userID,
                isCompleted: true,
                completedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })
        })

        it('didを取得できる', async () => {
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).collection('did').doc(didID).get()
            )
        })

        it('didコレクションを取得できる', async () => {
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).collection('did').get()
            )
        })
    })
    
    describe('update', () => {
        const userID = randomID()
        const didID = randomID()
        const db = clientDB({ uid: userID })
        beforeEach(async () => {
            await adminDB.collection('users').doc(userID).collection('did').doc(didID).set({
                title: '掃除した',
                userID: userID,
                isCompleted: true,
                completedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })
        })

        it('didを更新できる', async () => {
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).collection('did').doc(didID).update({
                    title: 'お風呂の掃除した',
                    userID: userID,
                    updatedAt: serverTimestamp()
                })
            )
        })
    })

    describe('delete', () => {
        const userID = randomID()
        const didID = randomID()
        const db = clientDB({ uid: userID })
        beforeEach(async () => {
            await adminDB.collection('users').doc(userID).collection('did').doc(didID).set({
                title: '掃除した',
                userID: userID,
                isCompleted: true,
                completedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })
        })

        it('didを削除できる', async () => {
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).collection('did').doc(didID).delete()
            )
        })
    })
})

describe('/users/did/dig', () => {
    describe('create', () => {
        const userID = randomID()
        const db = clientDB({ uid: userID })
        it('作成できる', async () => {
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).collection('did').doc().collection('dig').doc().set({
                    title: '片付けをしよう',
                    isCompleted: false,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            )
        })

        it('完了時間がnullでも作成できる', async ()=> {
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).collection('did').doc().collection('dig').doc().set({
                    title: '片付けをしよう',
                    isCompleted: false,
                    completedAt: null,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            )
        })
    })

    describe('not create', () => {
        const userID = randomID()
        const db = clientDB({ uid: userID })
        it('完了してしまっている', async () => {
            await firebase.assertFails(
                db.collection('users').doc(userID).collection('did').doc().collection('dig').doc().set({
                    title: '片付けをしよう',
                    isCompleted: true,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            )
        })

        it('完了の値がない', async () => {
            await firebase.assertFails(
                db.collection('users').doc(userID).collection('did').doc().collection('dig').doc().set({
                    title: '片付けをしよう',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            )
        })
    })

    describe('read', () => {
        const userID = randomID()
        const didID = randomID()
        const did2ID = randomID()
        const digID = randomID()
        const dig2ID = randomID()
        const db = clientDB({ uid: userID })
        beforeEach(async () => {
            await adminDB.collection('users').doc(userID).collection('did').doc(didID).set({
                title: '掃除した',
                userID: userID,
                isCompleted: true,
                completedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })

            await adminDB.collection('users').doc(userID).collection('did').doc(didID).collection('dig').doc(digID).set({
                title: '掃除用具を片付けよう',
                userID: userID,
                isCompleted: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })

            await adminDB.collection('users').doc(userID).collection('did').doc(did2ID).set({
                title: '片付けした',
                userID: userID,
                isCompleted: true,
                completedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })

            await adminDB.collection('users').doc(userID).collection('did').doc(did2ID).collection('dig').doc(dig2ID).set({
                title: 'きれいになった部屋でゴロゴロしよう',
                userID: userID,
                isCompleted: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })
        })

        it('digを取得できる', async () => {
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).collection('did').doc(did2ID).collection('dig').doc(dig2ID).get()
            )
        })

        it('digコレクションを取得できる', async () => {
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).collection('did').doc(did2ID).collection('dig').get()
            )
        })
    })

    describe('update', () => {
        const userID = randomID()
        const didID = randomID()
        const digID = randomID()
        const db = clientDB({ uid: userID })
        // 事前にデータを作っておく
        beforeEach(async () => {
            await adminDB.collection('users').doc(userID).collection('did').doc(didID).collection('dig').doc(digID).set({
                title: '掃除しよう',
                userID: userID,
                isCompleted: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                completedAt: null
            })
        })

        it('digを更新できる', async () => {
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).collection('did').doc(didID).collection('dig').doc(digID).update({
                    title: 'お風呂の掃除しよう',
                    userID: userID,
                    isCompleted: false,
                    updatedAt: serverTimestamp(),
                    completedAt: null
                })
            )
        })
    })

    describe('delete', () => {
        const userID = randomID()
        const anotherID = randomID()
        const didID = randomID()
        const digID = randomID()
        const db = clientDB({ uid: userID })
        // 事前にデータを作っておく
        beforeEach(async () => {
            await adminDB.collection('users').doc(userID).collection('did').doc(didID).collection('dig').doc(digID).set({
                title: '掃除しよう',
                userID: userID,
                isCompleted: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                completedAt: null
            })
        })

        it('digを削除できない', async () => {
            await firebase.assertFails(
                db.collection('users').doc(anotherID).collection('did').doc(didID).collection('dig').doc(digID).delete()
            )
        })

        it('digを削除できる', async () => {
            await firebase.assertSucceeds(
                db.collection('users').doc(userID).collection('did').doc(didID).collection('dig').doc(digID).delete()
            )
        })
    })
})