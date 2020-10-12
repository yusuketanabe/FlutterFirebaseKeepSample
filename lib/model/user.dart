import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';

// このクラスのフィールドが不変であることを示す。finalでないフィールドが宣言されていると警告が出る
@immutable
class CurrentUser {
  // 初期値であるか判定。何らかの理由でfirebaseのインスタンスが作成されなかったらtrueのまま
  // trueの場合は_userはnullとして初期値のインスタンスinitialを作っている。
  final bool isInitialValue;

  // ログインしているユーザーを受け取る不変な定数
  // 外から参照するので'_'つけず
  final FirebaseUser data;

  // CurrentUser._(...): named private constructor.ライブラリの外部からインスタンスを生成できない
  const CurrentUser._(this.data, this.isInitialValue);

  // factory constructor: 外でインスタンスを作れないので、中でインスタンスを作って返す必要がある
  // CurrentUser.createコンストラクタ。createの部分はなんでも変更可能
  // CurrentUser.create(FirebaseUser _user)コンストラクタをコード中で呼び出すことで、
  // CurrentUser._(_user, false)インスタンスを返すようにしてある。
  factory CurrentUser.create(FirebaseUser _user) => CurrentUser._(_user, false);
  /*
  factory CurrentUser.create(FirebaseUser _user) {
    return CurrentUser._(_user, false);
  }
  と同義
  */

  // static: クラス内でしか定義できない。クラス変数。インスタンス生成せずに利用可能
  // ここがインスタンス
  static const initial = CurrentUser._(null, true);
}
