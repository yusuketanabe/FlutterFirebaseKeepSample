// jestの設定
// https://typescript-jp.gitbook.io/deep-dive/intro-1/jest
/*
SyntaxError: ~/Firebase_Firestore/todo/rules.test.ts: Unexpected token, expected ";" (14:5)

      12 | const adminDB = firebase.initializeAdminApp({ projectId: projectID, databaseName })
      13 |
    > 14 | type Auth = {
         |      ^
      15 |     uid?: string;
      16 |     // auther fields are used as request.auth.token in firestore.rules
      17 |     [key: string]: any;

+ このエラーを解決するために行ったこと
1. jest.config.jsファイル作成。中身はコピペ。
2. srcフォルダを作成し、**.tsファイルを全てこちらに移動した。
以上。
+ エラーの理由（推測）
1. JestのテストランナーがTypescriptコードを理解できなかった。
*/

module.exports = {
    "roots": [
      "<rootDir>/src"
    ],
    "testMatch": [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "testEnvironment": "jest-environment-uint8array"
}