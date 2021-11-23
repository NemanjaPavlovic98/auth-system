export interface User{
    name: string,
    username: string,
    email: string,
    password: string,
    imageUrl?: string | null
}

export interface UserCredentials{
    email: string;
    password: string;
}

export interface UserResponse{
    id: number,
    name: string,
    username: string,
    email: string,
    imageUrl: string | null
}

export interface AuthenticationResponse{
    token: string;
    expirationTime: number;
    user: UserResponse
}

// export interface userDTO{
//     id: string;
//     email: string;
// }

// export class User {
//     id:number;
//     username:string;
//     fullname:string;
//     email:string;
//     isAdmin:boolean;
//   }
  