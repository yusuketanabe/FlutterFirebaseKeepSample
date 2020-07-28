// ユーザーIDとして使うランダムIDを作る

import * as uuid from 'uuid'

export const randomID = () => uuid.v4()
