## Firebase, Firestoreを用いたアプリ開発設計について

1. 必要なもの -> Node.js, npm, Typescript, Jest
2. @firebase/testing, @types/jest, @types/uuid, firebase-admin, fs, jest, ts-jest, ts-node, typescriptを
   ”npm i PACKAGES —save-dev”でdevDependenciesに記述するようにインストールする。
   もしくは既存のプロジェクトからpackage.jsonを持ってきて”npm install”すると良い。”cp ..”コマンド使うといいよ。
3. “npx tsc —init”でtsconfig.jsonファイル作成
4. jest.config.jsファイルを作るか(コピペ)package.jsonにJestの構成を書く。
5. firestore.mdにアプリの仕様を書く
6. schema.yamlにモデルをかく
7. testHelper.tsファイル書く(randomID)
8. firestore.rulesをかく
9. rules.test.tsにテストを書く(.tsファイルは全てrootディレクトリにsrcフォルダを作りそこに入れる)
10. “npm t”でテストを実行する