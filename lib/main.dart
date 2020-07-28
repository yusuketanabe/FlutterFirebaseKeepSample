import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_firebase_keep/screen/login_screen.dart';
import 'package:provider/provider.dart';

import 'model/user.dart';

void main() => runApp(Keep());

class Keep extends StatelessWidget {
  @override
  Widget build(BuildContext context) => StreamProvider.value(
        // initialData: 初期値を生成するための値を設定。設定しない場合はnullで生成される
        initialData: CurrentUser.initial,

        // CurrentUser.create(user)を返し、mapに変換し、オブザーバー（監視者）に登録して下位のwidgetで使えるvalueとする
        value: FirebaseAuth.instance.onAuthStateChanged
            .map((user) => CurrentUser.create(user)),
        child: Consumer<CurrentUser>(
          builder: (context, user, _) => MaterialApp(
            title: 'Keep',
            home: user.isInitialValue
                ? Scaffold(body: const Text('Loading...'))
                : user.data != null ? HomeScreen() : LoginScreen(),
          ),
        ),
      );
}
