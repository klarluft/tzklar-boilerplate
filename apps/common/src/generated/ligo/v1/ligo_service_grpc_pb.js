// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var ligo_v1_ligo_service_pb = require('../../ligo/v1/ligo_service_pb.js');

function serialize_ligo_v1_CompileContractRequest(arg) {
  if (!(arg instanceof ligo_v1_ligo_service_pb.CompileContractRequest)) {
    throw new Error('Expected argument of type ligo.v1.CompileContractRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ligo_v1_CompileContractRequest(buffer_arg) {
  return ligo_v1_ligo_service_pb.CompileContractRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ligo_v1_CompileContractResponse(arg) {
  if (!(arg instanceof ligo_v1_ligo_service_pb.CompileContractResponse)) {
    throw new Error('Expected argument of type ligo.v1.CompileContractResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ligo_v1_CompileContractResponse(buffer_arg) {
  return ligo_v1_ligo_service_pb.CompileContractResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ligo_v1_CompileExpressionRequest(arg) {
  if (!(arg instanceof ligo_v1_ligo_service_pb.CompileExpressionRequest)) {
    throw new Error('Expected argument of type ligo.v1.CompileExpressionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ligo_v1_CompileExpressionRequest(buffer_arg) {
  return ligo_v1_ligo_service_pb.CompileExpressionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ligo_v1_CompileExpressionResponse(arg) {
  if (!(arg instanceof ligo_v1_ligo_service_pb.CompileExpressionResponse)) {
    throw new Error('Expected argument of type ligo.v1.CompileExpressionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ligo_v1_CompileExpressionResponse(buffer_arg) {
  return ligo_v1_ligo_service_pb.CompileExpressionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var LigoServiceService = exports.LigoServiceService = {
  // Compile contract endpoint
compileContract: {
    path: '/ligo.v1.LigoService/CompileContract',
    requestStream: false,
    responseStream: false,
    requestType: ligo_v1_ligo_service_pb.CompileContractRequest,
    responseType: ligo_v1_ligo_service_pb.CompileContractResponse,
    requestSerialize: serialize_ligo_v1_CompileContractRequest,
    requestDeserialize: deserialize_ligo_v1_CompileContractRequest,
    responseSerialize: serialize_ligo_v1_CompileContractResponse,
    responseDeserialize: deserialize_ligo_v1_CompileContractResponse,
  },
  compileExpression: {
    path: '/ligo.v1.LigoService/CompileExpression',
    requestStream: false,
    responseStream: false,
    requestType: ligo_v1_ligo_service_pb.CompileExpressionRequest,
    responseType: ligo_v1_ligo_service_pb.CompileExpressionResponse,
    requestSerialize: serialize_ligo_v1_CompileExpressionRequest,
    requestDeserialize: deserialize_ligo_v1_CompileExpressionRequest,
    responseSerialize: serialize_ligo_v1_CompileExpressionResponse,
    responseDeserialize: deserialize_ligo_v1_CompileExpressionResponse,
  },
};

exports.LigoServiceClient = grpc.makeGenericClientConstructor(LigoServiceService);
