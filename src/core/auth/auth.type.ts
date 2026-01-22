import type { BookingType } from "../../types/bookings.type";
import type { OrderType } from "../../types/orders.type";

export type Register = {
    name: string;
    email: string;
    password: string;
    avatar: AvatarType;
    phoneNumber: string | number;
    address: string;
}

export type Login = {
    email: string;
    password: string;
}

export interface User {
    _id: string,
    name: string,
    email: string,
    password: string,
    phoneNumber: number,
    avatar: AvatarType,
    address: string,
    role: "user" | "admin",
    isActive: boolean,
    orders: OrderType[],
    bookings: BookingType[],
    createdAt: string,
    updatedAt: string,
    __v: number
};

export type AvatarType = {
    url: string;
    alt: string;
}

export type Token = string;

export type UserResponse = {
    token: Token;
    user: User;
}

export type LogoutResponse = {
    message: string;
    logout: boolean;
}