/**
 * Created by Aubin C. Spitzer (@aubincspitzer) on 02/28/2022
 * 
 * Describes a teacher's profile (to be associated with classes)
 */

export type Teacher = {
    id: string;
    profile: {
        email: string;
        displayName: string;
        image: string;
    }
    verification: {
        verifiedAt?: string;
        verifiedBy?: string;
    }
    createdAt: string;
    lastModifiedAt: string;
}