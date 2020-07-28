## 'firebase deploy'コマンドでルールを適用させれる
## 以下はサンプル

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAnyAuthenticated() {
      return request.auth != null;
    }

    function isUserAuthenticated(userID) {
      return isAnyAuthenticated() && userID == request.auth.uid;
    }

    match /users/{userID} {
      allow create: if isUserAuthenticated(userID)
        && (!('name' in request.resource.data) || (request.resource.data.name is string && request.resource.data.name.size() <= 20))
        && request.resource.data.createdAt == request.time
        && request.resource.data.updatedAt == request.time
      ;
      allow get: if isUserAuthenticated(userID);
      allow update: if isUserAuthenticated(userID)
        && request.resource.data.createdAt == resource.data.createdAt
        && request.resource.data.updatedAt == request.time
        && request.resource.data.userID == resource.data.userID
      ;
      allow delete: if isUserAuthenticated(userID);
  
      match /did/{didID} {
        allow create: if isUserAuthenticated(userID)
          && (request.resource.data.title is string && request.resource.data.title.size() <= 140)
          && request.resource.data.createdAt == request.time
          && request.resource.data.updatedAt == request.time
          && request.resource.data.completedAt == request.time
          && (request.resource.data.isCompleted == true)
        ;
        allow read: if isUserAuthenticated(userID);
        allow update: if isUserAuthenticated(userID)
          && request.resource.data.userID == resource.data.userID
          && request.resource.data.updatedAt == request.time
        ;
        allow delete: if isUserAuthenticated(userID);

        match /dig/{digID} {
          allow create: if isUserAuthenticated(userID)
            && (request.resource.data.title is string && request.resource.data.title.size() <= 140)
            && request.resource.data.createdAt == request.time
            && request.resource.data.updatedAt == request.time
            && (request.resource.data.isCompleted == false)
            && (!('completedAt' in request.resource.data) || request.resource.data.completedAt == null)
          ;
          allow read: if isUserAuthenticated(userID);
          allow update: if isUserAuthenticated(userID)
            && (request.resource.data.title is string && request.resource.data.title.size() <= 140)
            && (
              (resource.data.isCompleted == false && request.resource.data.isCompleted == true && request.resource.data.completedAt == request.time)
              || (resource.data.isCompleted == request.resource.data.isCompleted && resource.data.completedAt == request.resource.data.completedAt)
              || (request.resource.data.isCompleted == false && request.resource.data.completedAt == null)
              )
            && (!('createdAt' in request.resource.data) || resource.data.createdAt == request.resource.data.createdAt)
            && request.resource.data.updatedAt == request.time
            && request.resource.data.userID == resource.data.userID
          ;
          allow delete: if isUserAuthenticated(userID);
        }
      }
    }
  }
}