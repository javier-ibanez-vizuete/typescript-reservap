export type BookingType = {
    tableId: string;
    scheduledFor: string;
    partySize: number;
    status: string;
    notes: string;
    extras: XtraType,
    userId: string;
    requestedAt: string;
    createdAt: string;
    updatedAt: string;
    cancelledAt: string;
    id: string;
}

type XtraType = {
    highChair?: boolean;
}