# gRPC Protobuffers

Packages defining services and how they communicate

## Build

Run this command to generate necessary code and copy it to other monorepo packages

`yarn codegen`

## Prerequisites

You need some apps installed on your machine (MacOS):
`brew install protobuf`
`brew install bufbuild/buf/buf`

You need some npm packages installed gloablly in order to generate code

`npm install --global grpc-tools`
`npm install --global grpc_tools_node_protoc_ts`
