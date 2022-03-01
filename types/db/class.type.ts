/**
 * Created by Aubin C. Spitzer (@aubincspitzer) on 02/28/2022
 * 
 * Describes the data structure for classes (groups / places to organize notes)
 * All classes should have at least one teacher, identified by a string ID, they do not need to have an acct.
 * Verification for the forseeable future will be done manually and this will show who (of platform admin) verified and when.
 * slug used for URLs, no standardized format yet.
 */

export type Class = {
    id: string;
    slug: string;
    displayName: string;
    teachers: Array<string>;
    verification: {
        verifiedAt?: string;
        verifiedBy?: string;
    }
    createdAt: string;
    lastModifiedAt: string;
}