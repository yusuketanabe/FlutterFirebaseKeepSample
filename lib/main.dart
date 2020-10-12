import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_firebase_keep/screen/login_screen.dart';
import 'package:provider/provider.dart';

import 'model/user.dart';

void main() => runApp(Keep());

class Keep extends StatelessWidget {
  @override
  // StreamProvider<TYPE>.value(): ストリームの型 "<TYPE>"
  // streamを使って値を取得できるprovider
  Widget build(BuildContext context) => StreamProvider.value(
        // initialData: 初期値を生成するための値を設定。設定しない場合はnullで生成される
        // ストリームが値を出すまで使用する "initialData"
        initialData: CurrentUser.initial,

        // Stream map() method: 要素を変換する中間操作。map の引数には T -> U となるラムダ式を渡してあげる。
        // onAuthStateChanged: ユーザがサインインまたはサインアウトするたびに、[FirebaseUser]を受信します。
        // ここの説明 -> ユーザーがサインインまたはサインアウトするたびにFirebaseUserを受け取り、
        // FirebaseUserをuserと定義して、map()に渡し、map()によってCurrentUser.create(user)に
        // 変換して、オブザーバー（監視者）に登録し、下位のwidgetで使えるvalueとする
        // リッスンするストリームである "value"
        value: FirebaseAuth.instance.onAuthStateChanged
            .map((user) => CurrentUser.create(user)),
        // childには、ストリームが変化したときに更新したいウィジェットを実装する
        child: Consumer<CurrentUser>(
          builder: (context, user, _) => MaterialApp(
            title: 'Keep',
            home: user.isInitialValue
                // ここはvalueを取得するまでの待ち時間。isInitialValueがtrue -> falseにかわる
                ? Scaffold(body: const Text('Loading...'))
                : user.data != null ? HomeScreen() : LoginScreen(),
          ),
        ),
      );
}
