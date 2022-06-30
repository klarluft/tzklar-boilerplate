// package: ligo.v1
// file: ligo/v1/ligo_service.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as ligo_v1_ligo_service_pb from "../../ligo/v1/ligo_service_pb";

interface ILigoServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    compileContract: ILigoServiceService_ICompileContract;
    compileExpression: ILigoServiceService_ICompileExpression;
}

interface ILigoServiceService_ICompileContract extends grpc.MethodDefinition<ligo_v1_ligo_service_pb.CompileContractRequest, ligo_v1_ligo_service_pb.CompileContractResponse> {
    path: "/ligo.v1.LigoService/CompileContract";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ligo_v1_ligo_service_pb.CompileContractRequest>;
    requestDeserialize: grpc.deserialize<ligo_v1_ligo_service_pb.CompileContractRequest>;
    responseSerialize: grpc.serialize<ligo_v1_ligo_service_pb.CompileContractResponse>;
    responseDeserialize: grpc.deserialize<ligo_v1_ligo_service_pb.CompileContractResponse>;
}
interface ILigoServiceService_ICompileExpression extends grpc.MethodDefinition<ligo_v1_ligo_service_pb.CompileExpressionRequest, ligo_v1_ligo_service_pb.CompileExpressionResponse> {
    path: "/ligo.v1.LigoService/CompileExpression";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<ligo_v1_ligo_service_pb.CompileExpressionRequest>;
    requestDeserialize: grpc.deserialize<ligo_v1_ligo_service_pb.CompileExpressionRequest>;
    responseSerialize: grpc.serialize<ligo_v1_ligo_service_pb.CompileExpressionResponse>;
    responseDeserialize: grpc.deserialize<ligo_v1_ligo_service_pb.CompileExpressionResponse>;
}

export const LigoServiceService: ILigoServiceService;

export interface ILigoServiceServer extends grpc.UntypedServiceImplementation {
    compileContract: grpc.handleUnaryCall<ligo_v1_ligo_service_pb.CompileContractRequest, ligo_v1_ligo_service_pb.CompileContractResponse>;
    compileExpression: grpc.handleUnaryCall<ligo_v1_ligo_service_pb.CompileExpressionRequest, ligo_v1_ligo_service_pb.CompileExpressionResponse>;
}

export interface ILigoServiceClient {
    compileContract(request: ligo_v1_ligo_service_pb.CompileContractRequest, callback: (error: grpc.ServiceError | null, response: ligo_v1_ligo_service_pb.CompileContractResponse) => void): grpc.ClientUnaryCall;
    compileContract(request: ligo_v1_ligo_service_pb.CompileContractRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ligo_v1_ligo_service_pb.CompileContractResponse) => void): grpc.ClientUnaryCall;
    compileContract(request: ligo_v1_ligo_service_pb.CompileContractRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ligo_v1_ligo_service_pb.CompileContractResponse) => void): grpc.ClientUnaryCall;
    compileExpression(request: ligo_v1_ligo_service_pb.CompileExpressionRequest, callback: (error: grpc.ServiceError | null, response: ligo_v1_ligo_service_pb.CompileExpressionResponse) => void): grpc.ClientUnaryCall;
    compileExpression(request: ligo_v1_ligo_service_pb.CompileExpressionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ligo_v1_ligo_service_pb.CompileExpressionResponse) => void): grpc.ClientUnaryCall;
    compileExpression(request: ligo_v1_ligo_service_pb.CompileExpressionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ligo_v1_ligo_service_pb.CompileExpressionResponse) => void): grpc.ClientUnaryCall;
}

export class LigoServiceClient extends grpc.Client implements ILigoServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public compileContract(request: ligo_v1_ligo_service_pb.CompileContractRequest, callback: (error: grpc.ServiceError | null, response: ligo_v1_ligo_service_pb.CompileContractResponse) => void): grpc.ClientUnaryCall;
    public compileContract(request: ligo_v1_ligo_service_pb.CompileContractRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ligo_v1_ligo_service_pb.CompileContractResponse) => void): grpc.ClientUnaryCall;
    public compileContract(request: ligo_v1_ligo_service_pb.CompileContractRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ligo_v1_ligo_service_pb.CompileContractResponse) => void): grpc.ClientUnaryCall;
    public compileExpression(request: ligo_v1_ligo_service_pb.CompileExpressionRequest, callback: (error: grpc.ServiceError | null, response: ligo_v1_ligo_service_pb.CompileExpressionResponse) => void): grpc.ClientUnaryCall;
    public compileExpression(request: ligo_v1_ligo_service_pb.CompileExpressionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: ligo_v1_ligo_service_pb.CompileExpressionResponse) => void): grpc.ClientUnaryCall;
    public compileExpression(request: ligo_v1_ligo_service_pb.CompileExpressionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: ligo_v1_ligo_service_pb.CompileExpressionResponse) => void): grpc.ClientUnaryCall;
}
