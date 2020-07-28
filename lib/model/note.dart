import 'package:flutter/material.dart';

class Note {
  final String id;
  String title;
  String content;
  Color color;
  NoteState state;
  final DateTime createdAt;
  DateTime modifiedAt;

  // インスタンス作成。
  // 'this.createdAt = createdAt ?? DateTime.now()'の部分の解説
  // this.createdAtにcreatedAtがnullじゃなければcreatedAtを、
  // nullの場合はDateTime.now()を代入する評価式
  // A = B ?? C -> if (B=null) A = B, elif (B!=null) A = C
  // print(1 ?? 3); <- Prints 1, print(null ?? 12); <- Prints 12
  Note({
    this.id,
    this.title,
    this.content,
    this.color,
    this.state,
    DateTime createdAt,
    DateTime modifiedAt,
  })  : this.createdAt = createdAt ?? DateTime.now(),
        this.modifiedAt = modifiedAt ?? DateTime.now();
}
