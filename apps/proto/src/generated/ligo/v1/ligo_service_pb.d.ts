// package: ligo.v1
// file: ligo/v1/ligo_service.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class CompileContractRequest extends jspb.Message { 
    getContractContent(): string;
    setContractContent(value: string): CompileContractRequest;
    clearConstantsList(): void;
    getConstantsList(): Array<string>;
    setConstantsList(value: Array<string>): CompileContractRequest;
    addConstants(value: string, index?: number): string;

    hasDisableMichelsonTypechecking(): boolean;
    clearDisableMichelsonTypechecking(): void;
    getDisableMichelsonTypechecking(): boolean | undefined;
    setDisableMichelsonTypechecking(value: boolean): CompileContractRequest;

    hasDisplayFormat(): boolean;
    clearDisplayFormat(): void;
    getDisplayFormat(): DisplayFormat | undefined;
    setDisplayFormat(value: DisplayFormat): CompileContractRequest;

    hasMichelsonFormat(): boolean;
    clearMichelsonFormat(): void;
    getMichelsonFormat(): MichelsonFormat | undefined;
    setMichelsonFormat(value: MichelsonFormat): CompileContractRequest;
    getSyntax(): Syntax;
    setSyntax(value: Syntax): CompileContractRequest;
    clearViewsList(): void;
    getViewsList(): Array<string>;
    setViewsList(value: Array<string>): CompileContractRequest;
    addViews(value: string, index?: number): string;
    getEntryPoint(): string;
    setEntryPoint(value: string): CompileContractRequest;

    hasProtocol(): boolean;
    clearProtocol(): void;
    getProtocol(): Protocol | undefined;
    setProtocol(value: Protocol): CompileContractRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CompileContractRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CompileContractRequest): CompileContractRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CompileContractRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CompileContractRequest;
    static deserializeBinaryFromReader(message: CompileContractRequest, reader: jspb.BinaryReader): CompileContractRequest;
}

export namespace CompileContractRequest {
    export type AsObject = {
        contractContent: string,
        constantsList: Array<string>,
        disableMichelsonTypechecking?: boolean,
        displayFormat?: DisplayFormat,
        michelsonFormat?: MichelsonFormat,
        syntax: Syntax,
        viewsList: Array<string>,
        entryPoint: string,
        protocol?: Protocol,
    }
}

export class CompileContractResponse extends jspb.Message { 
    getCompiledContractContent(): string;
    setCompiledContractContent(value: string): CompileContractResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CompileContractResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CompileContractResponse): CompileContractResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CompileContractResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CompileContractResponse;
    static deserializeBinaryFromReader(message: CompileContractResponse, reader: jspb.BinaryReader): CompileContractResponse;
}

export namespace CompileContractResponse {
    export type AsObject = {
        compiledContractContent: string,
    }
}

export class CompileExpressionRequest extends jspb.Message { 
    getContractContent(): string;
    setContractContent(value: string): CompileExpressionRequest;
    getSyntax(): Syntax;
    setSyntax(value: Syntax): CompileExpressionRequest;
    getExpressionName(): string;
    setExpressionName(value: string): CompileExpressionRequest;

    hasDisplayFormat(): boolean;
    clearDisplayFormat(): void;
    getDisplayFormat(): DisplayFormat | undefined;
    setDisplayFormat(value: DisplayFormat): CompileExpressionRequest;

    hasMichelsonFormat(): boolean;
    clearMichelsonFormat(): void;
    getMichelsonFormat(): MichelsonFormat | undefined;
    setMichelsonFormat(value: MichelsonFormat): CompileExpressionRequest;

    hasProtocol(): boolean;
    clearProtocol(): void;
    getProtocol(): Protocol | undefined;
    setProtocol(value: Protocol): CompileExpressionRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CompileExpressionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CompileExpressionRequest): CompileExpressionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CompileExpressionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CompileExpressionRequest;
    static deserializeBinaryFromReader(message: CompileExpressionRequest, reader: jspb.BinaryReader): CompileExpressionRequest;
}

export namespace CompileExpressionRequest {
    export type AsObject = {
        contractContent: string,
        syntax: Syntax,
        expressionName: string,
        displayFormat?: DisplayFormat,
        michelsonFormat?: MichelsonFormat,
        protocol?: Protocol,
    }
}

export class CompileExpressionResponse extends jspb.Message { 
    getCompiledExpressionContent(): string;
    setCompiledExpressionContent(value: string): CompileExpressionResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CompileExpressionResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CompileExpressionResponse): CompileExpressionResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CompileExpressionResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CompileExpressionResponse;
    static deserializeBinaryFromReader(message: CompileExpressionResponse, reader: jspb.BinaryReader): CompileExpressionResponse;
}

export namespace CompileExpressionResponse {
    export type AsObject = {
        compiledExpressionContent: string,
    }
}

export enum DisplayFormat {
    DISPLAY_FORMAT_DEV = 0,
    DISPLAY_FORMAT_JSON = 1,
    DISPLAY_FORMAT_HUMAN_READABLE = 2,
}

export enum MichelsonFormat {
    MICHELSON_FORMAT_TEXT = 0,
    MICHELSON_FORMAT_JSON = 1,
    MICHELSON_FORMAT_HEX = 2,
}

export enum Syntax {
    SYNTAX_PASCALIGO = 0,
    SYNTAX_CAMELIGO = 1,
    SYNTAX_REASONLIGO = 2,
    SYNTAX_JSLIGO = 3,
}

export enum Protocol {
    PROTOCOL_HANGZHOU = 0,
    PROTOCOL_ITHACA = 1,
}
