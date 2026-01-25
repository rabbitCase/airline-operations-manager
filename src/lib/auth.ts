import { cookies } from 'next/headers';

export async function setStaffSession(staffName: string) {
    const cookieStore = await cookies();
    cookieStore.set('staffName', staffName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
    });
}

export async function getStaffSession() {
    const cookieStore = await cookies();
    return cookieStore.get('staffName')?.value || null;
}

export async function clearStaffSession() {
    const cookieStore = await cookies();
    cookieStore.delete('staffName');
}