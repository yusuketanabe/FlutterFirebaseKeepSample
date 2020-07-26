import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _auth = FirebaseAuth.instance;
  final _googleSignIn = GoogleSignIn();
  String _errorMessage;

  @override
  Widget buil(BuildContext context) => Scaffold(
        body: Center(
          child: Column(
            children: <Widget>[
              RaisedButton(
                onPressed: _signInWithGoogle,
                child: const Text('Continue with Google'),
              ),
              if (_errorMessage != null)
                Text(
                  _errorMessage,
                  style: const TextStyle(color: Colors.red),
                ),
            ],
          ),
        ),
      );

  void _signInWithGoogle() async {
    _setLoggingIn();
    String errMsg;

    try {
      final googleUser = await _googleSignIn.signIn();
      final googleAuth = await googleUser.authentication;
      final credential = GoogleAuthProvider.getCredential(
        idToken: googleAuth.idToken,
        accessToken: googleAuth.accesToken,
      );
      await _auth.signInWithCredential(credential);
    } catch (e) {
      errMsg = 'Login failed, please try again later.';
    } finally {
      _setLoggingIn(false, errMsg);
    }
  }

  void _setLoggingIn([bool logginIn = true, String errMsg]) {
    if (mounted) {
      setState(() {
        _logginIn = logginIn;
        _errorMessage = errMsg;
      });
    }
  }
}
