/// <reference types="node" />
export declare class UUID {
    private ascii;
    private binary;
    private version;
    private variant;
    static readonly DNS: UUID;
    static readonly URL: UUID;
    static readonly OID: UUID;
    static readonly X500: UUID;
    constructor(uuid: Buffer | string);
    static v1(): any;
    static v5(name: string | Buffer, namespace: string | Buffer | UUID): any;
    toString(): string;
    toBuffer(): Buffer;
    inspect(): string;
    static check(uuid: Buffer | string, offset?: number): false | {
        version: undefined;
        variant: string;
        format: string;
    } | {
        version: number;
        variant: string;
        format: string;
    };
    static parse(input: string): Buffer;
}
export interface UuidOptions {
    encoding?: string;
    name?: string;
    namespace?: string | UUID | Buffer;
}
export declare const nil: UUID;
